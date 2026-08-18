import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { GlassToolbar } from '@/components/atoms/GlassToolbar'
import { ThemeToggle } from '@/components/organisms/ThemeToggle'
import { LanguageSwitcher } from '@/components/organisms/LanguageSwitcher'

const meta = {
  title: 'HIG/Toolbar',
  component: GlassToolbar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof GlassToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const FloatingCluster: Story = {
  args: {
    label: 'Site controls',
    className: 'rounded-full',
    children: (
      <>
        <ThemeToggle />
        <LanguageSwitcher />
      </>
    ),
  },
  render: (args) => (
    <div
      className="relative min-h-80"
      style={{ background: 'linear-gradient(160deg, #34c759, #5e5ce6, #ff375f)' }}
    >
      <div className="absolute bottom-6 right-6">
        <GlassToolbar {...args} />
      </div>
    </div>
  ),
}
