import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  // Rate limiting: 5 signups per hour per IP
  const { rateLimit, getClientIp } = await import('../../lib/rate-limit');
  const ip = getClientIp(request);
  const blocked = rateLimit(`signup:${ip}`, 5, 60 * 60_000);
  if (blocked) return blocked;

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'E-mail e senha sao obrigatorios.' }), { status: 400, headers });
    }

    // Valida força da senha no servidor
    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Senha deve ter no minimo 8 caracteres.' }), { status: 400, headers });
    }
    if (!/[A-Z]/.test(password)) {
      return new Response(JSON.stringify({ error: 'Senha deve conter pelo menos uma letra maiuscula.' }), { status: 400, headers });
    }
    if (!/[a-z]/.test(password)) {
      return new Response(JSON.stringify({ error: 'Senha deve conter pelo menos uma letra minuscula.' }), { status: 400, headers });
    }
    if (!/[0-9]/.test(password)) {
      return new Response(JSON.stringify({ error: 'Senha deve conter pelo menos um numero.' }), { status: 400, headers });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return new Response(JSON.stringify({ error: 'Senha deve conter pelo menos um simbolo especial.' }), { status: 400, headers });
    }

    // Obtém IP do cliente
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Limite de taxa por IP: máximo 2 cadastros por dia
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentSignups, error: rlError } = await supabaseAdmin
      .from('signup_rate_limit')
      .select('id')
      .eq('ip_address', ip)
      .gte('created_at', oneDayAgo);

    if (rlError) {
      console.error('[Signup] Rate limit check error:', rlError);
    }

    if (recentSignups && recentSignups.length >= 2) {
      return new Response(JSON.stringify({
        error: 'Limite de criacao de contas atingido. Voce pode criar no maximo 2 contas por dia. Tente novamente amanha.'
      }), { status: 429, headers });
    }

    // Cria usuário via Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // confirma e-mail automaticamente
    });

    if (authError) {
      if (authError.message.includes('already been registered') || authError.message.includes('already exists')) {
        return new Response(JSON.stringify({ error: 'Este e-mail ja esta registrado. Tente fazer login.' }), { status: 409, headers });
      }
      return new Response(JSON.stringify({ error: authError.message }), { status: 400, headers });
    }

    const userId = authData.user?.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Erro interno ao criar usuario.' }), { status: 500, headers });
    }

    // O trigger handle_new_user já cria o profile automaticamente.
    // Apenas garantimos que campos extras estejam preenchidos.
    await supabaseAdmin.from('profiles').update({
      full_name: email.split('@')[0],
      agent: 'theboss',
      llm_model: 'google/gemma-3-4b-it:free',
    }).eq('id', userId);

    // Registra cadastro para controle de taxa
    await supabaseAdmin.from('signup_rate_limit').insert({ ip_address: ip });

    return new Response(JSON.stringify({ success: true, userId }), { status: 200, headers });

  } catch (err: any) {
    console.error('[Signup] Error:', err);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor.' }), { status: 500, headers });
  }
};
