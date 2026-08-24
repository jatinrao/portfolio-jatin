'use client'

import dynamic from 'next/dynamic'
import { LanguageSwitcher } from '@/components/organisms/LanguageSwitcher'
import { ThemeToggle } from '@/components/organisms/ThemeToggle'
import { GlassToolbar } from '@/components/atoms/GlassToolbar'
import { DownloadResumeButton } from '@/components/resume/DownloadResumeButton'
import { useLanguage } from '@/components/organisms/LanguageContext'

// Dev-only, and not needed in the server bundle — dynamic import keeps it
// out of the production client bundle entirely rather than just hiding it
// behind the NODE_ENV check at render time.
const DesignTokenEditor = dynamic(() => import('@/components/dev/DesignTokenEditor'), { ssr: false })

interface FloatingControlsProps {
  /**
   * Slug of the resume to offer for download from this toolbar.
   * `lib/resume/validation.ts` (where `DEFAULT_RESUME_SLUG` lives) is
   * `server-only` and can't be imported into this client component, so
   * the caller passes the same slug it already hardcodes for its own
   * Sanity fetch (see LandingPage.tsx). Omit to hide the download button
   * — e.g. on pages with no associated resume.
   */
  resumeSlug?: string
}

/**
 * Single fixed-position anchor for every floating bottom-right control.
 * Previously each control (language switcher, dev token editor) carried
 * its own `position: fixed` + z-index, so their spacing/stacking was
 * coincidental rather than a real layout. This is the one place that owns
 * the group's position — each child is a plain relatively-positioned
 * trigger (+ its own absolutely-anchored dropdown/panel where it has one).
 */
export function FloatingControls({ resumeSlug }: FloatingControlsProps) {
  const { lang } = useLanguage()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <GlassToolbar label="Site controls" className="rounded-full">
        <ThemeToggle />
        <LanguageSwitcher />
        {resumeSlug && <DownloadResumeButton slug={resumeSlug} lang={lang} />}
        {process.env.NODE_ENV === 'development' && <DesignTokenEditor />}
      </GlassToolbar>
    </div>
  )
}
