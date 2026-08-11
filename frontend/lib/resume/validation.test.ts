import { describe, it, expect } from "vitest";
import { parseResumeQuery, DEFAULT_RESUME_SLUG, DEFAULT_LANGUAGE } from "@/lib/resume/validation";
import { ValidationError } from "@/lib/shared/errors";

describe("parseResumeQuery", () => {
  it("defaults slug and lang when both are absent", () => {
    const result = parseResumeQuery(new URLSearchParams());
    expect(result).toEqual({ slug: DEFAULT_RESUME_SLUG, lang: DEFAULT_LANGUAGE });
  });

  it("accepts a valid slug and lang", () => {
    const result = parseResumeQuery(new URLSearchParams("slug=jane-doe&lang=fr"));
    expect(result).toEqual({ slug: "jane-doe", lang: "fr" });
  });

  it("lowercases the slug", () => {
    const result = parseResumeQuery(new URLSearchParams("slug=Jane-Doe"));
    expect(result.slug).toBe("jane-doe");
  });

  it("rejects a slug with invalid characters", () => {
    expect(() => parseResumeQuery(new URLSearchParams("slug=jane doe!"))).toThrow(ValidationError);
  });

  it("rejects an unsupported language", () => {
    expect(() => parseResumeQuery(new URLSearchParams("lang=zz"))).toThrow(ValidationError);
  });
});
