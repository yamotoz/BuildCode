import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const GET: APIRoute = async ({ request, url }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Não autenticado.' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user: caller } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!caller) {
    return new Response(JSON.stringify({ error: 'Token inválido.' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: callerProfile } = await adminClient
    .from('profiles').select('role').eq('id', caller.id).single();

  if (!callerProfile || !['master', 'admin'].includes(callerProfile.role)) {
    return new Response(JSON.stringify({ error: 'Sem permissão.' }), {
      status: 403, headers: { 'Content-Type': 'application/json' },
    });
  }

  const targetUserId = url.searchParams.get('userId');
  if (!targetUserId) {
    return new Response(JSON.stringify({ error: 'userId é obrigatório.' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const [logsRes, creditsRes, subRes, profileRes] = await Promise.all([
    adminClient
      .from('usage_logs')
      .select('action, llm_model, tokens_used, cost_usd, created_at')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .limit(500),
    adminClient
      .from('user_credits')
      .select('*')
      .eq('user_id', targetUserId)
      .single(),
    adminClient
      .from('subscriptions')
      .select('plan, billing_cycle, status, current_period_end')
      .eq('user_id', targetUserId)
      .single(),
    adminClient
      .from('profiles')
      .select('full_name, email, avatar_url, role, seniority, created_at')
      .eq('id', targetUserId)
      .single(),
  ]);

  return new Response(JSON.stringify({
    profile: profileRes.data || null,
    logs: logsRes.data || [],
    credits: creditsRes.data || null,
    subscription: subRes.data || null,
  }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
