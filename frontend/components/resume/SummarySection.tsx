import { localizeBlocks, blocksToPlainText } from '@/lib/locale'
import type { ResumeModel } from '@/lib/resume/types'
import type { SupportedLanguage } from '@/lib/resume/validation'
import { SectionHeading } from '@/components/resume/SectionHeading'

interface SummarySectionProps {
  summary: ResumeModel['bio_short']
  lang:    SupportedLanguage
}

export function SummarySection({ summary, lang }: SummarySectionProps) {
  const blocks = localizeBlocks(summary, lang)
  const text   = blocksToPlainText(blocks)

  if (!text) return null

  return (
    <section style={{ marginBottom: '14px', breakInside: 'avoid' }}>
      {/* <SectionHeading>Summary</SectionHeading> */}
      <p style={{
        fontSize:      '10.5pt',
        color:         'var(--color-heading-ink)',
        lineHeight:    1.5,
        whiteSpace:    'pre-line',
        margin:        0,
      }}>
        {text}
      </p>
    </section>
  )
}
