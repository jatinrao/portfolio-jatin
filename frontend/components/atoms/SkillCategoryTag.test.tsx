import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkillCategoryTag } from './SkillCategoryTag'

describe('SkillCategoryTag', () => {
  it('renders nothing without a category', () => {
    const { container } = render(<SkillCategoryTag category={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('uses Badge for the category label', () => {
    render(<SkillCategoryTag category="language" />)
    expect(screen.getByText('Language')).toBeInTheDocument()
  })
})
