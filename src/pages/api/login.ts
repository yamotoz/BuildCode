import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// In-memory brute force tracking
interface AttemptRecord {
  count: number;
  lastAttempt: number;
  blockedUntil: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

function getBlockDuration(failCount: number): number {
  if (failCount >= 10) return 60 * 60 * 1000;   // 1 hour
  if (failCount >= 5) return 15 * 60 * 1000;     // 15 minutes
  if (failCount >= 3) return 60 * 1000;           // 1 minute
  return 0;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

export const POST: APIRoute = async ({ request }) => {
  const ip = getClientIp(request);
  const now = Date.now();

  // Check if IP is currently blocked
  const record = loginAttempts.get(ip);
  if (record && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return new Response(
      JSON.stringify({
        error: 'Muitas tentativas de login. Tente novamente mais tarde.',
        retryAfter,
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse body
  let email: string;
  let password: string;
  try {
    const body = await request.json();
    email = body.email;
    password = body.password;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Corpo da requisição inválido.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Email e senha são obrigatórios.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Attempt login
  const supabase = createClient(supabaseUrl, supabaseAnon);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Record failed attempt
    const current = loginAttempts.get(ip) || { count: 0, lastAttempt: 0, blockedUntil: 0 };
    current.count += 1;
    current.lastAttempt = now;

    const blockMs = getBlockDuration(current.count);
    if (blockMs > 0) {
      current.blockedUntil = now + blockMs;
    }

    loginAttempts.set(ip, current);

    const response: Record<string, unknown> = { error: 'Credenciais inválidas.' };
    if (current.blockedUntil > now) {
      response.retryAfter = Math.ceil(blockMs / 1000);
    }

    return new Response(JSON.stringify(response), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Successful login — clear attempts for this IP
  loginAttempts.delete(ip);

  return new Response(
    JSON.stringify({ success: true, session: data.session }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
