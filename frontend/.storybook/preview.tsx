import type { Preview } from '@storybook/nextjs-vite'
import { useLayoutEffect, type CSSProperties, type ReactNode } from 'react'
import '../app/globals.css'
import { LanguageProvider } from '../components/organisms/LanguageContext'

function ThemeSync({ theme, children }: { theme: string; children: ReactNode }) {
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  const style: CSSProperties = {
    minHeight: '100%',
    background: 'var(--color-surface)',
    color: 'var(--color-on-surface)',
  }
  return (
    <LanguageProvider lang="en">
      <div style={style}>{children}</div>
    </LanguageProvider>
  )
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => (
      <ThemeSync theme={String(context.globals.theme ?? 'light')}>
        <Story />
      </ThemeSync>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    a11y: {
      test: 'todo',
    },
  },
}

export default preview
