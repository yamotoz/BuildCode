import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

// [TEST MODE] — credita recarga direto no banco sem pagamento
// TODO: remover quando integrar pagamento real (Asaas)

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: APIRoute = async ({ request }) => {
  const json = (data: any, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

  if (!serviceRoleKey) return json({ error: 'Server misconfigured' }, 500);

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);

  const anonClient = createClient(supabaseUrl, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) return json({ error: 'Invalid token' }, 401);

  let body: { creditsEconomy?: number; creditsMid?: number; creditsElite?: number };
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const eco = Math.max(0, body.creditsEconomy || 0);
  const mid = Math.max(0, body.creditsMid || 0);
  const elite = Math.max(0, body.creditsElite || 0);

  if (eco === 0 && mid === 0 && elite === 0) return json({ error: 'Nenhum crédito selecionado' }, 400);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Busca créditos atuais do usuário
  const { data: current } = await adminClient
    .from('user_credits')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (current) {
    // Soma aos créditos indie existentes
    await adminClient.from('user_credits').update({
      indie_credits_economy: (current.indie_credits_economy || 0) + eco,
      indie_credits_mid: (current.indie_credits_mid || 0) + mid,
      indie_credits_elite: (current.indie_credits_elite || 0) + elite,
    }).eq('user_id', user.id);
  } else {
    // Cria registro de créditos
    await adminClient.from('user_credits').insert({
      user_id: user.id,
      indie_credits_economy: eco,
      indie_credits_mid: mid,
      indie_credits_elite: elite,
    });
  }

  return json({ success: true });
};
