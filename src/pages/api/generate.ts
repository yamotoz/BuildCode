import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;
const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Tiers de modelos
type ModelTier = 'budget' | 'mid' | 'pro';

// Mapeamento modelo → provider + ID nativo + tier
const MODEL_MAP: Record<string, { provider: 'google' | 'openai' | 'openrouter'; nativeModel: string; tier: ModelTier }> = {
  // Budget (Free) — Explorador pode usar
  'google/gemma-3-4b-it:free':                       { provider: 'google', nativeModel: 'gemma-3-4b-it', tier: 'budget' },
  'meta-llama/llama-3.1-8b-instruct:free':           { provider: 'openrouter', nativeModel: 'meta-llama/llama-3.1-8b-instruct:free', tier: 'budget' },
  'mistralai/mistral-small-3.1-24b-instruct:free':   { provider: 'openrouter', nativeModel: 'mistralai/mistral-small-3.1-24b-instruct:free', tier: 'budget' },
  // Mid — Consultor e Arquiteto
  'google/gemini-2.0-flash-001':                     { provider: 'google', nativeModel: 'gemini-2.0-flash', tier: 'mid' },
  'openai/gpt-4o-mini':                              { provider: 'openai', nativeModel: 'gpt-4o-mini', tier: 'mid' },
  'anthropic/claude-3.5-haiku':                      { provider: 'openrouter', nativeModel: 'anthropic/claude-3.5-haiku', tier: 'mid' },
  // Pro — Consultor (20/mês) e Arquiteto (50/mês)
  'anthropic/claude-sonnet-4':                       { provider: 'openrouter', nativeModel: 'anthropic/claude-sonnet-4', tier: 'pro' },
  'openai/gpt-4o':                                   { provider: 'openai', nativeModel: 'gpt-4o', tier: 'pro' },
  'google/gemini-2.5-pro-preview':                   { provider: 'google', nativeModel: 'gemini-2.5-pro-preview', tier: 'pro' },
};

// Limites de uso mensal por plano e tier
const PLAN_LIMITS: Record<string, Record<ModelTier, number>> = {
  explorador: { budget: 50, mid: 0, pro: 0 },
  consultor:  { budget: 999999, mid: 999999, pro: 20 },
  arquiteto:  { budget: 999999, mid: 999999, pro: 50 },
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Chamada para API do Google Gemini
async function callGemini(model: string, systemPrompt: string, userPrompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Gemini API error');
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Chamada para API da OpenAI
async function callOpenAI(model: string, systemPrompt: string, userPrompt: string) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI API error');
  return data.choices?.[0]?.message?.content || '';
}

// Chamada para OpenRouter (Anthropic, Meta, Mistral)
async function callOpenRouter(model: string, systemPrompt: string, userPrompt: string) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://buildcode.com.br',
      'X-Title': 'BuildCode',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenRouter API error');
  return data.choices?.[0]?.message?.content || '';
}

