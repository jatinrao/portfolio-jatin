import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TimelineScrollProvider } from '@/context/timeline-scroll-context'
import { TimelineStepCard } from '@/components/molecules/TimelineStepCard'
import { EducationCard } from '@/components/molecules/EducationCard'
import { mockEducation, mockExperience } from '@/stories/fixtures'

const meta = {
  title: 'Molecules/TimelineCards',
  parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const StepCard: Story = {
  render: () => (
    <div className="h-96 w-[22rem]">
      <TimelineScrollProvider>
        <TimelineStepCard entry={mockExperience[0]} locale="en" />
      </TimelineScrollProvider>
    </div>
  ),
}

export const Education: Story = {
  render: () => (
    <EducationCard education={mockEducation[0]} locale="en" />
  ),
}
