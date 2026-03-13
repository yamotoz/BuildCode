import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

const PROMPT_CHAR_LIMITS: Record<string, number> = {
  explorador: 10000,
  consultor: 25000,
  arquiteto: 80000,
};

const PROJECT_LIMITS: Record<string, number> = {
  explorador: 3,
  consultor: 15,
  arquiteto: 999999,
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // Auth
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Não autenticado.' }, 401);
  }

  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) {
    return json({ error: 'Token inválido.' }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido.' }, 400);
  }

  const { name, business_context, scale, nature, generated_prd, generated_prompt, agent_used, llm_model, image_url, prd_storage_path, prompt_storage_path } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return json({ error: 'Nome do projeto é obrigatório.' }, 400);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Get user plan
  const { data: sub } = await adminClient
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  const userPlan = sub?.plan || 'explorador';

  // Validate project count limit
  const maxProjects = PROJECT_LIMITS[userPlan] || 3;
  const { count: projectCount } = await adminClient
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if ((projectCount || 0) >= maxProjects) {
    return json({ error: `Limite de ${maxProjects} projetos atingido no plano ${userPlan}. Apague um projeto ou faça upgrade.` }, 403);
  }

  // Validate prompt base char limit
  const promptLimit = PROMPT_CHAR_LIMITS[userPlan] || 10000;
  const promptText = generated_prompt || '';
  if (promptText.length > promptLimit) {
    return json({ error: `Prompt Base excede o limite de ${promptLimit.toLocaleString()} caracteres do plano ${userPlan}.` }, 403);
  }

  // Sanitize inputs
  const sanitize = (s: any, max: number) => typeof s === 'string' ? s.slice(0, max) : '';

  // Insert project
  const { data: project, error } = await adminClient.from('projects').insert({
    user_id: user.id,
    name: sanitize(name, 100),
    business_context: sanitize(business_context, 500),
    scale: sanitize(scale, 50),
    nature: sanitize(nature, 50),
    generated_prd: sanitize(generated_prd, 500000),
    generated_prompt: sanitize(generated_prompt, promptLimit),
    agent_used: sanitize(agent_used, 50),
    llm_model: sanitize(llm_model, 100),
    image_url: sanitize(image_url, 500),
    prd_storage_path: prd_storage_path || null,
    prompt_storage_path: prompt_storage_path || null,
  }).select('id').single();

  if (error) {
    console.error('[save-project] Supabase error:', error);
    return json({ error: error.message || 'Erro ao salvar projeto.' }, 500);
  }

  return json({ success: true, id: project?.id });
};
