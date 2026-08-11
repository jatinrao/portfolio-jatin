import { localize } from '@/lib/locale'
import type { ResumeModel } from '@/lib/resume/types'
import type { SupportedLanguage } from '@/lib/resume/validation'
import { SummarySection } from './SummarySection';
import ConnectChannelsVariant from './ConnectChannelsVariant';

// ─── Sub-components ───────────────────────────────────────────────────────

interface ContactItemProps { children: React.ReactNode; href?: string }
function ContactItem({ children, href }: ContactItemProps) {
  const style: React.CSSProperties = {
    fontSize: '9pt',
    color:    '#333333',
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
  return (
    <header>
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '3.17mm', // was 12px
      justifyContent: 'space-between',
      marginBottom: '4.76mm', // was 18px
      borderBottom: '0.53mm solid #2d5a3d', // was 2px
      paddingBottom: '2.65mm', // was 10px
      breakInside: 'avoid',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {resumeImageUrl && (
        <div style={{ display: 'block' }}>
          <img
            src={resumeImageUrl}
            alt={resumeImageAlt}
            width={78}
            height={78}
            style={{
              border: '0.53mm solid #2d5a3d', // was 2px — border-primary border-2
              height: 'auto',
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
          marginLeft: '2.12mm', // was 8px
        }}
      >
        <h1
          style={{
            fontSize: '22pt',
            fontWeight: 900,
            letterSpacing: '-0.13mm', // was -0.5px
            color: '#1a1a1a',
            margin: '0 0 0mm',
          }}
        >
          {fullName}
        </h1>

        {headline && (
          <p
            style={{
              fontSize: '11pt',
              color: '#2d5a3d',
              fontWeight: 600,
              margin: '0 0 0.53mm', // was 2px
            }}
          >
            {headline}
          </p>
          
        )}
        <a
        href="https://jatin.getresume.dev/"
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
      </a>
      </div>
    </div>

    <div
      style={{
        display: 'flex',
        transform: 'scale(0.65)',
        marginTop: '-2.12mm', // was -8px
        transformOrigin: 'right',
      }}
    >
      <ConnectChannelsVariant channels={resume.channels} locale={lang} />
    </div>
  </div>
  <SummarySection summary={resume.bio_short} lang={lang} />
</header>)
}