export const POST: APIRoute = async ({ request }) => {
  // Autenticação
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Não autenticado.' }, 401);
  }

  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) {
    return json({ error: 'Token inválido.' }, 401);
  }

  let body: { model: string; systemPrompt: string; userPrompt: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido.' }, 400);
  }

  const { model, systemPrompt, userPrompt } = body;
  if (!model || !userPrompt) {
    return json({ error: 'model e userPrompt são obrigatórios.' }, 400);
  }

  const mapping = MODEL_MAP[model];
  if (!mapping) {
    return json({ error: `Modelo "${model}" não suportado.` }, 400);
  }

  // ═══ Verificação de plano e limites de uso ═══
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Buscar plano do usuário
  const { data: sub } = await adminClient
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  const userPlan = sub?.plan || 'explorador';
  const limits = PLAN_LIMITS[userPlan] || PLAN_LIMITS.explorador;
  const tierLimit = limits[mapping.tier];

  // Buscar indie credits (Recarga Rebelde)
  const indieField: Record<ModelTier, string> = {
    budget: 'indie_credits_economy',
    mid: 'indie_credits_mid',
    pro: 'indie_credits_elite',
  };
  const { data: userCredits } = await adminClient
    .from('user_credits')
    .select('*')
    .eq('user_id', user.id)
    .single();
  const indieCredits = (userCredits as any)?.[indieField[mapping.tier]] || 0;

  // Verificar uso mensal
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const tierAction = `generation_${mapping.tier}`;
  const tierModels = Object.entries(MODEL_MAP).filter(([, v]) => v.tier === mapping.tier).map(([k]) => k);

  const { count: countByAction } = await adminClient
    .from('usage_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('action', tierAction)
    .gte('created_at', monthStart.toISOString());

  const { count: countByModel } = await adminClient
    .from('usage_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('llm_model', tierModels)
    .neq('action', tierAction)
    .gte('created_at', monthStart.toISOString());

  const usageCount = (countByAction || 0) + (countByModel || 0);

  // Calcular créditos totais disponíveis:
  // - Explorador: indie credits + plan credits
  // - Consultor/Arquiteto: apenas plan credits (indie intocado)
  const isExplorador = userPlan === 'explorador';
  let totalAvailable: number;
  if (tierLimit >= 999999) {
    totalAvailable = 999999;
  } else if (isExplorador) {
    totalAvailable = tierLimit + indieCredits;
  } else {
    totalAvailable = tierLimit;
  }

  // Bloquear se zero créditos disponíveis (plano + indie)
  if (totalAvailable === 0) {
    const tierNames: Record<ModelTier, string> = { budget: 'econômico', mid: 'intermediário', pro: 'profissional' };
    return json({ error: `Modelo ${tierNames[mapping.tier]} não disponível. Você não tem créditos ${tierNames[mapping.tier]}. Faça upgrade ou compre uma Recarga Rebelde.` }, 403);
  }

  if (usageCount >= totalAvailable) {
    return json({
      error: `Limite atingido (${usageCount}/${totalAvailable} requisições ${mapping.tier}). Aguarde o próximo mês, faça upgrade ou compre uma Recarga Rebelde.`,
      limitReached: true,
      used: usageCount,
      limit: totalAvailable,
    }, 429);
  }

  // Verificar se a API key do provider está configurada
  if (mapping.provider === 'google' && !GEMINI_API_KEY) {
    return json({ error: 'GEMINI_API_KEY não configurada.' }, 500);
  }
  if (mapping.provider === 'openai' && !OPENAI_API_KEY) {
    return json({ error: 'OPENAI_API_KEY não configurada.' }, 500);
  }
  if (mapping.provider === 'openrouter' && !OPENROUTER_API_KEY) {
    return json({ error: 'OPENROUTER_API_KEY não configurada.' }, 500);
  }

  try {
    let result = '';
    const sys = systemPrompt || 'Você é o BuildCode AI Engine, um arquiteto de software de elite.';

    switch (mapping.provider) {
      case 'google':
        result = await callGemini(mapping.nativeModel, sys, userPrompt);
        break;
      case 'openai':
        result = await callOpenAI(mapping.nativeModel, sys, userPrompt);
        break;
      case 'openrouter':
        result = await callOpenRouter(mapping.nativeModel, sys, userPrompt);
        break;
    }

    // Registrar uso na usage_logs (com verificação)
    // Action inclui o tier para facilitar contagem: generation_budget, generation_mid, generation_pro
    const { error: logError } = await adminClient.from('usage_logs').insert({
      user_id: user.id,
      action: `generation_${mapping.tier}`,
      llm_model: model,
      tokens_used: 0,
      cost_usd: 0,
    });
    if (logError) {
      console.error('[generate] Erro ao registrar uso:', logError.message);
    }

    return json({ result, provider: mapping.provider, model: mapping.nativeModel, tier: mapping.tier });
  } catch (err: any) {
    console.error(`[generate] Erro (${mapping.provider}/${mapping.nativeModel}):`, err.message);
    return json({ error: err.message || 'Erro ao gerar conteúdo.' }, 500);
  }
};
