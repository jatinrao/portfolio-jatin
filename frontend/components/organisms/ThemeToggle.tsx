'use client'

import { useEffect, useState } from 'react'
import {
  floatingIconTriggerStyle,
  handleFloatingHoverEnter,
  handleFloatingHoverLeave,
} from '@/lib/floating-controls-style'

const STORAGE_KEY = 'theme'

// @web-portfolio/icons' bundled set (devicon + Material Symbols + Simple
// Icons) has no sun/moon/brightness glyph — the one icon in this control
// family that isn't sourced from the library, kept minimal and matching
// the same stroke language as the rest of the site's inline icons.
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  )
}

/**
 * Floating light/dark toggle — same trigger treatment as LanguageSwitcher
 * and the dev design-token editor (see lib/floating-controls-style.ts),
 * rendered together in FloatingControls. Persists choice to localStorage;
 * falls back to the OS preference on first visit.
 */
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = stored ? stored === 'dark' : prefersDark
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
    setMounted(true)
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
  }

  // Avoid a flash of the wrong icon before the stored/OS preference is read.
  if (!mounted) return null

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      onClick={toggle}
      style={floatingIconTriggerStyle}
      onMouseEnter={handleFloatingHoverEnter}
      onMouseLeave={handleFloatingHoverLeave}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
