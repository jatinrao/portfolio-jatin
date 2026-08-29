import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { mockBlogPost, mockBlogPostMinimal } from '@/stories/fixtures'
import BlogDetail from './BlogDetail'

vi.mock('@/sanity/lib/utils', () => ({
  urlForImage: () => ({ url: () => '/hero/gift.png' }),
}))

describe('BlogDetail', () => {
  it('renders eyebrow, date, headline, dek, and byline', () => {
    render(<BlogDetail post={mockBlogPost} locale="en" />)
    expect(screen.getByText('Shipping Notes')).toBeInTheDocument()
    expect(screen.getByText('August 1, 2026')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Mount the Frame, Not the Picture' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('An icon needs a frame to hang in and a picture to hang there.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Jatin Kumar')).toBeInTheDocument()
  })

  it('renders the stat strip when stats are present', () => {
    render(<BlogDetail post={mockBlogPost} locale="en" />)
    expect(screen.getByText('633')).toBeInTheDocument()
    expect(screen.getByText('bundled icons')).toBeInTheDocument()
  })

  it('omits the stat strip and byline when absent', () => {
    render(<BlogDetail post={mockBlogPostMinimal} locale="en" />)
    expect(screen.queryByText('633')).not.toBeInTheDocument()
  })

  it('renders each body block type', () => {
    render(<BlogDetail post={mockBlogPost} locale="en" />)
    // paragraph
    expect(screen.getByText('Every icon makes two decisions at once.')).toBeInTheDocument()
    // pull-quote (blockquote)
    const quote = screen.getByText('Mount the frame, hand the picture over.')
    expect(quote.closest('blockquote')).toBeInTheDocument()
    // calloutBox
    expect(screen.getByText("What we're actually claiming")).toBeInTheDocument()
    expect(screen.getByText('A narrower claim than "faster" or "smaller".')).toBeInTheDocument()
    // codeSnippet
    expect(screen.getByText('packages/react — usage')).toBeInTheDocument()
    expect(screen.getByText('tsx')).toBeInTheDocument()
    expect(screen.getByText('<Icon name="docker" size={32} />')).toBeInTheDocument()
    // comparisonTable (delegated to ComparisonTable)
    expect(screen.getByText('Evaluated against packages/core')).toBeInTheDocument()
  })

  it('renders footer links when present, omits them when absent', () => {
    const { rerender } = render(<BlogDetail post={mockBlogPost} locale="en" />)
    expect(screen.getByRole('link', { name: 'icons.getresume.dev' })).toHaveAttribute(
      'href',
      'https://icons.getresume.dev',
    )

    rerender(<BlogDetail post={mockBlogPostMinimal} locale="en" />)
    expect(screen.queryByText('icons.getresume.dev')).not.toBeInTheDocument()
  })
})
