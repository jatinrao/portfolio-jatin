'use client'

import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { STORAGE_KEY, useLanguage }                from '@/components/organisms/LanguageContext'
import { LANGUAGES, type LangId }     from '@/lib/locale'
import { useRouter } from 'next/navigation'

// ─── Icons (inline SVG — no extra dep) ───────────────────────────────────

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function ChevronIcon({ up }: { up: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: 'transform 0.2s ease', transform: up ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────

// Brand colours — keep in sync with your Tailwind config / CSS vars
const C = {
  cream:     '#f7f4ee',
  gold:      '#c9a84c',
  green:     '#2d5a3d',
  dark:      '#1a1a1a',
  muted:     '#6b6b5e',
  hoverBg:   '#eeeade',
} as const

export function LanguageSwitcher() {
  const { lang } = useLanguage()
  const [open, setOpen]   = useState(false)
  const ref               = useRef<HTMLDivElement>(null)
  const current           = LANGUAGES.find((l) => l.id === lang) ?? LANGUAGES[0]
  const router = useRouter();
  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  function handleSelect(id: LangId) {
    // localStorage.setItem(STORAGE_KEY, id);
    router.push(`/${id}`);
    setOpen(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, id: LangId) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(id) }
  }

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Language switcher"
      style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999 }}
    >
      {/* ── Dropdown panel ──────────────────────────────────────── */}
      <div
        role="listbox"
        aria-label="Select language"
        style={{
          position:      'absolute',
          bottom:        'calc(100% + 8px)',
          right:         0,
          width:         '180px',
          background:    C.cream,
          border:        `2px solid ${C.gold}`,
          borderRadius:  '10px',
          overflow:      'hidden',
          boxShadow:     '0 8px 32px rgba(0,0,0,0.14)',
          // Animated visibility
          opacity:       open ? 1 : 0,
          transform:     open ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
          transformOrigin: 'bottom right',
          pointerEvents: open ? 'auto' : 'none',
          transition:    'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        {/* Header label */}
        <div style={{
          padding:      '8px 14px 6px',
          fontSize:     '10px',
          fontWeight:   700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color:         C.muted,
          borderBottom:  `1px solid ${C.gold}44`,
        }}>
          Language
        </div>

        {/* Options */}
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
                display:        'flex',
                alignItems:     'center',
                gap:            '10px',
                width:          '100%',
                padding:        '9px 14px',
                background:     isActive ? C.green : 'transparent',
                color:          isActive ? C.cream  : C.dark,
                border:         'none',
                cursor:         'pointer',
                fontSize:       '14px',
                fontWeight:     isActive ? 600 : 400,
                textAlign:      'left',
                transition:     'background 0.12s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = C.hoverBg
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              {/* Language code chip */}
              <span style={{
                minWidth:      '26px',
                fontSize:      '10px',
                fontWeight:    700,
                letterSpacing: '0.04em',
                opacity:       0.65,
              }}>
                {l.code}
              </span>

              {/* Full name */}
              <span style={{ flex: 1 }}>{l.label}</span>

              {/* Active checkmark */}
              {isActive && (
                <span style={{ color: C.gold, flexShrink: 0 }}>
                  <CheckIcon />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Trigger button ───────────────────────────────────────── */}
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Current language: ${current.label}. Click to change.`}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display:       'flex',
          alignItems:    'center',
          gap:           '7px',
          padding:       '10px 16px',
          background:    C.green,
          color:         C.cream,
          border:        'none',
          borderBottom:  `3px solid ${C.gold}`,
          borderRadius:  '8px',
          cursor:        'pointer',
          fontSize:      '13px',
          fontWeight:    700,
          letterSpacing: '0.03em',
          boxShadow:     '0 4px 16px rgba(0,0,0,0.18)',
          userSelect:    'none',
          transition:    'transform 0.12s ease, box-shadow 0.12s ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform    = 'translateY(-1px)'
          ;(e.currentTarget as HTMLElement).style.boxShadow   = '0 6px 20px rgba(0,0,0,0.22)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.transform    = 'translateY(0)'
          ;(e.currentTarget as HTMLElement).style.boxShadow   = '0 4px 16px rgba(0,0,0,0.18)'
        }}
      >
        <GlobeIcon />
        <span>{current.code}</span>
        <ChevronIcon up={open} />
      </button>
    </div>
  )
}
