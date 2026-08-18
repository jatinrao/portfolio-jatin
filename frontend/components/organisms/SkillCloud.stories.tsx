import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SkillCloud } from '@/components/organisms/SkillCloud'
import { mockSkills } from '@/stories/fixtures'

const meta = {
  title: 'Sections/SkillCloud',
  component: SkillCloud,
  parameters: { layout: 'fullscreen' },
  args: {
    locale: 'en',
    description: 'Skills, revealed by scrolling',
    data: { skills: mockSkills, category_labels: {} },
  },
} satisfies Meta<typeof SkillCloud>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="h-[640px] bg-surface">
      <SkillCloud {...args} />
    </div>
  ),
}
