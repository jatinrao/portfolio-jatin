'use client'

import { useEffect, useId, useState } from 'react'
import { Icon } from '@web-portfolio/icons'
import type { SupportedLanguage } from '@/lib/resume/validation'

interface DownloadResumeButtonProps {
  slug: string
  /**
   * The language the *preview* is currently showing — `/resume` resolves
   * this from `?lang=`, not from live-site `LanguageContext`, so it's
   * passed down explicitly rather than read from context.
   */
  lang: SupportedLanguage
  label?: string
}

/**
 * Downloads the PDF in whatever language and appearance the visitor is
 * currently looking at, instead of always exporting the server's
 * light/`en` default. `lang` already reaches here as a prop (the page
 * resolves it from the query string once); `theme` is read from
 * `document.documentElement`'s `.dark` class — the same flag ThemeToggle
 * itself toggles — since that state lives only on the client.
 *
 * A `MutationObserver` on `class`, not a one-time read, because the
 * button and the toggle are two independent components: nothing else
 * re-renders this one when ThemeToggle flips the class, so without it
 * the href would go stale the moment a visitor switches themes without
 * reloading the page.
 *
 * Markup/classes here intentionally mirror GlassButton (components/atoms/
 * GlassButton.tsx) layer-for-layer rather than rendering one: GlassButton
 * hardcodes a `<button>` root, and this needs to be a real `<a download>`
 * so the browser's own download handling applies — no fetch/blob
 * plumbing, and mid-download the tab's native progress UI just works.
 */
export function DownloadResumeButton({ slug, lang, label }: DownloadResumeButtonProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const filterId = `glass-distortion-${useId().replace(/:/g, '')}`

  useEffect(() => {
    const root = document.documentElement
    const readTheme = () => (root.classList.contains('dark') ? 'dark' : 'light')
    setTheme(readTheme())

    const observer = new MutationObserver(() => setTheme(readTheme()))
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const params = new URLSearchParams({ slug, lang, theme })
  const href = `/api/resume/pdf?${params.toString()}`
  const filename = `${slug}-${lang}-${theme}-resume.pdf`

  return (
    <a
      href={href}
      download={filename}
      aria-label={label ?? `Download resume (${lang}, ${theme} mode)`}
      style={{ boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)' }}
      className="relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 font-medium text-sm text-heading-ink no-underline transition-[transform,box-shadow] duration-[var(--transition-fast)] ease-[var(--ease-standard)] hover:opacity-90 active:scale-[0.94]"
    >
      {/* Layer 1: refraction/blur, distorted through the SVG turbulence filter */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] [isolation:isolate]"
        style={{ backdropFilter: `blur(3px) url(#${filterId})`, WebkitBackdropFilter: 'blur(3px)' }}
      />

      {/* Layer 2: tint — 'clear' weight, matching ThemeToggle/LanguageSwitcher's own triggers */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit]"
        style={{ background: 'rgba(255, 255, 255, 0.12)' }}
      />

      {/* Layer 3: shine (inner highlight edges) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-[inherit]"
        style={{
          boxShadow:
            'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
        }}
      />

      <span className="relative z-[3] flex items-center justify-center gap-2">
        <Icon name="download" size={15} />
        Download
      </span>

      {/* Hidden SVG distortion filter powering Layer 1 */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden">
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves={1} seed={5} result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude={1} exponent={10} offset={0.5} />
            <feFuncG type="gamma" amplitude={0} exponent={1} offset={0} />
            <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5} />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap" />
          <feSpecularLighting in="softMap" surfaceScale={5} specularConstant={1} specularExponent={100} lightingColor="white" result="specLight">
            <fePointLight x={-200} y={-200} z={300} />
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} result="litImage" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale={150} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </a>
  )
}
