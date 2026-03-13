import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Nao autorizado.' }), { status: 401, headers });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Verifica o usuário
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Token invalido.' }), { status: 401, headers });
    }

    // Obtém IP do cliente
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';

    // Atualiza perfil com aceite dos termos
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        terms_accepted_at: new Date().toISOString(),
        terms_version: '1.0',
        terms_ip: ip,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[AcceptTerms] Update error:', updateError);
      return new Response(JSON.stringify({ error: 'Erro ao registrar aceite dos termos.' }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });

  } catch (err: any) {
    console.error('[AcceptTerms] Error:', err);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor.' }), { status: 500, headers });
  }
};
