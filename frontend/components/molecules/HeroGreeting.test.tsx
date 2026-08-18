import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HeroGreeting from './HeroGreeting'

describe('HeroGreeting', () => {
  it('renders greeting copy', () => {
    render(<HeroGreeting text="Hi, my name is" />)
    expect(screen.getByText('Hi, my name is')).toBeInTheDocument()
  })
})
