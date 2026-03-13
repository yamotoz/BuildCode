import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

const agentVoiceMap: Record<string, string> = {
  theboss: 'onyx',
  azrael: 'echo',
  rizler: 'fable',
  anastasia: 'nova',
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  if (!OPENAI_API_KEY) {
    return json({ error: 'API key not configured' }, 500);
  }

  // Autenticação obrigatória
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Não autenticado.' }, 401);
  }

  const anonClient = createClient(supabaseUrl, supabaseAnon);
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) {
    return json({ error: 'Token inválido.' }, 401);
  }

  // Verificar plano — Explorador não pode usar TTS
  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: sub } = await adminClient
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  const userPlan = sub?.plan || 'explorador';
  if (userPlan === 'explorador') {
    return json({ error: 'Resumo em áudio disponível apenas para planos Consultor e Arquiteto. Faça upgrade para desbloquear!' }, 403);
  }

  let body: { text: string; agentId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { text, agentId } = body;
  if (!text || typeof text !== 'string') {
    return json({ error: 'text required' }, 400);
  }

  // Trunca em ~200 caracteres para um resumo de áudio curto
  const summary = text.length > 200 ? text.substring(0, 197) + '...' : text;
  const voice = agentVoiceMap[agentId || 'theboss'] || 'onyx';

  try {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: summary,
        voice: voice,
        response_format: 'mp3',
        speed: 1.05,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: 'TTS API error' } }));
      return json({ error: err.error?.message || 'TTS API error' }, res.status);
    }

    const audioBuffer = await res.arrayBuffer();
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: message }, 500);
  }
};
