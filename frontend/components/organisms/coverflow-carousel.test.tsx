import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { mockProjects, mockProjectsSection } from '@/stories/fixtures'
import { ProjectCarousel } from './coverflow-carousel'

vi.mock('@/sanity/lib/utils', () => ({
  urlForImage: () => ({ url: () => '/hero/gift.png', width: () => ({ fit: () => ({ url: () => '/hero/gift.png' }) }) }),
}))

describe('ProjectCarousel', () => {
  it('exposes page controls and prev/next buttons', () => {
    render(
      <ProjectCarousel data={mockProjects} locale="en" section={mockProjectsSection} />,
    )
    expect(screen.getByRole('region', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Project pages' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'Portfolio' }).length).toBeGreaterThan(0)
  })
})
