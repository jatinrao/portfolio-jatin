import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SkillCard } from '@/components/molecules/SkillCard'
import { mockSkills } from '@/stories/fixtures'

const meta = {
  title: 'Molecules/SkillCard',
  component: SkillCard,
  args: { skill: mockSkills[0], locale: 'en' },
} satisfies Meta<typeof SkillCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-40">
      <SkillCard {...args} />
    </div>
  ),
}
