'use client'

import dynamic from 'next/dynamic'
import { LanguageSwitcher } from '@/components/organisms/LanguageSwitcher'
import { ThemeToggle } from '@/components/organisms/ThemeToggle'
import { GlassToolbar } from '@/components/atoms/GlassToolbar'

// Dev-only, and not needed in the server bundle — dynamic import keeps it
// out of the production client bundle entirely rather than just hiding it
// behind the NODE_ENV check at render time.
const DesignTokenEditor = dynamic(() => import('@/components/dev/DesignTokenEditor'), { ssr: false })

/**
 * Single fixed-position anchor for every floating bottom-right control.
 * Previously each control (language switcher, dev token editor) carried
 * its own `position: fixed` + z-index, so their spacing/stacking was
 * coincidental rather than a real layout. This is the one place that owns
 * the group's position — each child is a plain relatively-positioned
 * trigger (+ its own absolutely-anchored dropdown/panel where it has one).
 */
export function FloatingControls() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <GlassToolbar label="Site controls" className="rounded-full">
        <ThemeToggle />
        <LanguageSwitcher />
        {process.env.NODE_ENV === 'development' && <DesignTokenEditor />}
      </GlassToolbar>
    </div>
  )
}
