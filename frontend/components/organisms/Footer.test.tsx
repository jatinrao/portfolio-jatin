import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('shows breadcrumb, copyright, and a legal link', () => {
    render(
      <Footer
        brandName="Jatin Kumar"
        tagline="Engineer"
        year={2026}
        locale="en"
        legalLinks={[{ label: 'Privacy', href: '/privacy' }]}
      />,
    )
    expect(screen.getByRole('link', { name: 'Jatin Kumar' })).toBeInTheDocument()
    expect(screen.getAllByText('Engineer').length).toBeGreaterThan(0)
    expect(screen.getByText(/Copyright © 2026 Jatin Kumar/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy' })).toBeInTheDocument()
  })
})
