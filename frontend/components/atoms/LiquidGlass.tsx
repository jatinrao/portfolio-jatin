'use client'

import {
  useEffect,
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
  if (engine === 'css') return 'css'
  const canWebgl = typeof document !== 'undefined' && !!document.createElement('canvas').getContext('webgl2')
  if (engine === 'webgl') return canWebgl ? 'webgl' : 'css'
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

  const classes = [
    'liquid-glass-root',
    variant === 'clear' ? 'liquid-glass-root--clear' : 'liquid-glass-root--regular',
    mode === 'webgl' ? 'liquid-glass-root--webgl' : 'liquid-glass-root--css',
    enabledOff ? 'liquid-glass-root--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={rootRef}
      className={classes}
      style={style}
      data-glass-variant={variant}
      data-glass-engine={mode}
      {...rest}
      aria-hidden={inertSurface ? true : rest['aria-hidden']}
    >
      <span className="liquid-glass-shadow" aria-hidden="true" />
      <span className="liquid-glass-illumination" aria-hidden="true">
        <span className="liquid-glass-frost" />
        {mode === 'webgl' ? <canvas ref={canvasRef} className="liquid-glass-webgl" /> : null}
      </span>
      <span className="liquid-glass-highlight" aria-hidden="true" />
      {children ? <div className="liquid-glass-content">{children}</div> : null}
    </div>
  )
}
