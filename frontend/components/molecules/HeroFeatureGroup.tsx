import Link from 'next/link'

const REPO_URL = 'https://github.com/jatinrao/portfolio-jatin'
const REPO_INTRO =
  'An open Next.js and Sanity workspace for this site — live visual editing, six locales including RTL, scroll rooms, and a resume-to-PDF pipeline. One CMS, one deploy, every page in sync.'

const FEATURES = [
  {
    id: 'lighthouse',
    src: '/hero/bolt.shield.png',
    kicker: '100',
    label: 'Lighthouse score',
  },
  {
    id: 'cms',
    src: '/hero/sparkle.text.clipboard.png',
    kicker: '100%',
    label: 'CMS coverage',
  },
  {
    id: 'i18n',
    src: '/hero/globe.central.south.asia.png',
    kicker: '6',
    label: 'Languages supported',
  },
  {
    id: 'packages',
    src: '/hero/gift.png',
    kicker: '3',
    label: 'Packages published',
  },
] as const

function HeroOriginalGlyph({ src }: { src: string }) {
  return (
    <span
      className="hero-sf-original"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
      }}
      aria-hidden="true"
    />
  )
}

export function HeroFeatureGroup() {
  return (
    <div className="hero-intro-inner">
      <ul className="hero-icon-group">
        {FEATURES.map((item) => (
          <li key={item.id} className="hero-icon-item">
            <span className="hero-icon-glyph">
              <HeroOriginalGlyph src={item.src} />
            </span>
            <p className="hero-icon-metric">{item.kicker}</p>
            <p className="hero-icon-label">{item.label}</p>
          </li>
        ))}
      </ul>
      <p className="hero-repo-intro">{REPO_INTRO}</p>
      <Link
        href={REPO_URL}
        className="hero-more"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="hero-link-copy">Learn more</span>
      </Link>
    </div>
  )
}
