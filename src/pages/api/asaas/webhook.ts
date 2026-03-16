import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Asaas Webhook — receives payment events and updates Supabase subscriptions.
 *
 * Events handled:
 * - PAYMENT_CONFIRMED / PAYMENT_RECEIVED → activate subscription
 * - PAYMENT_OVERDUE → mark as past_due
 * - PAYMENT_DELETED / PAYMENT_REFUNDED → mark as canceled
 * - SUBSCRIPTION_DELETED / SUBSCRIPTION_INACTIVATED → cancel subscription
 *
 * Configure in Asaas Dashboard → Integrações → Webhooks:
 * URL: https://your-domain.com/api/asaas/webhook
 */
const WEBHOOK_TOKEN = import.meta.env.ASAAS_WEBHOOK_TOKEN;

export const POST: APIRoute = async ({ request }) => {
  if (!serviceRoleKey) {
    return json({ error: 'Server not configured' }, 500);
  }

  // Valida token do webhook
  if (WEBHOOK_TOKEN) {
    const asaasToken = request.headers.get('asaas-access-token');
    if (asaasToken !== WEBHOOK_TOKEN) {
      console.warn('[Asaas Webhook] Invalid token received');
      return json({ error: 'Unauthorized' }, 401);
    }
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const event = body.event;
  const payment = body.payment;

  if (!event) {
    return json({ error: 'No event provided' }, 400);
  }

  console.log(`[Asaas Webhook] Event: ${event}`, payment?.id || '');

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  // Detecta o tipo de referência externa
  const externalRef = payment?.externalReference || body.subscription?.externalReference || '';
  const parts = externalRef.split('|');

  // ── Recarga Rebelde: "recharge|userId|eco|mid|elite"
  if (parts[0] === 'recharge') {
    const [, userId, eco, mid, elite] = parts;
    if (!userId) return json({ received: true, warning: 'Recharge: user not identified' });
    return handleRecharge(adminClient, event, userId, payment?.id, Number(eco), Number(mid), Number(elite));
  }

  // ── Assinatura: "userId|plan|billingCycle"
  const [userId, plan, billingCycle] = parts;

  if (!userId) {
    // Tenta localizar pela asaas_subscription_id
    const subscriptionId = payment?.subscription || body.subscription?.id;
    if (subscriptionId) {
      const { data: sub } = await adminClient
        .from('subscriptions')
        .select('user_id, plan, billing_cycle')
        .eq('asaas_subscription_id', subscriptionId)
        .single();
      if (sub) return handleEvent(adminClient, event, sub.user_id, sub.plan, sub.billing_cycle, payment);
    }
    console.warn('[Asaas Webhook] Could not identify user for event:', event);
    return json({ received: true, warning: 'User not identified' });
  }

  return handleEvent(adminClient, event, userId, plan, billingCycle, payment);
};

async function handleRecharge(
  adminClient: any,
  event: string,
  userId: string,
  paymentId: string,
  eco: number,
  mid: number,
  elite: number,
) {
  const isConfirmed = ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED', 'PAYMENT_APPROVED_BY_RISK_ANALYSIS'].includes(event);
  const isCanceled = ['PAYMENT_DELETED', 'PAYMENT_REFUNDED', 'PAYMENT_CHARGEBACK_REQUESTED', 'PAYMENT_REPROVED_BY_RISK_ANALYSIS'].includes(event);

  if (isConfirmed) {
    // Adiciona créditos na tabela user_credits
    const { data: existing } = await adminClient
      .from('user_credits')
      .select('indie_credits_economy, indie_credits_mid, indie_credits_elite')
      .eq('user_id', userId)
      .single();

    if (existing) {
      await adminClient.from('user_credits').update({
        indie_credits_economy: (existing.indie_credits_economy || 0) + eco,
        indie_credits_mid: (existing.indie_credits_mid || 0) + mid,
        indie_credits_elite: (existing.indie_credits_elite || 0) + elite,
      }).eq('user_id', userId);
    } else {
      await adminClient.from('user_credits').insert({
        user_id: userId,
        indie_credits_economy: eco,
        indie_credits_mid: mid,
        indie_credits_elite: elite,
      });
    }

    // Atualiza status da recarga
    if (paymentId) {
      await adminClient.from('recharges')
        .update({ status: 'completed' })
        .eq('asaas_payment_id', paymentId);
    }

    console.log(`[Asaas Webhook] Recharge credited for user ${userId}: +${eco} eco, +${mid} mid, +${elite} elite`);
  }

  if (isCanceled && paymentId) {
    await adminClient.from('recharges')
      .update({ status: 'canceled' })
      .eq('asaas_payment_id', paymentId);

    console.log(`[Asaas Webhook] Recharge canceled for user ${userId}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
}

async function handleEvent(
  adminClient: any,
  event: string,
  userId: string,
  plan: string,
  billingCycle: string,
  payment: any,
) {
  const now = new Date().toISOString();

  switch (event) {
    // ── Payment confirmed → activate ──
    case 'PAYMENT_CONFIRMED':
    case 'PAYMENT_RECEIVED':
    case 'PAYMENT_APPROVED_BY_RISK_ANALYSIS': {
      // Calculate next period end
      const periodEnd = new Date();
      if (billingCycle === 'yearly') {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      await adminClient.from('subscriptions').upsert({
        user_id: userId,
        plan,
        billing_cycle: billingCycle,
        status: 'active',
        current_period_end: periodEnd.toISOString(),
        asaas_subscription_id: payment?.subscription || null,
        last_payment_date: now,
      }, { onConflict: 'user_id' });

      console.log(`[Asaas Webhook] Subscription activated for user ${userId} — plan: ${plan}`);
      break;
    }

    // ── Payment overdue ──
    case 'PAYMENT_OVERDUE': {
      await adminClient.from('subscriptions')
        .update({ status: 'past_due' })
        .eq('user_id', userId);

      console.log(`[Asaas Webhook] Subscription past_due for user ${userId}`);
      break;
    }

    // ── Payment refunded, deleted or reproved ──
    case 'PAYMENT_DELETED':
    case 'PAYMENT_REFUNDED':
    case 'PAYMENT_REPROVED_BY_RISK_ANALYSIS':
    case 'PAYMENT_CHARGEBACK_REQUESTED':
    case 'PAYMENT_CHARGEBACK_DISPUTE': {
      await adminClient.from('subscriptions')
        .update({ status: 'canceled' })
        .eq('user_id', userId);

      console.log(`[Asaas Webhook] Subscription canceled (${event}) for user ${userId}`);
      break;
    }

    // ── Subscription canceled ──
    case 'SUBSCRIPTION_DELETED':
    case 'SUBSCRIPTION_INACTIVATED': {
      await adminClient.from('subscriptions')
        .update({ status: 'canceled' })
        .eq('user_id', userId);

      console.log(`[Asaas Webhook] Subscription inactivated for user ${userId}`);
      break;
    }

    default:
      console.log(`[Asaas Webhook] Unhandled event: ${event}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
