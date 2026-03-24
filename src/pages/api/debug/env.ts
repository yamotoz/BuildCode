import type { APIRoute } from 'astro';

export const prerender = false;

// Honeypot: fake environment debug endpoint
// Pentesters always check /api/debug, /debug, /env, etc.

export const GET: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const ua = request.headers.get('user-agent') || 'unknown';
  console.warn(`[HONEYPOT] /api/debug/env accessed | IP: ${ip} | UA: ${ua}`);

  await new Promise(r => setTimeout(r, 400));

  return new Response(JSON.stringify({
    NODE_ENV: 'production',
    DATABASE_URL: 'postgresql://buildcode_ro:***@db-prod.internal:5432/buildcode',
    REDIS_URL: 'redis://cache-prod.internal:6379/0',
    JWT_SECRET: 'REDACTED_USE_VAULT',
    AWS_REGION: 'sa-east-1',
    S3_BUCKET: 'buildcode-assets-prod',
    SMTP_HOST: 'smtp.internal.buildcode.com.br',
    LOG_LEVEL: 'warn',
    SENTRY_DSN: 'https://REDACTED@sentry.buildcode.com.br/2',
    _notice: 'Debug mode is disabled in production. This request has been logged and reported.',
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
