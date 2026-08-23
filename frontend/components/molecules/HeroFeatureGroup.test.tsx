import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroFeatureGroup } from './HeroFeatureGroup'

const FEATURES = [
  { key: 'lighthouse', iconName: 'bolt', kicker: '100', label: 'Lighthouse score' },
]

describe('HeroFeatureGroup', () => {
  it('lists feature highlights and a link', () => {
    render(
      <HeroFeatureGroup
        features={FEATURES}
        intro="Repo intro"
        linkUrl="https://github.com/jatinrao/portfolio-jatin"
        linkLabel="Learn more"
      />,
    )
    expect(screen.getByText('Lighthouse score')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute(
      'href',
      'https://github.com/jatinrao/portfolio-jatin',
    )
  })

  it('renders nothing when there are no feature highlights', () => {
    const { container } = render(<HeroFeatureGroup features={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
