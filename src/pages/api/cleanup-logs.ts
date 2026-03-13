import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: APIRoute = async ({ request }) => {
  // Proteção: apenas master pode executar, ou chamada com service role
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
  }

  const anonClient = createClient(supabaseUrl, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });
  }

  // Verificar se é master
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'master') {
    return new Response(JSON.stringify({ error: 'Apenas master pode executar limpeza' }), { status: 403 });
  }

  // Executar a função de limpeza
  const { data, error } = await adminClient.rpc('cleanup_explorer_logs');

  if (error) {
    console.error('[cleanup-logs] Erro:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({
    success: true,
    deleted: data,
    message: `Limpeza concluída. ${data} logs removidos.`,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
