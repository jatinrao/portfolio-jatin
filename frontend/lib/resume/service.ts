import "server-only";
import { cache } from "react";
import type { ResumeRepository } from "@/lib/resume/repository";
import { getResumeRepository } from "@/lib/resume/repository";
import { ResumeMapper } from "@/lib/resume/mapper";
import { ResumeNotFoundError } from "@/lib/shared/errors";
import type { ResumeModel } from "@/lib/resume/types";

/**
 * Single entry point for "get me a resume". Fetches once from the
 * repository and maps once — no duplicated business logic between the
 * PDF route and any future consumer (e.g. a browser preview page, a JSON
 * API, a different export format).
 */
export class ResumeService {
  constructor(private readonly repository: ResumeRepository) {}

  async getResume(slug: string): Promise<ResumeModel> {
    const doc = await this.repository.findBySlug(slug);
    if (!doc) {
      throw new ResumeNotFoundError(slug);
    }
    return ResumeMapper.toResumeModel(doc);
  }
}

export function getResumeService(): ResumeService {
  return new ResumeService(getResumeRepository());
}

/**
 * Memoized per-request via React's `cache()`. `app/resume/page.tsx` calls
 * `getResume` from both `generateMetadata` and the page component itself;
 * without this, that would be two separate Sanity fetches for the same
 * request. `cache()` scopes the memoization to a single render pass, so
 * the PDF route (a single call, in a different request entirely) is
 * unaffected either way.
 */
export const getResumeCached = cache(async (slug: string): Promise<ResumeModel> => {
  return getResumeService().getResume(slug);
});
