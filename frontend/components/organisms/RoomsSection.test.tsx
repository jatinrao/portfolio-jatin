import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RoomsSection } from './RoomsSection'

describe('RoomsSection', () => {
  it('renders copy and screen for each room', () => {
    render(
      <RoomsSection
        rooms={[
          {
            id: 'skills',
            kind: 'skills',
            heading: 'Skills',
            subheading: 'What I use.',
            colorVar: '--color-surface',
            screenColorVar: '--color-surface',
            content: <p>River</p>,
          },
        ]}
      />,
    )
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('What I use.')).toBeInTheDocument()
    expect(screen.getByText('River')).toBeInTheDocument()
  })
})
