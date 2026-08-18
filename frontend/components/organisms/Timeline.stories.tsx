import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Timeline } from '@/components/organisms/Timeline'
import { mockEducation, mockExperience } from '@/stories/fixtures'

const meta = {
  title: 'Sections/Timeline',
  component: Timeline,
  parameters: { layout: 'fullscreen' },
  args: {
    locale: 'en',
    data: { experience: mockExperience, education: mockEducation as never },
  },
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="h-[640px] bg-surface">
      <Timeline {...args} />
    </div>
  ),
}
