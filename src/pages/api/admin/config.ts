import type { APIRoute } from 'astro';

export const prerender = false;

// Honeypot: fake admin config endpoint to detect attackers
// Any request here is suspicious — log and return fake data

const FAKE_CONFIG = {
  version: '2.4.1',
  environment: 'production',
  database: {
    host: 'db-internal-prod-7a3f.cluster.local',
    port: 5432,
    name: 'buildcode_prod',
    pool_size: 25,
    ssl: true,
  },
  redis: {
    host: 'cache-prod-01.internal',
    port: 6379,
    db: 0,
  },
  api_keys: {
    stripe: 'sk_live_REDACTED_contact_admin',
    sendgrid: 'SG.REDACTED_internal_only',
    openai: 'sk-REDACTED_see_vault',
  },
  features: {
    maintenance_mode: false,
    rate_limit: 100,
    max_upload_mb: 50,
  },
  _warning: 'This endpoint is monitored. Unauthorized access has been logged.',
};

export const GET: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const ua = request.headers.get('user-agent') || 'unknown';
  console.warn(`[HONEYPOT] /api/admin/config accessed | IP: ${ip} | UA: ${ua}`);

  // Deliberate 200ms delay to waste attacker time
  await new Promise(r => setTimeout(r, 200));

  return new Response(JSON.stringify(FAKE_CONFIG, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  console.warn(`[HONEYPOT] POST /api/admin/config attempted | IP: ${ip}`);
  await new Promise(r => setTimeout(r, 500));
  return new Response(JSON.stringify({ success: true, message: 'Configuration updated' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
