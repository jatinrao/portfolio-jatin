import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockBlogPost } from '@/stories/fixtures'
import { ComparisonTable } from './ComparisonTable'

const table = mockBlogPost.body!.en!.find((b) => b._type === 'comparisonTable') as Extract<
  NonNullable<NonNullable<typeof mockBlogPost.body>['en']>[number],
  { _type: 'comparisonTable' }
>

describe('ComparisonTable', () => {
  it('renders the caption and footnote', () => {
    render(<ComparisonTable table={table} />)
    expect(screen.getByText('Evaluated against packages/core')).toBeInTheDocument()
    expect(screen.getByText('Scoped to this row only.')).toBeInTheDocument()
  })

  it('renders column names and descriptors', () => {
    render(<ComparisonTable table={table} />)
    expect(screen.getByText('Icon font')).toBeInTheDocument()
    expect(screen.getByText('Font Awesome')).toBeInTheDocument()
    expect(screen.getByText('@web-portfolio/icons')).toBeInTheDocument()
  })

  it('marks the highlighted column', () => {
    render(<ComparisonTable table={table} />)
    const highlighted = screen.getByText('@web-portfolio/icons').closest('th')
    expect(highlighted?.className).toContain('highlight')
    const plain = screen.getByText('Icon font').closest('th')
    expect(plain?.className).not.toContain('highlight')
  })

  it('renders group-divider rows', () => {
    render(<ComparisonTable table={table} />)
    expect(screen.getByText('Writing it')).toBeInTheDocument()
  })

  it('renders each data row label, cell note, and cell verdict icon', () => {
    render(<ComparisonTable table={table} />)
    expect(screen.getByText('Adding an icon')).toBeInTheDocument()
    expect(screen.getByText('nothing checks the glyph exists')).toBeInTheDocument()
    expect(screen.getByText('one prop')).toBeInTheDocument()
    expect(screen.getByTestId('icon-close')).toBeInTheDocument()
    expect(screen.getByTestId('icon-check')).toBeInTheDocument()
  })
})
