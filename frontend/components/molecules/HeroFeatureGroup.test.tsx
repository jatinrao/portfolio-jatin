import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroFeatureGroup } from './HeroFeatureGroup'

const FEATURES = [
  { key: 'lighthouse', iconName: 'bolt', kicker: '100', label: 'Lighthouse score' },
]

describe('HeroFeatureGroup', () => {
  it('lists feature highlights and intro copy', () => {
    render(
      <HeroFeatureGroup
        features={FEATURES}
        intro="Repo intro"
        linkUrl="https://github.com/jatinrao/portfolio-jatin"
        linkLabel="Learn more"
      />,
    )
    expect(screen.getByText('Lighthouse score')).toBeInTheDocument()
    expect(screen.getByText('Repo intro')).toBeInTheDocument()
  })

  // The "Learn more" link markup was deliberately commented out in the
  // component (see f369024, "Improved button visibility and content
  // changes") — asserting its absence here so a future re-enable is a
  // conscious test update, not a silent regression either way.
  it('does not render a link even when linkUrl/linkLabel are set', () => {
    render(
      <HeroFeatureGroup
        features={FEATURES}
        linkUrl="https://github.com/jatinrao/portfolio-jatin"
        linkLabel="Learn more"
      />,
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders nothing when there are no feature highlights', () => {
    const { container } = render(<HeroFeatureGroup features={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
