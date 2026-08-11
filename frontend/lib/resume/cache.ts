import "server-only";

/**
 * Minimal generic cache abstraction. `CachedResumeRepository` depends on
 * this interface, not on any specific cache technology — swapping the
 * in-memory implementation for Redis/Upstash/Next's data cache later
 * means writing one new class here, nothing else changes.
 */
export interface Cache<T> {
  get(key: string): Promise<T | undefined>;
  set(key: string, value: T, ttlMs: number): Promise<void>;
  delete(key: string): Promise<void>;
}

interface Entry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Process-local TTL cache. Same caveat as the rate limiter in the
 * translate-api project: per-process state, fine for a single instance,
 * not shared across multiple instances/regions. Swap for Redis if you
 * scale horizontally and need a shared cache.
 */
export class InMemoryCache<T> implements Cache<T> {
  private readonly store = new Map<string, Entry<T>>();

  async get(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  async set(key: string, value: T, ttlMs: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}
