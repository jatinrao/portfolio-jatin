import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localize } from "@/lib/locale";
import { getResumeCached } from "@/lib/resume/service";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ResumeThemeToggle } from "@/components/resume/ResumeThemeToggle";
import { ResumeNotFoundError } from "@/lib/shared/errors";
import {
  DEFAULT_RESUME_SLUG,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/lib/resume/validation";

interface ResumePageProps {
  searchParams: Promise<{ slug?: string; lang?: string }>;
}

function resolveLang(raw: string | undefined): SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(raw ?? "")
    ? (raw as SupportedLanguage)
    : DEFAULT_LANGUAGE;
}

/**
 * Mirrors the pattern in app/layout.tsx's generateMetadata: fetch once,
 * build a title/description from it. Kept self-contained (no dependency
 * on the site-wide `settingsQuery`/`resolveOpenGraphImage` helpers used
 * in the root layout, since this page's title should reflect the
 * specific person's resume, not the site defaults) — but the two compose
 * naturally: the root layout's `template: "%s | ${title}"` will still
 * wrap whatever title this returns.
 */
export async function generateMetadata({ searchParams }: ResumePageProps): Promise<Metadata> {
  const { slug = DEFAULT_RESUME_SLUG, lang: rawLang } = await searchParams;
  const lang = resolveLang(rawLang);

  try {
    const resume = await getResumeCached(slug);
    const fullName = localize(resume.name, lang) || "Resume";
    const headline = localize(resume.headline, lang);

    return {
      title: headline ? `${fullName} — ${headline}` : fullName,
      description: headline,
    };
  } catch {
    // Don't let a metadata-only failure take down the page; the page
    // body's own try/catch below handles the 404 case properly.
    return { title: "Resume" };
  }
}

/**
 * Ordinary React Server Component. Renders the exact same
 * <ResumeDocument> used by the PDF pipeline for a given `?lang=`, so what
 * an editor sees here in the browser (per language) is exactly what ends
 * up in the generated PDF for that language — one component, one source
 * of truth for layout and content, per language driven by the query
 * string rather than the site's live `LanguageContext` (there's no
 * single "current visitor language" for a document meant to be
 * downloaded and printed).
 */
export default async function ResumePage({ searchParams }: ResumePageProps) {
  const { slug = DEFAULT_RESUME_SLUG, lang: rawLang } = await searchParams;
  const lang = resolveLang(rawLang);

  let resume;
  try {
    resume = await getResumeCached(slug);
  } catch (err) {
    if (err instanceof ResumeNotFoundError) {
      notFound();
    }
    throw err;
  }

  return (
    <>
      <ResumeDocument resume={resume} lang={lang} />
      {/* Browser-only chrome — never part of the printed/PDF document. */}
      <ResumeThemeToggle slug={slug} lang={lang} />
    </>
  );
}