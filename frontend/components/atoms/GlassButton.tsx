'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LiquidGlass, type LiquidGlassVariant } from '@/components/atoms/LiquidGlass'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: LiquidGlassVariant
  tint?: string
}

/** HIG `.glass` control — capsule, 44pt minimum, solid children only. */
export function GlassButton({
  children,
  variant = 'regular',
  tint,
  className = '',
  type = 'button',
  ...rest
}: GlassButtonProps) {
  return (
    <button
      type={type}
      className={`relative inline-flex min-h-11 min-w-11 items-center justify-center overflow-hidden rounded-full px-5 py-2.5 font-medium text-sm text-heading-ink transition-transform duration-[var(--transition-fast)] ease-[var(--ease-standard)] hover:opacity-90 active:scale-[0.94] ${className}`}
      {...rest}
    >
      <LiquidGlass
        variant={variant}
        tint={tint}
        inertSurface
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
      />
      <span className="relative z-[1]">{children}</span>
    </button>
  )
}
