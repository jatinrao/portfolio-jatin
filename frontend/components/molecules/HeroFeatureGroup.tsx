import { Icon } from '@web-portfolio/icons'
import { stegaClean } from '@sanity/client/stega'
import { dataAttr } from '@/sanity/lib/utils'

export interface HeroFeatureHighlight {
  key:    string
  iconName: string
  kicker: string
  label:  string
}

interface HeroFeatureGroupProps {
  personId?: string
  features:   HeroFeatureHighlight[]
  intro?:     string
  linkUrl?:   string
  linkLabel?: string
}

/**
 * Sanity-driven — every value here (icon, kicker, label, intro, link) comes
 * from `person.featureHighlights`/`featureIntro`/`featureLinkUrl`/
 * `featureLinkLabel` via HeroSection, which localizes before passing down.
 * Icons come from the same @web-portfolio/icons registry as Skill's icon
 * picker (`<Icon name=... />`), not an uploaded image — keeps this section
 * on the same icon pipeline as the rest of the site instead of a one-off
 * image-mask technique. Renders nothing if Studio has no feature highlights
 * set yet, rather than silently falling back to stale hardcoded content.
 */
export function HeroFeatureGroup({ personId, features, intro, linkUrl, linkLabel }: HeroFeatureGroupProps) {
  if (features.length === 0) return null

  return (
    <div className="hero-intro-inner">
      <ul className="hero-icon-group">
        {features.map((item) => (
          <li key={item.key} className="hero-icon-item">
            <span
              className="hero-icon-glyph"
              data-sanity={
                personId
                  ? dataAttr({
                      id: personId,
                      type: 'person',
                      path: `featureHighlights[_key=="${item.key}"].iconName`,
                    }).toString()
                  : undefined
              }
            >
              <Icon name={stegaClean(item.iconName)} size={40} color="var(--color-secondary)" />
            </span>
            <p className="hero-icon-metric">{item.kicker}</p>
            <p className="hero-icon-label">{item.label}</p>
          </li>
        ))}
      </ul>
      {intro && <p className="hero-repo-intro">{intro}</p>}
    </div>
  )
}
