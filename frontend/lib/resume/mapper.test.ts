import { describe, it, expect } from "vitest";
import { ResumeMapper } from "@/lib/resume/mapper";
import type { ResumeQueryResult } from "@/lib/sanity/resume-query-result";

/**
 * Builds a fixture shaped like RESUME_BY_SLUG_QUERY's result. Cast via
 * `unknown` since the real `ResumeQueryResult` only exists after running
 * `npm run typegen` against a real Sanity schema — the mapper only cares
 * about the fields it actually reads, so a plain object fixture is
 * enough to exercise its logic without a generated type or a live
 * dataset.
 */
function buildFixture(overrides: Record<string, unknown> = {}): ResumeQueryResult {
  return {
    _id: "person-1",
    _updatedAt: "2026-01-01T00:00:00Z",
    slug: { current: "jane-doe" },
    fullName: { en: "Jane Doe" },
    headline: { en: "Senior Engineer" },
    summary: null,
    email: "jane@example.com",
    phone: null,
    location: "Remote",
    website: null,
    linkedin: null,
    github: null,
    skills: ["TypeScript", "React"],
    experience: [],
    education: [],
    projects: [],
    ...overrides,
  } as unknown as ResumeQueryResult;
}

describe("ResumeMapper.toResumeModel", () => {
  it("maps basic fields and normalizes null to undefined", () => {
    const model = ResumeMapper.toResumeModel(buildFixture());

    expect(model.slug).toBe("jane-doe");
    expect(model.fullName).toEqual({ en: "Jane Doe" });
    expect(model.contact.email).toBe("jane@example.com");
    expect(model.contact.location).toBe("Remote");
    expect(model.contact.website).toBeUndefined();
    expect(model.skills).toEqual(["TypeScript", "React"]);
  });

  it("defaults a null summary to an empty locale object rather than null", () => {
    const model = ResumeMapper.toResumeModel(buildFixture({ summary: null }));
    expect(model.summary).toEqual({});
  });

  it("sorts experience entries by startDate descending", () => {
    const model = ResumeMapper.toResumeModel(
      buildFixture({
        experience: [
          {
            _key: "a",
            company: "OlderCo",
            role: { en: "Engineer" },
            location: null,
            startDate: "2018-01-01",
            endDate: "2020-01-01",
            highlights: [],
          },
          {
            _key: "b",
            company: "NewerCo",
            role: { en: "Senior Engineer" },
            location: null,
            startDate: "2021-01-01",
            endDate: null,
            highlights: [],
          },
        ],
      }),
    );

    expect(model.experience.map((entry) => entry.company)).toEqual(["NewerCo", "OlderCo"]);
  });

  it("filters out falsy skill entries", () => {
    const model = ResumeMapper.toResumeModel(buildFixture({ skills: ["React", null, ""] }));
    expect(model.skills).toEqual(["React"]);
  });

  it("treats a missing endDate as an ongoing entry (undefined, not null)", () => {
    const model = ResumeMapper.toResumeModel(
      buildFixture({
        experience: [
          {
            _key: "a",
            company: "CurrentCo",
            role: { en: "Engineer" },
            location: null,
            startDate: "2022-01-01",
            endDate: null,
            highlights: [],
          },
        ],
      }),
    );

    expect(model.experience[0]?.endDate).toBeUndefined();
  });
});
