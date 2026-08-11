/**
 * Simple in-memory token-bucket rate limiter.
 *
 * NOTE: this is per-process state. It's fine for a single Next.js server
 * instance (e.g. a local Ollama proxy) but will NOT be shared across
 * multiple instances/edge regions. Swap `store` for Redis/Upstash if you
 * scale horizontally.
 */

interface Bucket {
  tokens: number;
  lastRefillMs: number;
}

const store = new Map<string, Bucket>();

export interface RateLimitConfig {
  /** Max requests allowed per window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 20,
  windowMs: 60_000, // 20 requests / minute / client
};

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
  const now = Date.now();
  const refillRate = config.limit / config.windowMs; // tokens per ms

  let bucket = store.get(key);
  if (!bucket) {
    bucket = { tokens: config.limit, lastRefillMs: now };
    store.set(key, bucket);
  }

  // Refill based on elapsed time.
  const elapsed = now - bucket.lastRefillMs;
  bucket.tokens = Math.min(config.limit, bucket.tokens + elapsed * refillRate);
  bucket.lastRefillMs = now;

  if (bucket.tokens < 1) {
    const deficit = 1 - bucket.tokens;
    const retryAfterMs = deficit / refillRate;
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  bucket.tokens -= 1;
  return {
    allowed: true,
    remaining: Math.floor(bucket.tokens),
    retryAfterSeconds: 0,
  };
}

/** Periodic cleanup so the map doesn't grow unbounded in a long-lived process. */
const IDLE_TTL_MS = 10 * 60_000;
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of store) {
    if (now - bucket.lastRefillMs > IDLE_TTL_MS) {
      store.delete(key);
    }
  }
}, IDLE_TTL_MS).unref?.();

/** Derive a rate-limit key from the request (IP, falling back to a shared bucket). */
export function getClientKey(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown-client";
}
