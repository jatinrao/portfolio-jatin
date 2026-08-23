'use client'

import { ThemeToggle } from '@/components/organisms/ThemeToggle'
import { GlassToolbar } from '@/components/atoms/GlassToolbar'
import { ResumeLanguageSwitcher } from '@/components/resume/ResumeLanguageSwitcher'
import { DownloadResumeButton } from '@/components/resume/DownloadResumeButton'
import type { SupportedLanguage } from '@/lib/resume/validation'

interface ResumeControlsProps {
  slug: string
  lang: SupportedLanguage
}

/**
 * `/resume`'s only piece of chrome: theme, language, and download,
 * grouped on one floating glass toolbar.
 *
 * `/resume` sits above `app/[lang]/`, so it never gets that segment's
 * <FloatingControls> — which is why the page had no way to reach light/
 * dark mode or a language switcher even though the rest of the site did.
 * This is the same bottom-right anchor as FloatingControls, but with
 * `<ResumeLanguageSwitcher>` (query-string driven) instead of the site's
 * `<LanguageSwitcher>` (route driven) and `<DownloadResumeButton>` added,
 * since export is this page's whole reason for existing.
 *
 * `resume-no-print` is defined in print.styles.ts — the control is
 * browser chrome, not part of the document, so it disappears when
 * printed/exported. It's outside `.resume-root` on purpose: it should
 * keep using the site's own glass tokens rather than the document's.
 */
export function ResumeThemeToggle({ slug, lang }: ResumeControlsProps) {
  return (
    <div
      className="resume-no-print"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <GlassToolbar label="Resume controls" className="rounded-full">
        <ThemeToggle />
        <ResumeLanguageSwitcher slug={slug} lang={lang} />
        <DownloadResumeButton slug={slug} lang={lang} />
      </GlassToolbar>
    </div>
  )
}
