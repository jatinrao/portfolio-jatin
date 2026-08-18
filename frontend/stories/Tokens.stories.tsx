import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TOKEN_GROUPS } from '@/lib/design-tokens'

const meta = {
  title: 'Foundations/Tokens',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Palette: Story = {
  render: () => (
    <div className="grid gap-8 p-8">
      {TOKEN_GROUPS.filter((g) => ['primary', 'secondary', 'surface', 'glass'].includes(g.id)).map((group) => (
        <section key={group.id}>
          <h2 className="mb-3 font-label-caps text-label-caps uppercase text-muted-body">{group.label}</h2>
          <div className="flex flex-wrap gap-3">
            {group.tokens
              .filter((t) => t.type === 'color')
              .map((t) => (
                <div key={t.var} className="w-36">
                  <div
                    className="h-16 rounded-[var(--radius-control)] border border-outline"
                    style={{ background: `var(${t.var})` }}
                  />
                  <p className="mt-1 font-label-caps text-label-sm text-heading-ink">{t.label}</p>
                  <p className="font-mono text-[10px] text-muted-body">{t.var}</p>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  ),
}
