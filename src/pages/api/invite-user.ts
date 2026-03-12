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

  // Verify the caller is authenticated and is master/admin
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

  // Check caller role via service role client (bypasses RLS)
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

  // Parse body
  let body: { email: string; fullName: string; role: string; plan?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, fullName, role, plan } = body;
  if (!email || !fullName) {
    return new Response(JSON.stringify({ error: 'email and fullName are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const validRoles = ['user', 'admin'];
  const safeRole = validRoles.includes(role) ? role : 'user';

  const validPlans = ['explorador', 'consultor', 'arquiteto'];
  const safePlan = validPlans.includes(plan || '') ? plan! : 'explorador';

  // Create user with service role (admin privileges)
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
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
    // Wait for trigger to create profile
    await new Promise(resolve => setTimeout(resolve, 500));

    // Set role if not default 'user'
    if (safeRole !== 'user') {
      await adminClient
        .from('profiles')
        .update({ role: safeRole })
        .eq('id', data.user.id);
    }

    // Create subscription for the new user
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

  // Send password reset so the new user can set their own password
  await adminClient.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${request.headers.get('origin') || ''}/login` },
  });

  return new Response(JSON.stringify({ success: true, userId: data.user?.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
