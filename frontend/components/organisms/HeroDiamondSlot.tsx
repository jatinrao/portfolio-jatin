'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { MotionValue } from 'framer-motion'
import { PHONE_REVEAL_START } from '@/hooks/use-hero-scale'

const HeroDiamond = dynamic(() => import('./HeroDiamond'), { ssr: false })

/** Matches hero.css's `@media (max-width: 734px) { .hero-phone-slot { display: none } }`. */
const HIDDEN_BELOW = '(max-width: 734px)'

interface HeroDiamondSlotProps {
  phone: MotionValue<number>
  z: MotionValue<number>
}

function isHiddenViewport() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia(HIDDEN_BELOW).matches
}

/** `typeof window === 'undefined'` guards SSR — this is only ever called client-side in practice (the lazy `useState` initializer and the effect both run post-hydration), but keeps the check honest about what it depends on. */
function canMount(z: MotionValue<number>) {
  if (typeof window === 'undefined') return false
  return z.get() > PHONE_REVEAL_START && !isHiddenViewport()
}

/**
 * Keeps the three.js/R3F scene (and its GLTF + HDR fetches) out of the
 * initial page load entirely: `next/dynamic({ ssr: false })` keeps it out of
 * the server-rendered HTML and the first-paint JS chunk, and this only
 * mounts that dynamic component once `z` (the hero's own zoom-progress
 * spring) crosses `PHONE_REVEAL_START` — the same point `--hero-phone`'s
 * slide-in transform starts moving — and only on viewports wide enough to
 * show it at all (mirrors hero.css's `display: none` below 734px) and
 * without `prefers-reduced-motion: reduce`.
 *
 * `canMount()` backs both the initial `useState` value and the mount
 * decision inside the `z` subscription, and `isHiddenViewport()` is
 * re-checked at the moment `z` actually crosses the threshold (not just
 * once when the effect first subscribes) — otherwise a visitor who resizes
 * from desktop to mobile *before* scrolling into the reveal window would
 * still mount the scene once they scrolled, since the original subscription
 * was set up back when the viewport was wide enough.
 *
 * Two things were tried and ruled out first for the scroll-progress gate:
 * - An IntersectionObserver on the slot's DOM node: this layout's hero is
 *   pinned/sticky for its entire scroll-zoom sequence, so the slot's
 *   *geometry* sits inside (or within any reasonable rootMargin of) the
 *   viewport from the very first frame — only its CSS transform marks it
 *   "off-screen", which IntersectionObserver doesn't account for. Fired
 *   immediately on page load instead of deferring.
 * - Subscribing to `phone.on('change', ...)` directly, or reading
 *   `phone.get()` inside `z`'s `'change'` callback: `phone` is a
 *   `useTransform(z, ...)`-derived value, and framer-motion's internal
 *   listener that recomputes it is just another subscriber on `z` — if it
 *   happens to run after this component's own `z` listener in the same
 *   synchronous dispatch, `phone.get()` reads its *previous* value at that
 *   point. Comparing `z.get()` against the same threshold `phone`'s own
 *   `useTransform` range starts from sidesteps that ordering entirely, since
 *   `z` is the source value being read inside its own change event.
 */
export function HeroDiamondSlot({ phone, z }: HeroDiamondSlotProps) {
  const [shouldMount, setShouldMount] = useState(() => canMount(z))

  useEffect(() => {
    if (shouldMount) return

    const unsubscribe = z.on('change', (value) => {
      if (value > PHONE_REVEAL_START && !isHiddenViewport()) {
        setShouldMount(true)
        unsubscribe()
      }
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `shouldMount` is read only as a mount-time snapshot (see comment above), not tracked live; including it would re-subscribe every time it flips.
  }, [z])

  return (
    <div className="hero-diamond-slot">
      {shouldMount ? <HeroDiamond phone={phone} z={z} /> : null}
    </div>
  )
}
