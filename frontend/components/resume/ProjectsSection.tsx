import { localize } from '@/lib/locale'
import type { ResumeProjectEntry } from '@/lib/resume/types'
import type { SupportedLanguage } from '@/lib/resume/validation'
import { SectionHeading } from '@/components/resume/SectionHeading'

// ─── Sub-components ───────────────────────────────────────────────────────

interface ProjectEntryProps {
  entry: ResumeProjectEntry
  lang:  SupportedLanguage
}
function ProjectEntry({ entry, lang }: ProjectEntryProps) {
  const description = localize(entry.description, lang) || ''

  return (
    <article style={{ marginBottom: '10px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
      <div style={{ fontSize: '10.5pt', fontWeight: 700, color: 'var(--color-heading-ink)' }}>
        {entry.url ? (
          <a href={entry.url} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
            {entry.name}
          </a>
        ) : (
          entry.name
        )}
      </div>
      <p style={{ fontSize: '10pt', color: 'var(--color-on-surface-variant)', margin: '2px 0 0' }}>{description}</p>
      {entry.technologies.length > 0 && (
        <div style={{ fontSize: '9pt', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
          {entry.technologies.join(' · ')}
        </div>
      )}
    </article>
  )
}

// ─── Main component ───────────────────────────────────────────────────────

interface ProjectsSectionProps {
  entries: ResumeProjectEntry[]
  lang:    SupportedLanguage
}

export function ProjectsSection({ entries, lang }: ProjectsSectionProps) {
  if (entries.length === 0) return null

  return (
    <section style={{ marginBottom: '14px' }}>
      <SectionHeading>Projects</SectionHeading>
      {entries.map((entry) => (
        <ProjectEntry key={entry.id} entry={entry} lang={lang} />
      ))}
    </section>
  )
}
