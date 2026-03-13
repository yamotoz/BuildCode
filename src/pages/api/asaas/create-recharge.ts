import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const ASAAS_API_KEY = import.meta.env.ASAAS_API_KEY;
const ASAAS_BASE = 'https://api.asaas.com/api/v3';
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Preços por consulta em BRL (custom +10% sobre base dos combos)
const PRICE_ECONOMY = 0.055;
const PRICE_MID = 0.55;
const PRICE_ELITE = 3.85;

// Combos predefinidos
const COMBOS: Record<string, { economy: number; mid: number; elite: number; price: number }> = {
  starter: { economy: 20, mid: 5, elite: 2, price: 10 },
  turbo:   { economy: 50, mid: 12, elite: 5, price: 20 },
  mega:    { economy: 90, mid: 25, elite: 8, price: 30 },
  ultra:   { economy: 200, mid: 60, elite: 15, price: 50 },
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
  const data = await res.json();
  if (!res.ok) {
    console.error('[Asaas Recharge] Error:', endpoint, data);
    throw new Error(data.errors?.[0]?.description || 'Asaas API error');
  }
  return data;
}

async function findOrCreateCustomer(name: string, email: string) {
  const search = await asaasRequest(`/customers?email=${encodeURIComponent(email)}`, 'GET');
  if (search.data?.length > 0) return search.data[0];
  return asaasRequest('/customers', 'POST', { name, email, notificationDisabled: false });
}

export const POST: APIRoute = async ({ request }) => {
  if (!ASAAS_API_KEY) {
    return json({ error: 'Asaas API key não configurada' }, 500);
  }

  // Autenticação
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Não autenticado. Faça login primeiro.' }, 401);
  }

  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) {
    return json({ error: 'Token inválido' }, 401);
  }

  // Parse body
  const body = await request.json();
  const { rechargeType, comboName, creditsEconomy, creditsMid, creditsElite, amountBrl } = body;

  let eco = 0, mid = 0, elite = 0, totalBrl = 0;

  if (rechargeType === 'combo') {
    // Validar combo
    if (!comboName || !COMBOS[comboName]) {
      return json({ error: 'Combo inválido.' }, 400);
    }
    const combo = COMBOS[comboName];
    eco = combo.economy;
    mid = combo.mid;
    elite = combo.elite;
    totalBrl = combo.price;
  } else if (rechargeType === 'custom') {
    // Validar custom
    eco = Math.max(0, Math.floor(creditsEconomy || 0));
    mid = Math.max(0, Math.floor(creditsMid || 0));
    elite = Math.max(0, Math.floor(creditsElite || 0));
    totalBrl = parseFloat(((eco * PRICE_ECONOMY) + (mid * PRICE_MID) + (elite * PRICE_ELITE)).toFixed(2));

    if (totalBrl <= 0) {
      return json({ error: 'Selecione pelo menos 1 crédito.' }, 400);
    }

    // Verificar se o valor enviado confere (tolerância de R$0.01)
    if (Math.abs(totalBrl - (amountBrl || 0)) > 0.02) {
      return json({ error: 'Valor calculado diverge do informado.' }, 400);
    }
  } else {
    return json({ error: 'Tipo de recarga inválido.' }, 400);
  }

  try {
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Buscar perfil
    const { data: profile } = await adminClient
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    const customerName = profile?.full_name || user.email?.split('@')[0] || 'Usuário';

    // Criar/buscar cliente Asaas
    const customer = await findOrCreateCustomer(customerName, user.email!);

    // Criar cobrança avulsa (não recorrente)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    const comboLabel = comboName ? ` (${comboName.charAt(0).toUpperCase() + comboName.slice(1)})` : '';
    const payment = await asaasRequest('/payments', 'POST', {
      customer: customer.id,
      billingType: 'UNDEFINED',
      value: totalBrl,
      dueDate: dueDate.toISOString().split('T')[0],
      description: `Recarga Rebelde${comboLabel} — ${eco} eco + ${mid} mid + ${elite} elite`,
      externalReference: `recharge|${user.id}|${eco}|${mid}|${elite}`,
    });

    // Registrar recarga no banco (status pending até webhook confirmar)
    await adminClient.from('recharges').insert({
      user_id: user.id,
      recharge_type: rechargeType,
      combo_name: comboName || null,
      credits_economy: eco,
      credits_mid: mid,
      credits_elite: elite,
      amount_brl: totalBrl,
      asaas_payment_id: payment.id,
      status: 'pending',
    });

    return json({
      success: true,
      paymentId: payment.id,
      invoiceUrl: payment.invoiceUrl || payment.bankSlipUrl || null,
      message: 'Recarga criada! Redirecionando para pagamento...',
    });

  } catch (err: any) {
    console.error('[create-recharge] Error:', err);
    return json({ error: err.message || 'Erro ao processar recarga' }, 500);
  }
};
