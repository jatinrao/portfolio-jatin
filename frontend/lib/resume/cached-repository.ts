import "server-only";
import type { ResumeRepository } from "@/lib/resume/repository";
import type { RESUME_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import type { Cache } from "@/lib/resume/cache";

/**
 * Decorator: wraps any ResumeRepository with a TTL cache. Implements the
 * same interface it wraps, so the service layer can't tell the
 * difference — this is purely a performance layer in front of the real
 * repository.
 *
 * Caches `null` (not-found) results too, with the same TTL: a stream of
 * requests for a nonexistent slug would otherwise hit Sanity on every
 * single request.
 *
 * Note this caches the raw query result, not the mapped ResumeModel —
 * cached data is language-agnostic (ResumeMapper doesn't take a `lang`),
 * so there's exactly one cache entry per slug regardless of how many
 * languages are requested against it.
 */
export class CachedResumeRepository implements ResumeRepository {
  constructor(
    private readonly inner: ResumeRepository,
    private readonly cache: Cache<RESUME_BY_SLUG_QUERY_RESULT | null>,
    private readonly ttlMs: number,
  ) {}

  async findBySlug(slug: string): Promise<RESUME_BY_SLUG_QUERY_RESULT | null> {
    const cached = await this.cache.get(slug);
    if (cached !== undefined) return cached;

    const result = await this.inner.findBySlug(slug);
    await this.cache.set(slug, result, this.ttlMs);
    return result;
  }
}
