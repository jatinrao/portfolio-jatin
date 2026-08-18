import type { CSSProperties, MouseEvent } from 'react'

/** HIG: controls need a hit region of at least 44×44 pt. */
export const FLOATING_BUTTON_SIZE = 44
export const FLOATING_CONTROLS_GAP = 8

/** Toolbar *items* on a shared Liquid Glass surface — no fill of their own (no glass-on-glass). */
export const floatingTriggerBaseStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  height: FLOATING_BUTTON_SIZE,
  minWidth: FLOATING_BUTTON_SIZE,
  padding: '0 14px',
  background: 'transparent',
  color: 'var(--color-heading-ink)',
  border: 'none',
  borderRadius: 999,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.02em',
  boxShadow: 'none',
  userSelect: 'none',
  transition: 'transform 0.12s ease, background 0.12s ease',
}

export const floatingIconTriggerStyle: CSSProperties = {
  ...floatingTriggerBaseStyle,
  width: FLOATING_BUTTON_SIZE,
  padding: 0,
  fontSize: 18,
}

export function handleFloatingHoverEnter(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.background = 'color-mix(in srgb, var(--color-heading-ink) 8%, transparent)'
}

export function handleFloatingHoverLeave(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.background = 'transparent'
}

/** Menus/popovers: regular Liquid Glass, thicker than toolbar chips (HIG). */
export const floatingPanelBaseStyle: CSSProperties = {
  border: '0.5px solid var(--glass-hairline)',
  borderRadius: 22,
  boxShadow: 'var(--glass-shadow)',
  overflow: 'hidden',
}
