import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NavButton } from '@/components/atoms/nav-button'

const meta = {
  title: 'Atoms/NavButton',
  component: NavButton,
  args: {
    direction: 'prev',
    label: 'Previous',
    children: '←',
    onClick: () => undefined,
  },
} satisfies Meta<typeof NavButton>

export default meta
type Story = StoryObj<typeof meta>

export const Previous: Story = {
  render: (args) => (
    <div
      className="flex gap-4 p-10"
      style={{ background: 'linear-gradient(120deg, #34c759, #5e5ce6)' }}
    >
      <NavButton {...args} />
      <NavButton direction="next" label="Next" onClick={() => undefined}>
        →
      </NavButton>
    </div>
  ),
}
