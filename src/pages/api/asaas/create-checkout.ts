import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const ASAAS_API_KEY = import.meta.env.ASAAS_API_KEY;
const ASAAS_BASE = 'https://api.asaas.com/v3';
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

const PLANS: Record<string, { name: string; value: number; yearlyValue: number }> = {
  consultor: { name: 'BuildCode Consultor (Pro)', value: 35, yearlyValue: 28 },
  arquiteto: { name: 'BuildCode Arquiteto (Elite)', value: 50, yearlyValue: 40 },
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function asaasRequest(endpoint: string, method: string, body?: any) {
  const res = await fetch(`${ASAAS_BASE}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'access_token': ASAAS_API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data: any;
  try {
    data = await res.json();
  } catch {
    const text = await res.text().catch(() => '(sem corpo)');
    console.error('[Asaas] Non-JSON response:', res.status, text.slice(0, 300));
    throw new Error(`Asaas retornou resposta inválida (${res.status}). Verifique a API key.`);
  }
  if (!res.ok) {
    console.error('[Asaas] Error:', endpoint, data);
    throw new Error(data.errors?.[0]?.description || data.message || 'Asaas API error');
  }
  return data;
}

// Find or create Asaas customer by email
async function findOrCreateCustomer(name: string, email: string, cpfCnpj?: string) {
  // Search existing
  const search = await asaasRequest(`/customers?email=${encodeURIComponent(email)}`, 'GET');
  if (search.data?.length > 0) {
    const existing = search.data[0];
    // Update CPF if customer exists but doesn't have it
    if (cpfCnpj && !existing.cpfCnpj) {
      await asaasRequest(`/customers/${existing.id}`, 'PUT', { cpfCnpj });
    }
    return existing;
  }

  // Create new
  return asaasRequest('/customers', 'POST', {
    name,
    email,
    cpfCnpj: cpfCnpj || undefined,
    notificationDisabled: false,
  });
}

export const POST: APIRoute = async ({ request }) => {
  if (!ASAAS_API_KEY) {
    return json({ error: 'Asaas API key not configured' }, 500);
  }
  console.log('[Asaas] Key prefix:', ASAAS_API_KEY.slice(0, 12), '| Length:', ASAAS_API_KEY.length);

  // Auth: get current user
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Não autenticado. Faça login primeiro.' }, 401);
  }

  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) {
    return json({ error: 'Token inválido' }, 401);
  }

  // Parse request
  const { plan, billingCycle, cpfCnpj } = await request.json();

  if (!plan || !PLANS[plan]) {
    return json({ error: 'Plano inválido. Escolha: consultor ou arquiteto.' }, 400);
  }

  if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
    return json({ error: 'Ciclo de cobrança inválido.' }, 400);
  }

  const planConfig = PLANS[plan];
  const isYearly = billingCycle === 'yearly';
  const monthlyValue = isYearly ? planConfig.yearlyValue : planConfig.value;

  try {
    // 1. Get user profile
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: profile } = await adminClient
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const customerName = profile?.full_name || user.email?.split('@')[0] || 'Usuário';

    // 2. Find or create Asaas customer
    const customer = await findOrCreateCustomer(customerName, user.email!, cpfCnpj);

    // 3. Create subscription in Asaas
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 1); // First payment tomorrow
    const dueDateStr = nextDueDate.toISOString().split('T')[0]; // YYYY-MM-DD

    const subscription = await asaasRequest('/subscriptions', 'POST', {
      customer: customer.id,
      billingType: 'UNDEFINED', // Allows PIX, boleto, or credit card
      value: monthlyValue,
      nextDueDate: dueDateStr,
      cycle: isYearly ? 'YEARLY' : 'MONTHLY',
      description: `${planConfig.name} - ${isYearly ? 'Anual' : 'Mensal'}`,
      externalReference: `${user.id}|${plan}|${billingCycle}`,
    });

    // 4. Get the first payment link (invoice URL)
    // Asaas returns the first pending payment
    let invoiceUrl = subscription.invoiceUrl || null;

    // If no invoiceUrl directly, fetch the first payment
    if (!invoiceUrl && subscription.id) {
      const payments = await asaasRequest(`/subscriptions/${subscription.id}/payments`, 'GET');
      if (payments.data?.length > 0) {
        invoiceUrl = payments.data[0].invoiceUrl || payments.data[0].bankSlipUrl || null;
      }
    }

    // 5. Save pending subscription in Supabase
    await adminClient.from('subscriptions').upsert({
      user_id: user.id,
      plan,
      billing_cycle: billingCycle,
      status: 'pending',
      asaas_subscription_id: subscription.id,
      asaas_customer_id: customer.id,
      current_period_end: subscription.nextDueDate || dueDateStr,
    }, { onConflict: 'user_id' });

    return json({
      success: true,
      subscriptionId: subscription.id,
      invoiceUrl,
      message: 'Assinatura criada! Redirecionando para pagamento...',
    });

  } catch (err: any) {
    console.error('[create-checkout] Error:', err);
    return json({ error: err.message || 'Erro ao criar assinatura' }, 500);
  }
};
