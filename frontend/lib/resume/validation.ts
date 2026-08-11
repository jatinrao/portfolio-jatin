import "server-only";
import { z } from "zod";
import { ValidationError } from "@/lib/shared/errors";

export const DEFAULT_RESUME_SLUG = "jatin-kumar";

/**
 * Keep in sync with whatever languages the Sanity locale fields
 * (`localeString` / `localeBlockContent`) actually support in this
 * project — e.g. the same set `LanguageContext` offers in the UI.
 */
export const SUPPORTED_LANGUAGES = ["en", "es", "fr", "zh","hi","ar"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const querySchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{1,100}$/, "slug must contain only lowercase letters, numbers, and hyphens")
    .default(DEFAULT_RESUME_SLUG),
  lang: z
    .enum(SUPPORTED_LANGUAGES)
    .default(DEFAULT_LANGUAGE),
});

export interface ResumePdfQuery {
  slug: string;
  lang: SupportedLanguage;
}

export function parseResumeQuery(searchParams: URLSearchParams): ResumePdfQuery {
  const result = querySchema.safeParse({
    slug: searchParams.get("slug") ?? undefined,
    lang: searchParams.get("lang") ?? undefined,
  });

  if (!result.success) {
    throw new ValidationError("Invalid query parameters", result.error.flatten());
  }

  return result.data;
}
