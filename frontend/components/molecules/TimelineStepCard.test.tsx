import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimelineScrollProvider } from '@/context/timeline-scroll-context'
import { mockExperience } from '@/stories/fixtures'
import { TimelineStepCard } from './TimelineStepCard'

describe('TimelineStepCard', () => {
  it('shows role and organization', () => {
    render(
      <TimelineScrollProvider>
        <TimelineStepCard entry={mockExperience[0]} locale="en" />
      </TimelineScrollProvider>,
    )
    expect(screen.getByText('Staff Engineer')).toBeInTheDocument()
    expect(screen.getByText('Acme')).toBeInTheDocument()
  })
})
