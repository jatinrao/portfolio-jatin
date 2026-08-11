import { describe, it, expect, vi } from "vitest";
import { ResumeService } from "@/lib/resume/service";
import type { ResumeRepository } from "@/lib/resume/repository";
import { ResumeNotFoundError } from "@/lib/shared/errors";
import type { ResumeQueryResult } from "@/lib/sanity/resume-query-result";

function fixture(): ResumeQueryResult {
  return {
    _id: "person-1",
    _updatedAt: "2026-01-01T00:00:00Z",
    slug: { current: "jane-doe" },
    fullName: { en: "Jane Doe" },
    headline: null,
    summary: null,
    email: "jane@example.com",
    phone: null,
    location: null,
    website: null,
    linkedin: null,
    github: null,
    skills: [],
    experience: [],
    education: [],
    projects: [],
  } as unknown as ResumeQueryResult;
}

describe("ResumeService.getResume", () => {
  it("throws ResumeNotFoundError when the repository returns null", async () => {
    const repository: ResumeRepository = { findBySlug: vi.fn().mockResolvedValue(null) };
    const service = new ResumeService(repository);

    await expect(service.getResume("missing")).rejects.toThrow(ResumeNotFoundError);
  });

  it("returns a mapped ResumeModel when the repository finds a document", async () => {
    const repository: ResumeRepository = { findBySlug: vi.fn().mockResolvedValue(fixture()) };
    const service = new ResumeService(repository);

    const resume = await service.getResume("jane-doe");

    expect(resume.slug).toBe("jane-doe");
    expect(resume.fullName).toEqual({ en: "Jane Doe" });
  });

  it("passes the requested slug through to the repository", async () => {
    const findBySlug = vi.fn().mockResolvedValue(fixture());
    const service = new ResumeService({ findBySlug });

    await service.getResume("jane-doe");

    expect(findBySlug).toHaveBeenCalledWith("jane-doe");
  });
});
