import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimelineScrollProvider } from '@/context/timeline-scroll-context'
import { TimelineNode } from './TimelineNode'

describe('TimelineNode', () => {
  it('renders the node inside the timeline scroll context', () => {
    const { container } = render(
      <TimelineScrollProvider>
        <TimelineNode />
      </TimelineScrollProvider>,
    )
    expect(container.querySelector('.timeline-node')).toBeTruthy()
  })
})
