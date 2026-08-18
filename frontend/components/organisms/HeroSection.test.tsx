import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockHero } from '@/stories/fixtures'
import { HeroSection } from './HeroSection'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('HeroSection', () => {
  it('renders name, greeting, and stats', () => {
    globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
    render(<HeroSection data={mockHero} locale="en" />)
    expect(screen.getByRole('region', { name: 'Hero' }).textContent).toContain('Jatin Kumar')
    expect(screen.getAllByText('Hi, my name is').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Years').length).toBeGreaterThan(0)
  })
})
