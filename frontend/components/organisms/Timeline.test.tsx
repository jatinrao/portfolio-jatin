import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockEducation, mockExperience } from '@/stories/fixtures'
import { Timeline } from './Timeline'

describe('Timeline', () => {
  it('renders experience and education cards', () => {
    render(
      <Timeline
        data={{ experience: mockExperience, education: mockEducation }}
        locale="en"
      />,
    )
    expect(screen.getByText('Staff Engineer')).toBeInTheDocument()
    expect(screen.getByText('State University')).toBeInTheDocument()
  })
})
