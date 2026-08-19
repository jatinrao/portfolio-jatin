'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { LiquidGlassRenderer, parseCssColor, type GlassSource } from '@/lib/liquid-glass'
import './liquid-glass.css'

export type LiquidGlassVariant = 'regular' | 'clear'
export type LiquidGlassEngine = 'webgl' | 'css' | 'auto'



export interface LiquidGlassProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  variant?: LiquidGlassVariant
  engine?: LiquidGlassEngine
  tint?: string
  source?: GlassSource | null
  /** When true, the root does not capture pointer events (overlay behind chrome). */
  inertSurface?: boolean
}

function readNumberToken(name: string, fallback: number) {
  if (typeof window === 'undefined') return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

function prefersReduced(query: string) {
  return typeof window !== 'undefined' && window.matchMedia(query).matches
}

function resolveEngine(engine: LiquidGlassEngine) {
  if (prefersReduced('(prefers-reduced-transparency: reduce)')) return 'css'
  if (typeof document !== 'undefined') {
    const enabled = getComputedStyle(document.documentElement).getPropertyValue('--glass-enabled').trim()
    if (enabled === '0') return 'css'
  }
  // 'css' (the SVG turbulence/displacement technique, same as GlassButton) is
  // the default for both 'auto' and 'css'. WebGL is opt-in only — it's a
  // different renderer with its own look, not an upgrade path for this effect.
  if (engine !== 'webgl') return 'css'
  const canWebgl = typeof document !== 'undefined' && !!document.createElement('canvas').getContext('webgl2')
  return canWebgl ? 'webgl' : 'css'
}

export function LiquidGlass({
  children,
  className = '',
  style,
  variant = 'regular',
  engine = 'auto',
  tint,
  source = null,
  inertSurface = false,
  ...rest
}: LiquidGlassProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<LiquidGlassRenderer | null>(null)
  const optsRef = useRef({ variant, tint, source })
  optsRef.current = { variant, tint, source }
  const [mode, setMode] = useState<'webgl' | 'css'>('css')

  // Unique id so multiple LiquidGlass instances on the same page don't
  // collide on the SVG distortion filter reference.
  const filterId = `glass-distortion-${useId().replace(/:/g, '')}`

  useEffect(() => {
    setMode(resolveEngine(engine))
  }, [engine])

  useEffect(() => {
    if (mode !== 'webgl') return
    const canvas = canvasRef.current
    if (!canvas) return
    let renderer: LiquidGlassRenderer
    try {
      renderer = new LiquidGlassRenderer(canvas)
    } catch {
      return
    }
    rendererRef.current = renderer

    const reduceMotion = prefersReduced('(prefers-reduced-motion: reduce)')
    let raf = 0
    let idleUntil = 0

    const paint = () => {
      raf = 0
      const current = optsRef.current
      renderer.resize()
      renderer.setSource(current.source)
      const tintColor = parseCssColor(current.tint || getComputedStyle(document.documentElement).getPropertyValue('--glass-fill-strong') || '#ffffff')
      renderer.render({
        refraction: readNumberToken('--glass-refraction', 0.04),
        tint: tintColor,
        tintAmount: current.tint ? 1 : 0.35,
        clear: current.variant === 'clear',
        reduceMotion,
      })
      if (renderer.isLive || performance.now() < idleUntil) {
        raf = requestAnimationFrame(paint)
      }
    }

    const wake = () => {
      idleUntil = performance.now() + 1000
      if (!raf) raf = requestAnimationFrame(paint)
    }

    const onPointer = (event: PointerEvent) => {
      const root = rootRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      renderer.setPointer((event.clientX - rect.left) / Math.max(rect.width, 1), 1 - (event.clientY - rect.top) / Math.max(rect.height, 1))
      wake()
    }

    const ro = new ResizeObserver(wake)
    if (rootRef.current) ro.observe(rootRef.current)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', wake, { passive: true })
    wake()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', wake)
      renderer.destroy()
      rendererRef.current = null
    }
  }, [mode])

  useEffect(() => {
    rendererRef.current?.setSource(source)
  }, [source])

  const enabledOff =
    typeof document !== 'undefined' &&
    getComputedStyle(document.documentElement).getPropertyValue('--glass-enabled').trim() === '0'

  // Only run the turbulence/displacement filter when the CSS fallback is
  // actually the active renderer and glass hasn't been switched off — the
  // WebGL path already does its own refraction.
  const showCssDistortion = mode === 'css' && !enabledOff

  // Same default-tint logic as GlassButton: 'clear' reads lighter than 'regular'.
  const tintColor = tint ?? (variant === 'clear' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.25)')

  return (
    <div
      ref={rootRef}
      data-glass-variant={variant}
      data-glass-engine={mode}
      {...rest}
      aria-hidden={inertSurface ? true : rest['aria-hidden']}
      className={`relative isolate overflow-hidden transition-shadow duration-[var(--transition-fast)] ease-[var(--ease-standard)] ${enabledOff ? 'opacity-60 saturate-50' : ''} ${className}`}
      style={{
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
    >
      {/* Layer 0: refraction — SVG-distorted blur (css mode) or WebGL canvas */}
      {mode === 'webgl' ? (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-[inherit]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] [isolation:isolate]"
          style={
            showCssDistortion
              ? { backdropFilter: `blur(3px) url(#${filterId})`, WebkitBackdropFilter: 'blur(3px)' }
              : undefined
          }
        />
      )}

      {/* Layer 1: tint */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit]"
        style={{ backgroundColor: tintColor }}
      />

      {/* Layer 2: shine (inner highlight edges) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-[inherit]"
        style={{
          boxShadow:
            'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
        }}
      />

      {children ? <div className="relative z-[3]">{children}</div> : null}

      {/* Hidden SVG distortion filter powering Layer 0 */}
      {showCssDistortion ? (
        <svg
          aria-hidden
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
        >
          <filter
            id={filterId}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves={1}
              seed={5}
              result="turbulence"
            />
            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude={1} exponent={10} offset={0.5} />
              <feFuncG type="gamma" amplitude={0} exponent={1} offset={0} />
              <feFuncB type="gamma" amplitude={0} exponent={1} offset={0.5} />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation={3} result="softMap" />
            <feSpecularLighting
              in="softMap"
              surfaceScale={5}
              specularConstant={1}
              specularExponent={100}
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x={-200} y={-200} z={300} />
            </feSpecularLighting>
            <feComposite
              in="specLight"
              operator="arithmetic"
              k1={0}
              k2={1}
              k3={1}
              k4={0}
              result="litImage"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softMap"
              scale={150}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      ) : null}
    </div>
  )
}