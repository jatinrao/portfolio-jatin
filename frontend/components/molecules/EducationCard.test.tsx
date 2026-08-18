import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockEducation } from '@/stories/fixtures'
import { EducationCard } from './EducationCard'

describe('EducationCard', () => {
  it('shows institution and program', () => {
    render(<EducationCard education={mockEducation[0]} locale="en" />)
    expect(screen.getByText('State University')).toBeInTheDocument()
    expect(screen.getByText(/B\.S\./)).toBeInTheDocument()
    expect(screen.getByText(/COMPUTER SCIENCE/)).toBeInTheDocument()
  })
})
