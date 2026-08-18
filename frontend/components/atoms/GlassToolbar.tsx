'use client'

import type { ReactNode } from 'react'
import { LiquidGlass, type LiquidGlassVariant } from '@/components/atoms/LiquidGlass'

interface GlassToolbarProps {
  children: ReactNode
  className?: string
  variant?: LiquidGlassVariant
  /** Accessible name for the control cluster (HIG: toolbar). */
  label?: string
}

/**
 * One Liquid Glass surface for a group of controls — Apple HIG toolbar:
 * items sit on a single floating material, not each on their own glass.
 */
export function GlassToolbar({
  children,
  className = '',
  variant = 'regular',
  label = 'Toolbar',
}: GlassToolbarProps) {
  return (
    <div className={`relative ${className}`}>
      <LiquidGlass
        variant={variant}
        inertSurface
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
      />
      <div
        role="toolbar"
        aria-label={label}
        className="relative z-[1] flex items-center gap-0.5 p-1"
      >
        {children}
      </div>
    </div>
  )
}
