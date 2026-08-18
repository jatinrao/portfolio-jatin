// NEW import needed — replace with your actual portable-text renderer if
// you already have one elsewhere in this codebase instead of adding this.
import { localize, localizeBlocks } from '@/lib/locale'
import { ResumeExperienceEntry } from '@/lib/resume/types'
import { SupportedLanguage } from '@/lib/resume/validation'
import { PortableText } from '@portabletext/react'
import { SectionHeading } from '@/components/resume/SectionHeading'
import { formatDateRange } from '@/lib/resume/format'

// Assumed already available in this file, same as before: localize,
// formatDateRange, SectionHeading, ResumeExperienceEntry, SupportedLanguage.
// One addition: `localizeBlocks` — referenced in the mapper's own doc
// comment ("language resolution happens... via localize()/localizeBlocks()")
// as the sibling helper for LocaleBlockContent fields like `description`.
// import { localize, localizeBlocks } from '...'

const printPortableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p style={{ margin: '0 0 4pt', fontSize: '10pt', lineHeight: 1.4, color: 'var(--color-heading-ink)' }}>{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul style={{ margin: '4pt 0 0', paddingLeft: '16pt' }}>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li style={{ fontSize: '10pt', marginBottom: '2pt', color: 'var(--color-heading-ink)' }}>{children}</li>
    ),
  },
}

interface ExperienceEntryProps {
  entry: ResumeExperienceEntry
  lang: SupportedLanguage
  isLast: boolean
}

function ExperienceEntry({ entry, lang, isLast }: ExperienceEntryProps) {
  const role = localize(entry.role, lang) || ''
  // `organization` is the real source of truth now; `company` only
  // survives as a fallback for as long as it's marked @deprecated on the
  // type, in case any data predates the organization reference existing.

  const orgName = localize(entry.organization?.name, lang) || ''
  const description = entry.description ? localize(entry.description, lang) : null;
  

  return (
    <article style={{ display: 'flex', gap: '12pt', marginBottom: '10pt', breakInside: 'avoid', pageBreakInside: 'avoid',paddingTop:"4mm"  }}>
      {/* Rail: node + connecting line — Timeline's node/line pair, static
          instead of scroll-driven, since a printed page has no scroll
          position for the node to react to. */}
      <div style={{ width: '10pt', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: '7pt',
            height: '7pt',
            border: `1.5pt solid ${entry.isCurrent ? 'var(--color-primary)' : 'var(--color-heading-ink)'}`,
            backgroundColor: entry.isCurrent ? 'var(--color-primary)' : 'var(--color-surface)',
            flexShrink: 0,
          }}
        />
        {!isLast && <div style={{ flex: 1, width: '1.5pt', backgroundColor: 'var(--color-outline-variant)', marginTop: '2pt' }} />}
      </div>

      <div style={{ flex: 1, paddingBottom: '4pt' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8pt', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10.5pt', fontWeight: 700, color: 'var(--color-heading-ink)' }}>
            {role}
          </span>
          <span style={{ fontSize: '9pt', color: 'var(--color-muted-body)', whiteSpace: 'nowrap' }}>
            {formatDateRange(entry.startDate, entry.endDate, lang)}
          </span>
        </div>
        <div>
          <span style={{ fontSize: '10.5pt', fontWeight: 700, color: 'var(--color-heading-ink)' }}>       
            {orgName ? ` · ${orgName}` : ''}
          </span>
        </div>

        {entry.isCurrent && (
          <span
            style={{
              display: 'inline-block',
              marginTop: '2pt',
              fontSize: '7pt',
              textTransform: 'uppercase',
              color: 'var(--color-on-primary)',
              backgroundColor: 'var(--color-primary)',
              padding: '1pt 5pt',
            }}
          >
            Active
          </span>
        )}

        {entry.location && <div style={{ fontSize: '10pt', color: 'var(--color-on-surface-variant)', marginTop: '2pt' }}>{entry.location}</div>}

        
          <div style={{ marginTop: '4pt' }}>
            {description}
          </div>
        

        {entry.skills?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt', marginTop: '6pt' }}>
            {entry.skills.map((skill) => (
              <span
                key={skill._id}
                style={{
                  fontSize: '6pt',
                  // textTransform: 'uppercase',
                  border: '0.5pt solid var(--color-outline-variant)',
                  padding: '1pt 2pt',
                  color: 'var(--color-heading-ink)',
                }}
              >
                {localize(skill.name, lang)}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

// ─── Main component ───────────────────────────────────────────────────────

interface ExperienceSectionProps {
  entries: ResumeExperienceEntry[]
  lang: SupportedLanguage
}

export function ExperienceSection({ entries, lang }: ExperienceSectionProps) {
  if (!entries || entries.length === 0) return null

  return (
    <section style={{ marginBottom: '14pt' }}>
      <SectionHeading>Experience</SectionHeading>
      {entries.map((entry, index) => (
        <ExperienceEntry key={entry.id} entry={entry} lang={lang} isLast={index === entries.length - 1} />
      ))}
    </section>
  )
}