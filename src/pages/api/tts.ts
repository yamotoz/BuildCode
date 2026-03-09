import type { APIRoute } from 'astro';

export const prerender = false;

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

// Map agent IDs to OpenAI TTS voices
// Anastasia = young feminine voice (nova)
// The Boss = deep authoritative (onyx)
// Azrael = confident visionary (echo)
// Rizler = dark mysterious (fable)
const agentVoiceMap: Record<string, string> = {
  theboss: 'onyx',
  azrael: 'echo',
  rizler: 'fable',
  anastasia: 'nova',
};

export const POST: APIRoute = async ({ request }) => {
  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { text: string; agentId?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { text, agentId } = body;
  if (!text || typeof text !== 'string') {
    return new Response(JSON.stringify({ error: 'text required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Truncate to ~200 chars for a short audio summary
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
      return new Response(JSON.stringify({ error: err.error?.message || 'TTS API error' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
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
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
