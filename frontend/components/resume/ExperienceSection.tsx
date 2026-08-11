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
      <p style={{ margin: '0 0 4pt', fontSize: '10pt', lineHeight: 1.4, color: '#1a1a1a' }}>{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul style={{ margin: '4pt 0 0', paddingLeft: '16pt' }}>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li style={{ fontSize: '10pt', marginBottom: '2pt', color: '#1a1a1a' }}>{children}</li>
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
            border: `1.5pt solid ${entry.isCurrent ? '#3b684a' : '#1a1a1a'}`,
            backgroundColor: entry.isCurrent ? '#3b684a' : '#fcf9f3',
            flexShrink: 0,
          }}
        />
        {!isLast && <div style={{ flex: 1, width: '1.5pt', backgroundColor: '#d0c5b2', marginTop: '2pt' }} />}
      </div>

      <div style={{ flex: 1, paddingBottom: '4pt' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8pt', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10.5pt', fontWeight: 700, color: '#1a1a1a' }}>
            {role}
          </span>
          <span style={{ fontSize: '9pt', color: '#555555', whiteSpace: 'nowrap' }}>
            {formatDateRange(entry.startDate, entry.endDate, lang)}
          </span>
        </div>
        <div>
          <span style={{ fontSize: '10.5pt', fontWeight: 700, color: '#1a1a1a' }}>       
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
              color: '#ffffff',
              backgroundColor: '#3b684a',
              padding: '1pt 5pt',
            }}
          >
            Active
          </span>
        )}

        {entry.location && <div style={{ fontSize: '10pt', color: '#6b6b5e', marginTop: '2pt' }}>{entry.location}</div>}

        
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
                  border: '0.5pt solid #d0c5b2',
                  padding: '1pt 2pt',
                  color: '#1a1a1a',
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