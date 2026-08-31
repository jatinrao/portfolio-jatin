import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { mockBlogListItem } from '@/stories/fixtures'
import { BlogCard } from './BlogCard'

vi.mock('@/sanity/lib/utils', () => ({
  urlForImage: () => ({ url: () => '/hero/gift.png' }),
  dataAttr: () => ({ toString: () => 'data-sanity-stub' }),
}))

describe('BlogCard', () => {
  it('shows title, dek, category, and formatted date', () => {
    render(<BlogCard post={mockBlogListItem} locale="en" />)
    expect(screen.getByText('Mount the Frame, Not the Picture')).toBeInTheDocument()
    expect(
      screen.getByText('An icon needs a frame to hang in and a picture to hang there.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Shipping Notes')).toBeInTheDocument()
    expect(screen.getByText('August 1, 2026')).toBeInTheDocument()
  })

  it('links to the post detail route for the given locale', () => {
    render(<BlogCard post={mockBlogListItem} locale="en" />)
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/en/blog/mount-the-frame-not-the-picture',
    )
  })
})
