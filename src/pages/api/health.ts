import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const health: Record<string, any> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {},
  };

  // Check Redis
  try {
    const { cacheSet, cacheGet } = await import('../../lib/redis');
    await cacheSet('health:ping', 'pong', 10);
    const val = await cacheGet('health:ping');
    health.services.redis = val === 'pong' ? 'connected' : 'degraded';
  } catch {
    health.services.redis = 'disconnected';
  }

  // Check Supabase
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const url = import.meta.env.PUBLIC_SUPABASE_URL;
    const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
    const client = createClient(url, key);
    const { error } = await client.from('profiles').select('id').limit(1);
    health.services.supabase = error ? 'error' : 'connected';
  } catch {
    health.services.supabase = 'disconnected';
  }

  const allOk = Object.values(health.services).every(s => s === 'connected');
  health.status = allOk ? 'ok' : 'degraded';

  return new Response(JSON.stringify(health, null, 2), {
    status: allOk ? 200 : 503,
    headers: { 'Content-Type': 'application/json' },
  });
};
