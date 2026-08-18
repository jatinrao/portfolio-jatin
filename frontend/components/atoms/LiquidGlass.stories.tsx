import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect, useState, type ComponentProps } from 'react'
import { LiquidGlass } from '@/components/atoms/LiquidGlass'
import type { GlassSource } from '@/lib/liquid-glass'

const meta = {
  title: 'HIG/Liquid Glass',
  component: LiquidGlass,
  parameters: { layout: 'fullscreen' },
  args: {
    variant: 'regular',
    engine: 'auto',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['regular', 'clear'] },
    engine: { control: 'inline-radio', options: ['auto', 'webgl', 'css'] },
    tint: { control: 'color' },
  },
} satisfies Meta<typeof LiquidGlass>

export default meta
type Story = StoryObj<typeof meta>

function Playground(props: ComponentProps<typeof LiquidGlass>) {
  const [source, setSource] = useState<GlassSource | null>(null)

  useEffect(() => {
    const img = new Image()
    img.src = '/hero/gift.png'
    img.onload = () => setSource(img)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 48,
        background:
          'radial-gradient(circle at 20% 20%, #5e5ce6, transparent 40%), radial-gradient(circle at 80% 0%, #ff375f, transparent 35%), linear-gradient(160deg, #34c759, #1c63a0)',
      }}
    >
      <LiquidGlass {...props} source={source} className="mx-auto max-w-lg rounded-[28px]">
        <div className="p-8">
          <p className="font-label-caps text-label-caps uppercase text-muted-body">Navigation layer</p>
          <h2 className="mt-2 font-headline-md text-headline-md text-heading-ink">Liquid Glass</h2>
          <p className="mt-3 font-body-md text-body-md text-heading-ink">
            Highlight, shadow, and illumination layers. WebGL lensing when available; CSS frost otherwise.
          </p>
        </div>
      </LiquidGlass>
    </div>
  )
}

export const Regular: Story = {
  render: (args) => <Playground {...args} />,
}

export const Clear: Story = {
  args: { variant: 'clear' },
  render: (args) => <Playground {...args} />,
}

export const Tinted: Story = {
  args: { tint: '#1c63a0' },
  render: (args) => <Playground {...args} />,
}

export const CssOnly: Story = {
  args: { engine: 'css' },
  render: (args) => <Playground {...args} />,
}
