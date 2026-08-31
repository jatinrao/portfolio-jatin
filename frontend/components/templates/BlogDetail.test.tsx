import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { mockBlogPost, mockBlogPostMinimal } from '@/stories/fixtures'
import BlogDetail from './BlogDetail'

vi.mock('@/sanity/lib/utils', () => ({
  urlForImage: () => ({ url: () => '/hero/gift.png' }),
  dataAttr: () => ({ toString: () => 'data-sanity-stub' }),
  // Mirrors the real resolveRichTextLink (sanity/lib/utils.ts) closely enough
  // for these tests — kept a plain stub rather than importOriginal so the
  // real module's top-level createImageUrlBuilder() call (which needs
  // NEXT_PUBLIC_SANITY_* env vars) never runs under jsdom.
  resolveRichTextLink: (
    link: { linkType?: string; href?: string; internalRef?: { _type: string; slug: string } | null } | null,
    locale: string,
  ) => {
    if (!link) return null
    if (link.linkType === 'internal' && link.internalRef?.slug) {
      const base = link.internalRef._type === 'project' ? 'projects' : 'blog'
      return { href: `/${locale}/${base}/${link.internalRef.slug}` }
    }
    if (link.linkType === 'external' && link.href) return { href: link.href }
    return null
  },
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
    // embedded image
    expect(screen.getByAltText('A framed screenshot mid-body')).toBeInTheDocument()
    expect(screen.getByText('Editors can drop images between paragraphs.')).toBeInTheDocument()
    expect(screen.getByText('— Sanity Studio')).toBeInTheDocument()
  })

  it('resolves external and internal links inside body text', () => {
    render(<BlogDetail post={mockBlogPost} locale="en" />)

    const externalLink = screen.getByRole('link', { name: 'docs' })
    expect(externalLink).toHaveAttribute('href', 'https://icons.getresume.dev')
    expect(externalLink).not.toHaveAttribute('target')

    const internalLink = screen.getByRole('link', { name: 'other post' })
    expect(internalLink).toHaveAttribute('href', '/en/blog/a-minimal-post')
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
