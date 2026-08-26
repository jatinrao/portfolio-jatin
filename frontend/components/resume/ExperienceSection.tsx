// NEW import needed — replace with your actual portable-text renderer if
// you already have one elsewhere in this codebase instead of adding this.
import { localize, localizeBlocks } from '@/lib/locale'
import { ResumeExperienceEntry } from '@/lib/resume/types'
import { SupportedLanguage } from '@/lib/resume/validation'
import { PortableText } from '@portabletext/react'
import { SectionHeading } from '@/components/resume/SectionHeading'
import { formatDateRange } from '@/lib/resume/format'
import { sizedImageUrl } from '@/lib/resume/image'

/** Matches .resume-avatar's box in print.styles.ts (19.5pt). */
const LOGO_PX = 26

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
}

function ExperienceEntry({ entry, lang }: ExperienceEntryProps) {
  const role = localize(entry.role, lang) || ''
  // `organization` is the real source of truth now; `company` only
  // survives as a fallback for as long as it's marked @deprecated on the
  // type, in case any data predates the organization reference existing.

  const orgName = localize(entry.organization?.name, lang) || ''
  const description = entry.description ? localize(entry.description, lang) : null;
  const logoUrl = entry.organization?.logo?.asset?.url;

  return (
    <article className="resume-surface resume-role">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '6pt', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 600, lineHeight: 1.3, color: 'var(--r-text-primary)' }}>
          {role}
        </h3>
        <span style={{ fontSize: '8pt', color: 'var(--r-text-tertiary)', whiteSpace: 'nowrap' }}>
          {formatDateRange(entry.startDate, entry.endDate, lang)}
        </span>
      </div>

      {orgName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5pt', marginTop: '3pt' }}>
          {logoUrl ? (
            <img
              src={sizedImageUrl(logoUrl, LOGO_PX)}
              alt=""
              width={LOGO_PX}
              height={LOGO_PX}
              className="resume-avatar"
            />
          ) : (
            <span style={{ fontSize: '9pt', color: 'var(--r-text-tertiary)' }}>·</span>
          )}
          <span style={{ fontSize: '9pt', color: 'var(--r-text-secondary)' }}>
            {orgName}
          </span>
        </div>
      )}

      {entry.isCurrent && (
        <span
          style={{
            display: 'inline-block',
            marginTop: '3pt',
            fontSize: '6.5pt',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            borderRadius: '100px',
            color: 'var(--color-on-primary)',
            backgroundColor: 'var(--r-accent)',
            padding: '1.5pt 6pt',
          }}
        >
          Active
        </span>
      )}

      {entry.location && <div style={{ fontSize: '8pt', color: 'var(--r-text-tertiary)', marginTop: '2pt' }}>{entry.location}</div>}

      <div style={{ marginTop: '4.5pt', fontSize: '9pt', lineHeight: 1.5, color: 'var(--r-text-primary)' }}>
        {description}
      </div>

      {entry.skills?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3.75pt', marginTop: '5.25pt' }}>
          {entry.skills.map((skill) => (
            <span key={skill._id} className="resume-tag">
              {localize(skill.name, lang)}
            </span>
          ))}
        </div>
      )}
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
    <section style={{ marginBottom: '10.5pt' }}>
      <SectionHeading>Experience</SectionHeading>
      {entries.map((entry) => (
        <ExperienceEntry key={entry.id} entry={entry} lang={lang} />
      ))}
    </section>
  )
}