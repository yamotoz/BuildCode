import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: APIRoute = async ({ request }) => {
  const json = (data: any, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

  if (!serviceRoleKey) return json({ error: 'Service unavailable' }, 500);

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);

  const anonClient = createClient(supabaseUrl, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) return json({ error: 'Invalid token' }, 401);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: callerProfile } = await adminClient.from('profiles').select('role').eq('id', user.id).single();
  if (!callerProfile || callerProfile.role !== 'master') {
    return json({ error: 'Forbidden' }, 403);
  }

  let body: { plan?: string; userId?: string; resetCredits?: boolean };
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const targetUserId = body.userId || user.id;
  const validPlans = ['explorador', 'consultor', 'arquiteto', 'vip'];

  if (body.plan && validPlans.includes(body.plan)) {
    await adminClient.from('subscriptions').upsert({
      user_id: targetUserId,
      plan: body.plan,
      status: 'active',
      billing_cycle: 'monthly',
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'user_id' });
  }

  if (body.resetCredits) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    await adminClient.from('usage_logs').delete().eq('user_id', targetUserId).gte('created_at', monthStart);
  }

  return json({ success: true });
};
