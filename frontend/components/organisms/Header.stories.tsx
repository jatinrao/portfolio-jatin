import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Header } from '@/components/organisms/Header'
import { mockHeader } from '@/stories/fixtures'

const meta = {
  title: 'HIG/Navigation Bar',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: { locale: 'en', data: mockHeader },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div
      className="min-h-64"
      style={{ background: 'linear-gradient(180deg, #5e5ce6, #1c1c1e)' }}
    >
      <Header {...args} />
    </div>
  ),
}
