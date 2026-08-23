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

/**
 * The appearance the exported PDF is rendered in. Defaults to `light`:
 * a resume that arrives without an explicit preference is going to be
 * read on paper or in a viewer, and light is the safe assumption there.
 */
export const RESUME_THEMES = ["light", "dark"] as const;
export type ResumeTheme = (typeof RESUME_THEMES)[number];

export const DEFAULT_RESUME_THEME: ResumeTheme = "light";

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
  theme: z
    .enum(RESUME_THEMES)
    .default(DEFAULT_RESUME_THEME),
});

export interface ResumePdfQuery {
  slug: string;
  lang: SupportedLanguage;
  theme: ResumeTheme;
}

export function parseResumeQuery(searchParams: URLSearchParams): ResumePdfQuery {
  const result = querySchema.safeParse({
    slug: searchParams.get("slug") ?? undefined,
    lang: searchParams.get("lang") ?? undefined,
    theme: searchParams.get("theme") ?? undefined,
  });

  if (!result.success) {
    throw new ValidationError("Invalid query parameters", result.error.flatten());
  }

  return result.data;
}
