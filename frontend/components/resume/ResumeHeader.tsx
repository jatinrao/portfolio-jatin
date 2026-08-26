import { localize } from '@/lib/locale'
import type { ResumeModel } from '@/lib/resume/types'
import type { SupportedLanguage } from '@/lib/resume/validation'
import { SummarySection } from './SummarySection';
import { ResumeConnectIcons, PORTFOLIO_URL, getEmailAddress } from './ResumeConnectIcons';
import { sizedImageUrl } from '@/lib/resume/image';

/** Matches .resume-name's sibling headshot size in print.styles.ts (75pt). */
const HEADSHOT_PX = 100;

// ─── Sub-components ───────────────────────────────────────────────────────

interface ContactItemProps { children: React.ReactNode; href?: string }
function ContactItem({ children, href }: ContactItemProps) {
  const style: React.CSSProperties = {
    fontSize: '9pt',
    color:    'var(--color-muted-body)',
  }
  if (href) {
    return (
      <a href={href} style={{ ...style, textDecoration: 'none' }}>
        {children}
      </a>
    )
  }
  return <span style={style}>{children}</span>
}

// ─── Main component ───────────────────────────────────────────────────────

interface ResumeHeaderProps {
  resume: ResumeModel
  lang:   SupportedLanguage
}

export function ResumeHeader({ resume, lang }: ResumeHeaderProps) {
  const fullName = localize(resume.name, lang) || ''
  const headline = localize(resume.headline, lang)
  const resumeImageUrl  = resume.resumeImage?.asset?.url
  const resumeImageAlt  = typeof resume.resumeImage?.alt === 'object'
    ? localize(resume.resumeImage.alt, lang)
    : resume.resumeImage?.alt
  const resumeImageLqip = resume.resumeImage?.asset?.metadata?.lqip;
  const email = getEmailAddress(resume.channels, lang);
  return (
    <header>
  {/* Layout lives in print.styles.ts's .resume-header-bar rather than
      inline, so the narrow-viewport media query there can restack it —
      an inline style would win over any stylesheet rule. */}
  <div className="resume-surface resume-header-bar" style={{ breakInside: 'avoid' }}>
    {/* Left: headshot alone — the connect icons live in the name column
        below, where there's actually unused vertical space (that column
        is shorter than the bio beside it), instead of cramped under the
        78px-wide image. */}
    {resumeImageUrl && (
      <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 auto' }}>
        <img
          src={sizedImageUrl(resumeImageUrl, HEADSHOT_PX)}
          alt={resumeImageAlt}
          width={HEADSHOT_PX}
          height={HEADSHOT_PX}
          style={{
            width: '75pt',
            height: '75pt',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '0.5px solid var(--r-glass-border)',
            boxShadow: 'var(--r-glass-shadow)',
          }}
          // openToWork={resume.openToWork}
          // openToWorkLabel={openToWorkLabel}
        />
      </div>
    )}

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: '0 0 auto',
      }}
    >
      <h1 className="resume-name">
        {fullName}
      </h1>

      {headline && (
        <p className="resume-headline">
          {headline}
        </p>

      )}

      {/* Icon-only contact links carry no text a PDF's text layer
          exposes (aria-label isn't part of the rendered content stream),
          so a plain-text ATS parser would otherwise find no email
          address anywhere in the document. */}
      {email && (
        <p style={{ margin: '1.5pt 0 0', fontSize: '8pt', color: 'var(--color-muted-body)' }}>
          {email}
        </p>
      )}
      {/* <a
      href={PORTFOLIO_URL}
      target="_blank"
      style={{
         display: 'inline-block',
        // fontFamily: 'var(--font-label-caps)',
        fontSize: '8pt',
        // textTransform: 'uppercase',
        // letterSpacing: '0.025em', // tracking-wide
        // color: 'var(--color-primary, #2d5a3d)',
        textDecoration: 'underline',
        // textUnderlineOffset: '2px',
        zIndex:100,
        // marginTop:"-8mm"
      }}
    >
      jatin.getresume.dev →
    </a> */}

    <div style={{ marginTop: '7.5pt' }}>
      <ResumeConnectIcons channels={resume.channels} locale={lang} />
    </div>
    </div>

    {/* Right: bio, filling whatever width is left in the row instead of
        its own full-width block below the name — saves a full text
        block's worth of vertical space on a page that's already tight. */}
    <div className="resume-header-bio">
      <SummarySection summary={resume.bio_short} lang={lang} />
    </div>
  </div>
</header>)
}
