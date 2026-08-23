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
    <section
      style={{
        breakInside: 'avoid',
        display: 'flex',
        gap: '3pt',
        // Accent hairline instead of the old heading — the reference marks
        // the bio as a pull-quote with a rule down its left edge.
        borderLeft: '1.1pt solid var(--r-accent)',
        paddingLeft: '13.5pt',
        marginTop: '1.5pt',
      }}
    >
      {/* Decorative opening quote — signals "this is the introduction" at
          a glance, the way a pull-quote does, without adding a heading
          that would compete with Name/Skills/Experience for attention. */}
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          fontSize: '18pt',
          fontWeight: 700,
          lineHeight: '0.9',
          color: 'var(--r-accent)',
        }}
      >
        &ldquo;
      </span>
      <p style={{
        fontSize:      '9.75pt',
        color:         'var(--r-text-primary)',
        fontStyle:     'italic',
        lineHeight:    1.6,
        whiteSpace:    'pre-line',
        margin:        0,
      }}>
        {text}
        <span
          aria-hidden="true"
          style={{
            fontSize: '11pt',
            fontWeight: 700,
            color: 'var(--r-accent)',
          }}
        >
          &rdquo;
        </span>
      </p>
    </section>
  )
}
