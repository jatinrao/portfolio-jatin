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
    <article className="resume-surface resume-role">
      <div style={{ fontSize: '10pt', fontWeight: 600, color: 'var(--r-text-primary)' }}>
        {entry.url ? (
          <a href={entry.url} style={{ color: 'var(--r-accent)', textDecoration: 'none' }}>
            {entry.name}
          </a>
        ) : (
          entry.name
        )}
      </div>
      <p style={{ fontSize: '8.5pt', lineHeight: 1.4, color: 'var(--r-text-secondary)', margin: '2pt 0 0' }}>{description}</p>
      {entry.technologies.length > 0 && (
        <div style={{ fontSize: '8pt', color: 'var(--r-text-tertiary)', marginTop: '2pt' }}>
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
