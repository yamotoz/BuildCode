import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: APIRoute = async ({ request }) => {
  if (!serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'Service role key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verifica se o chamador está autenticado e é master/admin
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const anonClient = createClient(supabaseUrl, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
  const { data: { user: caller } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));

  if (!caller) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verifica role do chamador via service role client (ignora RLS)
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: callerProfile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', caller.id)
    .single();

  if (!callerProfile || !['master', 'admin'].includes(callerProfile.role)) {
    return new Response(JSON.stringify({ error: 'Forbidden: insufficient permissions' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Extrai corpo da requisição
  let body: { email: string; fullName: string; role: string; plan?: string; canAccessDashboard?: boolean; password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, fullName, role, plan, canAccessDashboard, password } = body;
  if (!email || !fullName) {
    return new Response(JSON.stringify({ error: 'email and fullName are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!password || password.length < 6) {
    return new Response(JSON.stringify({ error: 'password must be at least 6 characters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validRoles = ['user', 'admin'];
  const safeRole = validRoles.includes(role) ? role : 'user';

  // VIP só pode ser atribuído por master
  const isMaster = callerProfile.role === 'master';
  const validPlans = isMaster
    ? ['explorador', 'consultor', 'arquiteto', 'vip']
    : ['explorador', 'consultor', 'arquiteto'];
  const safePlan = validPlans.includes(plan || '') ? plan! : 'explorador';

  // Cria usuário diretamente com senha definida (email já confirmado)
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (data.user) {
    // Aguarda trigger do Supabase criar o perfil
    await new Promise(resolve => setTimeout(resolve, 500));

    // Define role e acesso ao dashboard
    const profileUpdate: Record<string, any> = {};
    if (safeRole !== 'user') profileUpdate.role = safeRole;
    if (canAccessDashboard === true) profileUpdate.can_access_dashboard = true;
    if (Object.keys(profileUpdate).length > 0) {
      await adminClient
        .from('profiles')
        .update(profileUpdate)
        .eq('id', data.user.id);
    }

    // Cria assinatura para o novo usuário
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    await adminClient.from('subscriptions').upsert({
      user_id: data.user.id,
      plan: safePlan,
      billing_cycle: 'monthly',
      status: 'active',
      current_period_end: periodEnd.toISOString(),
    }, { onConflict: 'user_id' });
  }

  return new Response(JSON.stringify({ success: true, userId: data.user?.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
