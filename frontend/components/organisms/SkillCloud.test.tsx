import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockSkills } from '@/stories/fixtures'
import { SkillCloud } from './SkillCloud'

describe('SkillCloud', () => {
  it('renders the skill river region', () => {
    render(<SkillCloud data={{ skills: mockSkills, category_labels: {} }} locale="en" />)
    expect(screen.getByRole('region', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getAllByText('React').length).toBeGreaterThan(0)
  })
})
