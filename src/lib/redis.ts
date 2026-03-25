import Redis from 'ioredis';

// ══════════════════════════════════════════
// REDIS CLIENT — Singleton connection
// ══════════════════════════════════════════

const REDIS_URL = import.meta.env.REDIS_URL || process.env.REDIS_URL;

let redis: Redis | null = null;

function getClient(): Redis | null {
  if (!REDIS_URL) return null;
  if (redis && redis.status === 'ready') return redis;

  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 200, 2000);
      },
      connectTimeout: 5000,
      commandTimeout: 3000,
      lazyConnect: false,
      enableReadyCheck: true,
      tls: REDIS_URL.startsWith('rediss://') ? {} : undefined,
    });

    redis.on('error', (err) => {
      console.warn('[Redis] Connection error:', err.message);
    });

    return redis;
  } catch (err) {
    console.warn('[Redis] Failed to create client:', (err as Error).message);
    return null;
  }
}

// ══════════════════════════════════════════
// CACHE HELPERS — All gracefully degrade
// If Redis is down, functions return null (cache miss)
// The app continues working without cache (Supabase direct)
// ══════════════════════════════════════════

/**
 * Get a cached value. Returns parsed JSON or null.
 */
export async function cacheGet<T = any>(key: string): Promise<T | null> {
  try {
    const client = getClient();
    if (!client) return null;
    const val = await client.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

/**
 * Set a cached value with TTL in seconds.
 */
export async function cacheSet(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
  try {
    const client = getClient();
    if (!client) return;
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // Silently fail — cache is non-critical
  }
}

/**
 * Delete a cached key (or pattern with wildcard).
 */
export async function cacheDel(key: string): Promise<void> {
  try {
    const client = getClient();
    if (!client) return;
    if (key.includes('*')) {
      const keys = await client.keys(key);
      if (keys.length > 0) await client.del(...keys);
    } else {
      await client.del(key);
    }
  } catch {
    // Silently fail
  }
}

/**
 * Increment a counter with TTL. Returns new count.
 * Perfect for rate limiting.
 */
export async function cacheIncr(key: string, ttlSeconds: number): Promise<number> {
  try {
    const client = getClient();
    if (!client) return 0;
    const count = await client.incr(key);
    if (count === 1) {
      await client.expire(key, ttlSeconds);
    }
    return count;
  } catch {
    return 0;
  }
}

/**
 * Cache-through pattern: get from cache, or fetch from source and cache.
 */
export async function cacheThrough<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}

// ══════════════════════════════════════════
// CACHE KEY PREFIXES — organized by domain
// ══════════════════════════════════════════
export const CACHE_KEYS = {
  /** User profile: profile:{userId} — TTL 5min */
  profile: (userId: string) => `profile:${userId}`,

  /** User subscription: sub:{userId} — TTL 5min */
  subscription: (userId: string) => `sub:${userId}`,

  /** User credits: credits:{userId} — TTL 2min */
  credits: (userId: string) => `credits:${userId}`,

  /** Usage count this month: usage:{userId}:{yearMonth} — TTL 2min */
  usage: (userId: string) => {
    const d = new Date();
    return `usage:${userId}:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  },

  /** Biblioteca custom techs list — TTL 10min */
  biblioteca: () => 'biblioteca:custom',

  /** Rate limit: rl:{endpoint}:{ip} — TTL varies */
  rateLimit: (endpoint: string, ip: string) => `rl:${endpoint}:${ip}`,

  /** All profiles list (admin): profiles:all — TTL 3min */
  allProfiles: () => 'profiles:all',

  /** Scan usage count this month: scan_usage:{type}:{userId}:{YYYY-MM} — TTL 2min */
  scanUsage: (userId: string, type: string) => `scan_usage:${type}:${userId}:${new Date().toISOString().slice(0, 7)}`,

  /** Scan result cache: scan_result:{scanId} — TTL 30min */
  scanResult: (scanId: string) => `scan_result:${scanId}`,
} as const;

/**
 * Invalidate all cache for a specific user.
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  await cacheDel(`profile:${userId}`);
  await cacheDel(`sub:${userId}`);
  await cacheDel(`credits:${userId}`);
  await cacheDel(`usage:${userId}:*`);
  await cacheDel('profiles:all');
}
