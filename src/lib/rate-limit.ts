// Rate limiter with Redis (distributed) + in-memory fallback
// If Redis is available, rate limits are shared across all Vercel instances
// If Redis is down, falls back to in-memory (per-instance, less accurate but still works)

import { cacheIncr, CACHE_KEYS } from './redis';

// In-memory fallback store
interface RateEntry { count: number; resetAt: number; }
const memStore = new Map<string, RateEntry>();

// Cleanup in-memory every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memStore) {
    if (entry.resetAt < now) memStore.delete(key);
  }
}, 5 * 60 * 1000);

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Rate limit check with Redis + in-memory fallback.
 * Returns null if allowed, or a 429 Response if blocked.
 */
export async function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<Response | null> {
  const ttlSeconds = Math.ceil(windowMs / 1000);

  // Try Redis first (distributed rate limiting)
  const redisKey = CACHE_KEYS.rateLimit(key, '');
  const redisCount = await cacheIncr(`rl:${key}`, ttlSeconds);

  if (redisCount > 0) {
    // Redis is working — use distributed count
    if (redisCount > maxRequests) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(ttlSeconds),
          },
        }
      );
    }
    return null;
  }

  // Fallback: in-memory rate limiting
  const now = Date.now();
  const entry = memStore.get(key);

  if (!entry || entry.resetAt < now) {
    memStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
        },
      }
    );
  }

  return null;
}
