import { describe, it, expect, vi, afterEach } from "vitest";
import { CachedResumeRepository } from "@/lib/resume/cached-repository";
import type { ResumeRepository } from "@/lib/resume/repository";
import { InMemoryCache } from "@/lib/resume/cache";
import type { ResumeQueryResult } from "@/lib/sanity/resume-query-result";

function fakeResult(id: string): ResumeQueryResult {
  return { _id: id } as unknown as ResumeQueryResult;
}

function fakeRepository(impl: ResumeRepository["findBySlug"]): ResumeRepository {
  return { findBySlug: vi.fn(impl) };
}

describe("CachedResumeRepository", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("only calls the inner repository once for repeated calls within the TTL", async () => {
    const inner = fakeRepository(async () => fakeResult("doc-1"));
    const repo = new CachedResumeRepository(inner, new InMemoryCache(), 60_000);

    await repo.findBySlug("jane-doe");
    await repo.findBySlug("jane-doe");

    expect(inner.findBySlug).toHaveBeenCalledTimes(1);
  });

  it("caches null (not-found) results too, to avoid hammering Sanity for a bad slug", async () => {
    const inner = fakeRepository(async () => null);
    const repo = new CachedResumeRepository(inner, new InMemoryCache(), 60_000);

    await repo.findBySlug("missing");
    await repo.findBySlug("missing");

    expect(inner.findBySlug).toHaveBeenCalledTimes(1);
  });

  it("re-fetches after the cache entry's TTL has elapsed", async () => {
    vi.useFakeTimers();
    const inner = fakeRepository(async () => fakeResult("doc-1"));
    const repo = new CachedResumeRepository(inner, new InMemoryCache(), 1000);

    await repo.findBySlug("jane-doe");
    vi.advanceTimersByTime(1001);
    await repo.findBySlug("jane-doe");

    expect(inner.findBySlug).toHaveBeenCalledTimes(2);
  });

  it("caches different slugs independently", async () => {
    const inner = fakeRepository(async (slug: string) => fakeResult(slug));
    const repo = new CachedResumeRepository(inner, new InMemoryCache(), 60_000);

    const a = await repo.findBySlug("jane-doe");
    const b = await repo.findBySlug("john-smith");

    expect(a).toEqual(fakeResult("jane-doe"));
    expect(b).toEqual(fakeResult("john-smith"));
    expect(inner.findBySlug).toHaveBeenCalledTimes(2);
  });
});
