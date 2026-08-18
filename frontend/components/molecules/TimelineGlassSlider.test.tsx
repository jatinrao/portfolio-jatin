import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimelineScrollProvider } from '@/context/timeline-scroll-context'
import { TimelineGlassSlider } from './TimelineGlassSlider'

describe('TimelineGlassSlider', () => {
  it('renders the HIG slider track', () => {
    const { container } = render(
      <TimelineScrollProvider>
        <TimelineGlassSlider />
      </TimelineScrollProvider>,
    )
    expect(container.querySelector('.timeline-slider')).toBeTruthy()
    expect(container.querySelector('.timeline-slider-knob')).toBeTruthy()
  })
})
