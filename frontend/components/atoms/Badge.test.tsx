import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Badge from './Badge'

describe('Badge', () => {
  it('renders label text', () => {
    render(<Badge>Featured</Badge>)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })
})
