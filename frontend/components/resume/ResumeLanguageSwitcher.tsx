'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@web-portfolio/icons'
import { LANGUAGES, type LangId } from '@/lib/locale'
import { LiquidGlass } from '@/components/atoms/LiquidGlass'
import { GlassButton } from '@/components/atoms/GlassButton'
import {
  floatingTriggerBaseStyle,
  floatingPanelBaseStyle,
  handleFloatingHoverEnter,
  handleFloatingHoverLeave,
} from '@/lib/floating-controls-style'

const C = {
  onPrimary: 'var(--color-on-primary)',
  gold: 'var(--color-secondary-fixed)',
  green: 'var(--color-primary)',
  dark: 'var(--color-heading-ink)',
  muted: 'var(--color-on-surface-variant)',
  hoverBg: 'var(--color-surface-container)',
} as const

interface ResumeLanguageSwitcherProps {
  slug: string
  lang: LangId
}

/**
 * `/resume`'s own language control — not the site's `<LanguageSwitcher>`,
 * because that one navigates to `/${locale}` (a live-site route driven by
 * `LanguageContext`/cookie). This page resolves its language from
 * `?lang=` instead (see app/resume/page.tsx's `resolveLang`), so
 * switching has to rewrite that query param on `/resume` itself rather
 * than leaving the page. Same trigger/panel chrome as the site's
 * switcher, trimmed to this page's own selection logic.
 */
export function ResumeLanguageSwitcher({ slug, lang }: ResumeLanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const current = LANGUAGES.find((l) => l.id === lang) ?? LANGUAGES[0]

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  function handleSelect(id: LangId) {
    const params = new URLSearchParams({ slug, lang: id })
    router.push(`/resume?${params.toString()}`)
    setOpen(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, id: LangId) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(id)
    }
  }

  return (
    <div ref={ref} role="region" aria-label="Resume language switcher" style={{ position: 'relative' }}>
      <LiquidGlass
        role="listbox"
        aria-label="Select resume language"
        variant="clear"
        tint="0.35"
        style={{
          ...floatingPanelBaseStyle,
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          right: 0,
          width: '180px',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
          transformOrigin: 'bottom right',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        <div
          style={{
            padding: '8px 14px 6px',
            fontSize: 'var(--text-label-sm)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: C.muted,
            borderBottom: `1px solid ${C.gold}44`,
          }}
        >
          Language
        </div>

        {LANGUAGES.map((l) => {
          const isActive = l.id === lang
          return (
            <button
              key={l.id}
              role="option"
              aria-selected={isActive}
              onClick={() => handleSelect(l.id as LangId)}
              onKeyDown={(e) => handleKeyDown(e, l.id as LangId)}
              tabIndex={open ? 0 : -1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '9px 14px',
                background: isActive ? C.green : 'transparent',
                color: isActive ? C.onPrimary : C.dark,
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                textAlign: 'left',
                transition: 'background 0.12s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = C.hoverBg
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              <span style={{ minWidth: '26px', fontSize: 'var(--text-label-sm)', fontWeight: 700, letterSpacing: '0.04em', opacity: 0.65 }}>
                {l.code}
              </span>
              <span style={{ flex: 1 }}>{l.label}</span>
              {isActive && (
                <span style={{ color: C.gold, flexShrink: 0, display: 'flex' }}>
                  <Icon name="check" size={13} />
                </span>
              )}
            </button>
          )
        })}
      </LiquidGlass>

      <GlassButton
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Resume language: ${current.label}. Click to change.`}
        onClick={() => setOpen((prev) => !prev)}
        style={floatingTriggerBaseStyle}
        onMouseEnter={handleFloatingHoverEnter}
        onMouseLeave={handleFloatingHoverLeave}
        variant="clear"
        tint="0.35"
        className="flex items-center justify-center gap-2"
      >
        <Icon name="language" size={15} />
        <span>{current.code}</span>
        <Icon
          name="chevron_right"
          size={11}
          style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(-90deg)' : 'rotate(90deg)' }}
        />
      </GlassButton>
    </div>
  )
}
