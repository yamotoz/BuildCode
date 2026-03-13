import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { agents, getAgent } from '../../data/agents';

export const prerender = false;

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

const baseSystemPrompt = `REGRAS GERAIS (aplique SEMPRE alem da personalidade):
Responda SEMPRE em Portugues (PT-BR).
IMPORTANTE: NUNCA use formatacao markdown. Nada de **, #, \`, - ou *. Texto puro, quebras de linha para separar paragrafos.
Seja HUMANO. Fale como uma pessoa real falaria numa conversa. Nada de respostas roboticas, genericas ou de chatbot. Use contrações, girias leves, fala natural. Respostas CURTAS e DIRETAS — maximo 2-3 paragrafos pequenos. Nao enrole.
PROIBIDO GERAR CODIGO. Voce e um MENTOR, nao um programador. Sua funcao e APENAS tirar duvidas, orientar, recomendar stacks, explicar conceitos e dar direcao. Se o usuario pedir codigo, explique o conceito ou a logica por cima, mas NUNCA escreva codigo, snippets, exemplos de codigo, comandos ou qualquer trecho tecnico executavel. Redirecione o usuario para a ferramenta de desenvolvimento dele.
O usuario esta no wizard BuildCode. As selecoes dele vem entre colchetes [Contexto do wizard: ...]. USE essas infos pra contextualizar suas respostas na stack dele.
Quando o usuario disser que nao tem mais nada a adicionar ou quiser prosseguir com a geracao, responda EXATAMENTE com a frase: "Perfeito! Vou fechar o chat e iniciar a geracao do seu PRD e Prompt Base. Aguarde um momento..." — isso aciona o sistema automaticamente.
Se perguntado sobre algo fora do escopo de dev, redirecione mantendo a personalidade.`;

export const POST: APIRoute = async ({ request }) => {
  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { messages: { role: string; content: string }[]; agentId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages, agentId } = body;
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Autenticação
  const authHeader = request.headers.get('authorization');
  let userPlan = 'explorador';

  if (authHeader?.startsWith('Bearer ')) {
    const anonClient = createClient(supabaseUrl, supabaseAnon);
    const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));

    if (user) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      const { data: sub } = await adminClient
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      userPlan = sub?.plan || 'explorador';

      // Verificar limite de uso mensal para chat (conta como budget)
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const limit = userPlan === 'explorador' ? 50 : 999999;

      const { count } = await adminClient
        .from('usage_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('action', 'chat_message')
        .gte('created_at', monthStart.toISOString());

      if ((count || 0) >= limit) {
        return new Response(JSON.stringify({
          error: 'Limite mensal de mensagens atingido (50/mês no plano Explorador). Faça upgrade para continuar.',
        }), { status: 429, headers: { 'Content-Type': 'application/json' } });
      }
    }
  }

  // Explorador só pode usar The Boss
  let effectiveAgentId = agentId || 'theboss';
  if (userPlan === 'explorador' && effectiveAgentId !== 'theboss') {
    effectiveAgentId = 'theboss';
  }

  // Busca a personalidade do agente selecionado
  const agent = getAgent(effectiveAgentId);
  const systemPrompt = `${agent.systemPrompt}\n\n${baseSystemPrompt}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-10),
        ],
        max_tokens: 400,
        temperature: 0.85,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      return new Response(JSON.stringify({ error: err.error?.message || 'OpenAI API error' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Sem resposta.';

    // Registrar uso na usage_logs
    if (user) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      await adminClient.from('usage_logs').insert({
        user_id: user.id,
        action: 'chat_message',
        llm_model: 'gpt-4o-mini',
        tokens_used: data.usage?.total_tokens || 0,
        cost_usd: 0,
      });
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
