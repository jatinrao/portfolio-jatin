import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HeroFeatureGroup } from './HeroFeatureGroup'

describe('HeroFeatureGroup', () => {
  it('lists product metrics and a repo link', () => {
    render(<HeroFeatureGroup />)
    expect(screen.getByText('Lighthouse score')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /learn more/i })).toHaveAttribute(
      'href',
      'https://github.com/jatinrao/portfolio-jatin',
    )
  })
})
