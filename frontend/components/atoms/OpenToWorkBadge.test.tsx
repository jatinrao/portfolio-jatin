import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OpenToWorkBadge } from './OpenToWorkBadge'

describe('OpenToWorkBadge', () => {
  it('shows highlight and label', () => {
    render(<OpenToWorkBadge highlight="✓" label="Open to Work" />)
    expect(screen.getByText('✓')).toBeInTheDocument()
    expect(screen.getByText('Open to Work')).toBeInTheDocument()
  })
})
