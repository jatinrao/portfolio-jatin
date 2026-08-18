import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { mockHeader } from '@/stories/fixtures'
import { Header } from './Header'

describe('Header', () => {
  it('renders brand, nav, and CTA from the library Button', () => {
    render(<Header data={mockHeader} locale="en" />)
    expect(screen.getByText('Jatin Kumar')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })

  it('renders nothing without data', () => {
    const { container } = render(<Header data={null} locale="en" />)
    expect(container).toBeEmptyDOMElement()
  })
})
