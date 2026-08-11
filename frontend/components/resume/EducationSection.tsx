import { localize } from '@/lib/locale'
import type { ResumeEducationEntry } from '@/lib/resume/types'
import type { SupportedLanguage } from '@/lib/resume/validation'
import { formatDateRange } from '@/lib/resume/format'
import { SectionHeading } from '@/components/resume/SectionHeading'

// ─── Sub-components ───────────────────────────────────────────────────────

interface EducationEntryProps {
  entry: ResumeEducationEntry
  lang:  SupportedLanguage
}
function EducationEntry({ entry, lang }: EducationEntryProps) {
  const degree       = localize(entry.degree, lang) || ''
  const fieldOfStudy = localize(entry.fieldOfStudy, lang)
  const institutionName = localize(entry.institution,lang);
  console.log('Education debug',entry);

  return (
    <article style={{ breakInside: 'avoid', pageBreakInside: 'avoid'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '10.5pt', fontWeight: 700, color: '#1a1a1a' }}>
          {institutionName}
        </span>
        <span style={{ fontSize: '9pt', color: '#555555', whiteSpace: 'nowrap' }}>
          {formatDateRange(entry.startDate, entry.endDate, lang)}
        </span>
      </div>
      <div style={{ fontSize: '10pt', color: '#6b6b5e' }}>
        {degree}
        {fieldOfStudy ? `, ${fieldOfStudy}` : ''}
      </div>
    </article>
  )
}

// ─── Main component ───────────────────────────────────────────────────────

interface EducationSectionProps {
  entries: ResumeEducationEntry[]
  lang:    SupportedLanguage
}

export function EducationSection({ entries, lang }: EducationSectionProps) {
  if (entries.length === 0) return null

  return (
    <section style={{ marginBottom: '14px' }}>
      <SectionHeading>Education</SectionHeading>
      {entries.map((entry) => (
        <EducationEntry key={entry._id} entry={entry} lang={lang} />
      ))}
    </section>
  )
}
