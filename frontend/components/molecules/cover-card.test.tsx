import { render, screen } from '@testing-library/react'
import { motionValue } from 'framer-motion'
import { describe, expect, it, vi } from 'vitest'
import { mockProjects } from '@/stories/fixtures'
import { CoverCard } from './cover-card'

vi.mock('@/sanity/lib/utils', () => ({
  urlForImage: () => ({ url: () => '/hero/gift.png' }),
}))

const geometry = {
  cardWidth: 200,
  cardHeight: 260,
  containerHeight: 300,
  xOffsets: [-80, -40, 0, 40, 80] as [number, number, number, number, number],
  zDepths: [20, -10, -30] as [number, number, number],
}

describe('CoverCard', () => {
  it('shows the project title', () => {
    render(
      <CoverCard
        project={mockProjects[0]}
        locale="en"
        index={0}
        springIndex={motionValue(0)}
        geometry={geometry}
        onClick={() => undefined}
      />,
    )
    expect(screen.getByRole('group', { name: 'Portfolio' })).toBeInTheDocument()
  })
})
