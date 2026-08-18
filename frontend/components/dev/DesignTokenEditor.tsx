'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { TOKEN_GROUPS, ALL_TOKENS, defaultValues, type TokenValues } from '@/lib/design-tokens'
import {
  floatingIconTriggerStyle,
  floatingPanelBaseStyle,
  handleFloatingHoverEnter,
  handleFloatingHoverLeave,
} from '@/lib/floating-controls-style'

type Mode = 'light' | 'dark'
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
type ImportStatus = 'idle' | 'imported' | 'error'

/**
 * Dev-only design token editor. Lets you tweak the site's CSS custom
 * properties (colors + hover/transition timing) live in the browser, then
 * "Save" writes the current values back into app/globals.css as the new
 * checked-in defaults via /api/dev/design-tokens (also dev-gated).
 *
 * The toggle button shares its trigger style with every other floating
 * control (see lib/floating-controls-style.ts and FloatingControls) rather
 * than a fixed neutral color, since it's meant to read as part of the same
 * component family, not a separate devtool chrome. Positioning is owned by
 * FloatingControls, not this component.
 *
 * Never rendered in production — see the NODE_ENV check both here and at
 * the call site in components/shared/FloatingControls.tsx.
 */
export default function DesignTokenEditor() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('light')
  const [values, setValues] = useState<{ light: TokenValues; dark: TokenValues }>(() => ({
    light: defaultValues('light'),
    dark: defaultValues('dark'),
  }))
  const [dirty, setDirty] = useState<{ light: Set<string>; dark: Set<string> }>({
    light: new Set(),
    dark: new Set(),
  })
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle')
  // Gates the DOM-writing effect below — see its comment for why this
  // can't just run unconditionally from mount.
  const [hasInteracted, setHasInteracted] = useState(false)
  const wasDarkOnMount = useRef<boolean | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Live preview: push current mode's values onto <html> as inline style
  // overrides (inline style always wins over the .dark class rule for the
  // same property), and flip the real dark-mode class so you're previewing
  // the actual theme, not a simulated one.
  //
  // Gated on `hasInteracted` (set true when the panel is first opened):
  // this used to run unconditionally from mount, which meant every page
  // load force-applied this component's *own* copy of every tracked
  // token's default value via inline style — permanently overriding
  // whatever the real ThemeToggle (or globals.css itself) said, before the
  // user ever touched this tool. Now it stays fully inert until you
  // actually open the panel.
  useEffect(() => {
    if (!hasInteracted) return
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
    for (const t of ALL_TOKENS) {
      root.style.setProperty(t.var, values[mode][t.var])
    }
  }, [mode, values, hasInteracted])

  if (process.env.NODE_ENV !== 'development') return null

  function setToken(v: string, value: string) {
    setValues((prev) => ({ ...prev, [mode]: { ...prev[mode], [v]: value } }))
    setDirty((prev) => {
      const next = new Set(prev[mode])
      next.add(v)
      return { ...prev, [mode]: next }
    })
    setStatus('idle')
  }

  // Sync `mode` to whatever theme is actually active (set by the real
  // ThemeToggle / localStorage) at the moment the panel is opened — not at
  // component mount, since this component is mounted from page load and
  // the real theme may well have changed by the time the panel is first
  // opened. Only runs the first time; after that the user's own Light/Dark
  // tab clicks are what drive `mode`.
  function handleOpen() {
    if (!hasInteracted) {
      const isDark = document.documentElement.classList.contains('dark')
      wasDarkOnMount.current = isDark
      setMode(isDark ? 'dark' : 'light')
      setHasInteracted(true)
    }
    setOpen(true)
  }

  function handleReset() {
    const fresh = { light: defaultValues('light'), dark: defaultValues('dark') }
    setValues(fresh)
    setDirty({ light: new Set(), dark: new Set() })
    const root = document.documentElement
    for (const t of ALL_TOKENS) root.style.removeProperty(t.var)
    root.classList.toggle('dark', wasDarkOnMount.current ?? false)
    setStatus('idle')
  }

  async function handleSave() {
    setStatus('saving')
    const payload: { light?: TokenValues; dark?: TokenValues } = {}
    if (dirty.light.size) {
      payload.light = Object.fromEntries([...dirty.light].map((v) => [v, values.light[v]]))
    }
    if (dirty.dark.size) {
      payload.dark = Object.fromEntries([...dirty.dark].map((v) => [v, values.dark[v]]))
    }
    try {
      const res = await fetch('/api/dev/design-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      setDirty({ light: new Set(), dark: new Set() })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
    }
  }

  function handleExport() {
    const payload = { light: values.light, dark: values.dark }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'design-tokens.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow importing the same filename again later
    if (!file) return

    const knownVars = new Set(ALL_TOKENS.map((t) => t.var))
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { light?: Record<string, unknown>; dark?: Record<string, unknown> }
        const importedLight: TokenValues = {}
        const importedDark: TokenValues = {}
        for (const [k, v] of Object.entries(parsed.light ?? {})) {
          if (knownVars.has(k) && typeof v === 'string') importedLight[k] = v
        }
        for (const [k, v] of Object.entries(parsed.dark ?? {})) {
          if (knownVars.has(k) && typeof v === 'string') importedDark[k] = v
        }
        if (Object.keys(importedLight).length === 0 && Object.keys(importedDark).length === 0) {
          throw new Error('No recognized tokens in file')
        }
        setValues((prev) => ({
          light: { ...prev.light, ...importedLight },
          dark: { ...prev.dark, ...importedDark },
        }))
        setDirty((prev) => ({
          light: new Set([...prev.light, ...Object.keys(importedLight)]),
          dark: new Set([...prev.dark, ...Object.keys(importedDark)]),
        }))
        setImportStatus('imported')
      } catch {
        setImportStatus('error')
      } finally {
        setTimeout(() => setImportStatus('idle'), 2500)
      }
    }
    reader.readAsText(file)
  }

  const totalDirty = dirty.light.size + dirty.dark.size

  return (
    <div style={{ position: 'relative' }}>
      {!open && (
        <button
          onClick={handleOpen}
          aria-label="Open design token editor"
          style={floatingIconTriggerStyle}
          onMouseEnter={handleFloatingHoverEnter}
          onMouseLeave={handleFloatingHoverLeave}
        >
          🎨
        </button>
      )}

      {open && (
        <div
          style={{
            ...floatingPanelBaseStyle,
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            right: 0,
            width: 320, maxHeight: '80vh', overflowY: 'auto', background: '#18181b', color: '#f4f4f5',
            fontSize: 13,
          }}
        >
          <div style={{ position: 'sticky', top: 0, background: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #27272a' }}>
            <strong style={{ fontSize: 13 }}>Design tokens <span style={{ opacity: 0.5, fontWeight: 400 }}>· dev only</span></strong>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>

          <div style={{ display: 'flex', gap: 6, padding: '10px 12px 0' }}>
            {(['light', 'dark'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: '6px 0', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                  border: '1px solid #3f3f46',
                  background: mode === m ? 'var(--color-primary)' : 'transparent',
                  color: mode === m ? 'var(--color-on-primary)' : '#a1a1aa',
                }}
              >
                {m === 'light' ? '☀ Light' : '● Dark'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6, padding: '10px 12px 0' }}>
            <button
              onClick={handleExport}
              style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #3f3f46', background: 'transparent', color: '#d4d4d8', cursor: 'pointer', fontSize: 12 }}
            >
              ⬇ Export JSON
            </button>
            <button
              onClick={handleImportClick}
              style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid #3f3f46', background: 'transparent', color: '#d4d4d8', cursor: 'pointer', fontSize: 12 }}
            >
              ⬆ Import JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </div>
          {importStatus !== 'idle' && (
            <div style={{ padding: '4px 12px 0', fontSize: 11, color: importStatus === 'imported' ? '#7ee787' : '#f28b82' }}>
              {importStatus === 'imported' ? 'Imported ✓ — review changes below, then Save as default.' : 'Import failed — not a valid design-tokens.json file.'}
            </div>
          )}

          <div style={{ padding: '10px 12px' }}>
            {TOKEN_GROUPS.map((group) => (
              <div key={group.id} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.5, marginBottom: 6 }}>
                  {group.label}
                </div>
                {group.tokens
                  .filter((t) => mode === 'light' || t.dark !== undefined || t.type === 'duration' || t.type === 'toggle')
                  .map((t) => {
                    const val = values[mode][t.var]
                    const isDirty = dirty[mode].has(t.var)
                    const isHexColor = t.type === 'color' && /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(val)
                    const glassOn = t.type === 'toggle' && val !== '0'
                    return (
                      <div key={t.var} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        {isHexColor ? (
                          <input
                            type="color"
                            value={val}
                            onChange={(e) => setToken(t.var, e.target.value)}
                            style={{ width: 26, height: 26, padding: 0, border: '1px solid #3f3f46', borderRadius: 4, background: 'none', cursor: 'pointer' }}
                          />
                        ) : t.type === 'toggle' ? (
                          <input
                            type="checkbox"
                            checked={glassOn}
                            onChange={(e) => setToken(t.var, e.target.checked ? '1' : '0')}
                            aria-label={t.label}
                            style={{ width: 16, height: 16, cursor: 'pointer' }}
                          />
                        ) : (
                          <span style={{ width: 26, textAlign: 'center', opacity: 0.5 }}>
                            {t.type === 'duration' ? '⏱' : t.type === 'spacing' ? '↔' : '🔤'}
                          </span>
                        )}
                        <span style={{ flex: 1, color: isDirty ? '#fff' : '#d4d4d8' }}>
                          {t.label}
                          {isDirty && <span style={{ color: '#f0b429' }}> ●</span>}
                        </span>
                        {t.type === 'toggle' ? (
                          <span style={{ fontSize: 11, color: glassOn ? '#7ee787' : '#a1a1aa', width: 60, textAlign: 'right' }}>
                            {glassOn ? 'On' : 'Off'}
                          </span>
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => setToken(t.var, e.target.value)}
                            style={{
                              width: t.type === 'color' ? 76 : 60, background: '#27272a', color: '#f4f4f5',
                              border: '1px solid #3f3f46', borderRadius: 4, padding: '3px 6px', fontSize: 12,
                            }}
                          />
                        )}
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>

          <div style={{ position: 'sticky', bottom: 0, background: '#18181b', borderTop: '1px solid #27272a', padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={handleReset}
              style={{ padding: '7px 10px', borderRadius: 6, border: '1px solid #3f3f46', background: 'transparent', color: '#d4d4d8', cursor: 'pointer', fontSize: 12 }}
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={totalDirty === 0 || status === 'saving'}
              style={{
                flex: 1, padding: '7px 10px', borderRadius: 6, border: 'none', cursor: totalDirty === 0 ? 'default' : 'pointer',
                background: totalDirty === 0 ? '#3f3f46' : 'var(--color-primary)',
                color: totalDirty === 0 ? '#d4d4d8' : 'var(--color-on-primary)',
                fontSize: 12, fontWeight: 600,
                opacity: status === 'saving' ? 0.6 : 1,
              }}
            >
              {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : status === 'error' ? 'Failed — retry' : totalDirty > 0 ? `Save as default (${totalDirty})` : 'Save as default'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
