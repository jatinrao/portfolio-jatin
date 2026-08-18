import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockSkills } from '@/stories/fixtures'
import { SkillCard } from './SkillCard'

describe('SkillCard', () => {
  it('shows skill name and experience', () => {
    render(<SkillCard skill={mockSkills[0]} locale="en" />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('6+ Yrs')).toBeInTheDocument()
  })
})
