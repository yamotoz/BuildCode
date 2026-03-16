import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify user identity with anon key
  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) {
    return new Response(JSON.stringify({ error: 'Token inválido.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Read usage_logs with service role (bypasses RLS)
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: logs } = await adminClient
    .from('usage_logs')
    .select('action, llm_model, tokens_used, cost_usd, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(500);

  // Read user_credits with service role
  const { data: credits } = await adminClient
    .from('user_credits')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return new Response(JSON.stringify({ logs: logs || [], credits: credits || null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
