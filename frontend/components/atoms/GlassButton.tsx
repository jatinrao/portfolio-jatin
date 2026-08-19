'use client'

import { useId } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LiquidGlass, type LiquidGlassVariant } from '@/components/atoms/LiquidGlass'

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: LiquidGlassVariant
  tint?: string
  /** The inset-shadow rim (Layer 3 below) reads as a visible circular border on rounded-full buttons — set false to drop it. Defaults true to match every existing usage. */
  rimHighlight?: boolean
}


export function GlassButton({
  children,
  variant = 'regular',
  tint,
  className = '',
  type = 'button',
  rimHighlight = true,
  ...rest
}: GlassButtonProps) {
  // Unique id so multiple buttons on the same page don't collide on the SVG filter reference.
  const filterId = `glass-distortion-${useId().replace(/:/g, '')}`

  // 'clear' reads as a lighter/more transparent tint than the default 'regular' glass.
  const tintColor =
    tint ?? (variant === 'clear' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.25)')

  return (
    <button
      type={type}
      style={{
        boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)',
      }}
      className={`relative inline-flex min-h-11 min-w-11 items-center justify-center overflow-hidden rounded-full px-5 py-2.5 font-medium text-sm text-heading-ink transition-[transform,box-shadow] duration-[var(--transition-fast)] ease-[var(--ease-standard)] hover:opacity-90 active:scale-[0.94] ${className}`}
      {...rest}
    >
      {/* Layer 1: refraction/blur, distorted through the SVG turbulence filter */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit] [isolation:isolate]"
        style={{
          backdropFilter: `blur(3px) url(#${filterId})`,
          WebkitBackdropFilter: 'blur(3px)',
        }}
      />

      {/* Layer 2: tint */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit]"
        style={{ background: tintColor }}
      />

      {/* Layer 3: shine (inner highlight edges) */}
      {rimHighlight && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-[inherit]"
          style={{
            boxShadow:
              'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
          }}
        />
      )}

      <span className="relative z-[3] flex gap-2 justify-evenly align-center">{children}</span>

      {/* Hidden SVG distortion filter powering the refraction in Layer 1 */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden">
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
    </button>
  )
}
