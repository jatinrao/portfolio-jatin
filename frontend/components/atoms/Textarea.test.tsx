import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Textarea from './Textarea'

describe('Textarea', () => {
  it('renders a multiline field', () => {
    render(<Textarea name="message" placeholder="Message" />)
    expect(screen.getByPlaceholderText('Message')).toHaveAttribute('name', 'message')
  })
})
