import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StatItem from './StatItem'

describe('StatItem', () => {
  it('renders value and label', () => {
    render(<StatItem value="8+" label="Years" />)
    expect(screen.getByText('8+')).toBeInTheDocument()
    expect(screen.getByText('Years')).toBeInTheDocument()
  })
})
