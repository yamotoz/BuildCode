import type { APIRoute } from 'astro';

export const prerender = false;

// Honeypot: fake users API endpoint
// Attackers scanning for /api/v1/users, /api/users, etc. will find this

const FAKE_USERS = [
  { id: 'usr_f8a2c7d1', email: 'admin@buildcode.internal', role: 'admin', status: 'active', last_login: '2026-03-24T10:30:00Z' },
  { id: 'usr_3b9e4f12', email: 'dev@buildcode.internal', role: 'developer', status: 'active', last_login: '2026-03-23T18:45:00Z' },
  { id: 'usr_7c1d8e53', email: 'test@buildcode.internal', role: 'tester', status: 'suspended', last_login: '2026-03-20T09:00:00Z' },
];

export const GET: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const ua = request.headers.get('user-agent') || 'unknown';
  console.warn(`[HONEYPOT] /api/v1/users accessed | IP: ${ip} | UA: ${ua}`);

  await new Promise(r => setTimeout(r, 300));

  return new Response(JSON.stringify({
    data: FAKE_USERS,
    total: 3,
    page: 1,
    _meta: { api_version: 'v1', deprecated: true, migrate_to: '/api/v2/users' },
  }, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
