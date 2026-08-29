import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('reverses column order so the highlighted column comes first', () => {
    render(<ComparisonTable table={table} />)
    const headers = screen.getAllByRole('columnheader').map((h) => h.textContent)
    // headers[0] is the empty row-label corner cell
    expect(headers[1]).toContain('@web-portfolio/icons')
    expect(headers[2]).toContain('Icon font')
  })

  it("keeps each cell aligned with its own column's data after reversing", () => {
    render(<ComparisonTable table={table} />)
    // "one prop" was authored under @web-portfolio/icons (check) — after
    // reversing columns, its cell must reverse along with it, not stay
    // pinned to whatever column now sits in that array slot.
    expect(screen.getByTestId('icon-check').closest('td')).toHaveTextContent('one prop')
    expect(screen.getByTestId('icon-close').closest('td')).toHaveTextContent(
      'nothing checks the glyph exists',
    )
  })

  it('freezes the highlighted column right after the row-label column, leaving the rest scrollable', () => {
    render(<ComparisonTable table={table} />)
    const highlighted = screen.getByText('@web-portfolio/icons').closest('th')
    expect(highlighted?.className).toContain('sticky')
    expect(highlighted?.style.left).toBe('120px')

    const plain = screen.getByText('Icon font').closest('th')
    expect(plain?.className).not.toContain('sticky')
    expect(plain?.style.left).toBe('')
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

  it('does not show the expanded modal until Expand is clicked', () => {
    render(<ComparisonTable table={table} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens a fullscreen modal with the same content when Expand is clicked, and closes on the close button', async () => {
    const user = userEvent.setup()
    render(<ComparisonTable table={table} />)

    await user.click(screen.getByRole('button', { name: 'Expand comparison table' }))

    const dialog = screen.getByRole('dialog', { name: 'Comparison table, expanded' })
    expect(dialog).toBeInTheDocument()
    // Content is duplicated (inline view + modal), not moved
    expect(screen.getAllByText('Icon font')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Close expanded comparison table' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the modal on Escape', async () => {
    const user = userEvent.setup()
    render(<ComparisonTable table={table} />)

    await user.click(screen.getByRole('button', { name: 'Expand comparison table' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
