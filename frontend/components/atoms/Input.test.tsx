import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Input from './Input'

describe('Input', () => {
  it('renders a named field', () => {
    render(<Input name="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('name', 'email')
  })
})
