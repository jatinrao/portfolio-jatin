import type { ResumeModel } from '@/lib/resume/types'
import type { SupportedLanguage } from '@/lib/resume/validation'
import { ResumeHeader } from '@/components/resume/ResumeHeader'
import { SummarySection } from '@/components/resume/SummarySection'
import { ExperienceSection } from '@/components/resume/ExperienceSection'
import { EducationSection } from '@/components/resume/EducationSection'
import { SkillsSection } from '@/components/resume/SkillsSection'
import { PRINT_STYLES } from '@/components/resume/print.styles'
import { localize } from '@/lib/locale'
import { ProjectMiniCard } from './ProjectCard'
import { DownloadResumeButton } from './DownloadResumeButton'
import { SectionHeading } from './SectionHeading'

interface ResumeDocumentProps {
  resume: ResumeModel
  /**
   * Explicit, not read from `useLanguage()` context: this component is
   * rendered in two places — the browser preview page (an ordinary
   * Server Component) and `resume-renderer.tsx` (via
   * `renderToStaticMarkup`, with no React context provider or browser
   * available at all). An explicit prop keeps it usable in both without
   * a client/server split.
   */
  lang: SupportedLanguage
}

/**
 * The single component that renders a resume, reused for:
 *   1. `app/resume/page.tsx` — browser preview, as a Server Component.
 *   2. `lib/rendering/resume-renderer.tsx` — passed to
 *      `renderToStaticMarkup` to produce the HTML handed to the PDF
 *      generator.
 *
 * No "use client" — no interactivity is needed, so the same render path
 * works identically in both contexts.
 */
export function ResumeDocument({ resume, lang }: ResumeDocumentProps) {
  return (
    <div className="resume-root">
      {/* eslint-disable-next-line react/no-danger -- static, non-user-controlled CSS string */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <div
        className="resume-page"
        style={{
          maxWidth:   '210mm',
          margin:     '0 auto',
          fontSize:   '10pt',
          lineHeight: 1.45,
          color:      'var(--r-text-primary)',
        }}
      >
        {/* Header identity — a full-bleed glass bar across the top of the
            page, as in the design reference. ResumeHeader's own internals
            are unchanged; only the surrounding spacing is new. */}
        <div style={{ padding: '0' }}>
          <ResumeHeader resume={resume} lang={lang} />
        </div>

        <main style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '8mm' }}>
          {/* Not present in the HTML mockup — kept as a full-width lead-in
              above the two-column split, since dropping the candidate's
              bio by default felt like the wrong call. Say the word if this
              layout is meant to omit the summary entirely. */}
          

          {/* Two-column split: 25% / 75%, matching the reference's
              lg:col-span-3 / lg:col-span-9. Grid (not float/inline-block)
              renders correctly under Chromium's print pipeline, which is
              what a DOM+CSS-based PDF export like this depends on. */}
          <div className="resume-columns">
            {/* Left column — Technical Stack. SkillsSection's internals are
                unchanged; only its position/width moved into this rail.
                (The mockup splits skills into two labeled groups — "Core
                Infrastructure" as a bulleted list, "Tooling & Methods" as
                chips. Replicating that split means grouping by category
                inside SkillsSection itself, which I haven't seen — happy
                to do that pass once you share that file.) */}
            <aside className="resume-rail">
              <SkillsSection skills={resume.skills} locale={lang} categoryLabels={resume.categoryLabels as any} />

            </aside>

            {/* Right column — Engineering Chronology. */}
            <section className="resume-main">
              <ExperienceSection entries={resume.experience} lang={lang} />
              <EducationSection entries={resume.education} lang={lang} />
              <section>
                    <SectionHeading>Projects</SectionHeading>
                     {resume.projects?.slice(0, 3).map(project => (<ProjectMiniCard key={project._id} project={project} locale={lang}/>))}

      <a
        href="https://jatin.getresume.dev/#projects"
        style={{
          display: 'inline-block',
          marginTop: '2mm',
          fontSize: '8pt',
          fontWeight: 600,
          color: 'var(--r-accent)',
        }}
      >
        More details →
      </a>
                  </section>
            </section>
          </div>
        </main>
        {/* <DownloadResumeButton slug="jatin-kumar"  lang={lang} /> */}
        {/* New — no footer existed in the previous single-column version.
            Matches the reference's centered rule + copyright bar. */}
        <footer
          style={{
            marginTop: '6mm',
            padding: '3mm 7mm 5mm',
            borderTop: '0.5px solid var(--r-separator)',
            textAlign: 'right',
            fontSize: '6.5pt',
            letterSpacing: '0.04em',
            color: 'var(--r-text-tertiary)',
          }}
        >
          {'Generated on'} {new Date().getDate()}/{new Date().getMonth() + 1}/{new Date().getFullYear()}
        </footer>
      </div>
    </div>
  )
}
