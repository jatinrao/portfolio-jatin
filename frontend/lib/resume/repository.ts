import "server-only";
import { sanityFetch } from "@/sanity/lib/live";
import type { ResumeQueryResult } from "@/lib/resume-query-result";
import { RESUME_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { CachedResumeRepository } from "@/lib/resume/cached-repository";
import { InMemoryCache } from "@/lib/resume/cache";

/**
 * Repository interface. The service layer depends on this abstraction,
 * not on Sanity directly — swapping data sources (a different CMS, a
 * different cache, a test double) means writing a new implementation
 * here, never touching ResumeService or the route.
 */
export interface ResumeRepository {
  findBySlug(slug: string): Promise<ResumeQueryResult | null>;
}

type SanityFetcher = typeof sanityFetch;

export class SanityResumeRepository implements ResumeRepository {
  /**
   * Accepts the fetch function as a constructor param (defaulting to the
   * project's real `sanityFetch`) purely so tests can inject a fake
   * without hitting the network — `sanityFetch` itself already handles
   * client construction, CDN/perspective config, and draft-mode
   * awareness, so there's nothing else for this class to configure.
   */
  constructor(private readonly fetcher: SanityFetcher = sanityFetch) {}

  async findBySlug(slug: string): Promise<ResumeQueryResult | null> {
    const { data } = await this.fetcher({
      query: RESUME_BY_SLUG_QUERY,
      params: { slug },
      // PDFs must never contain invisible Sanity Visual Editing
      // stega-encoded characters — same reasoning as generateMetadata's
      // stega: false in layout.tsx. Left enabled, these characters get
      // baked into the rendered HTML and end up in the PDF's text layer,
      // silently breaking copy/paste, text search, and ATS parsing.
      stega: false,
    });

    return (data as ResumeQueryResult | null) ?? null;
  }
}

const DEFAULT_CACHE_TTL_MS = 60_000;

/**
 * Factory — the one place that wires SanityResumeRepository behind the
 * caching decorator. `RESUME_CACHE_TTL_MS=0` effectively disables caching
 * (every call misses immediately), which is handy for tests/debugging
 * without touching any calling code.
 */
export function getResumeRepository(): ResumeRepository {
  const ttlMs = Number(process.env.RESUME_CACHE_TTL_MS ?? DEFAULT_CACHE_TTL_MS);
  return new CachedResumeRepository(
    new SanityResumeRepository(),
    new InMemoryCache<ResumeQueryResult | null>(),
    ttlMs,
  );
}
