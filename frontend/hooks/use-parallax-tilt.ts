'use client';

import { useRef } from 'react';
import { useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import type { PointerEvent, RefObject } from 'react';

/**
 * Cursor-driven 3D parallax tilt for the hero image — adapted from the
 * "Apple TV Parallax Effect" (https://codepen.io/ViggoZ/pen/mKbpyZ): the
 * card tilts toward the cursor, depth layers shift by their own offset for
 * a parallax illusion, and a gloss overlay's gradient angle/opacity track
 * the cursor. Two changes from the source pen:
 *   - Source tracks `window` mousemove and drives 5 separately-painted PNG
 *     layers (a poster composited in Photoshop specifically for this
 *     effect). We don't have layered artwork for a single profile photo,
 *     so this scopes tracking to pointer events on the card itself, and
 *     reuses the hero image's own existing pieces (frame / photo / badge)
 *     as the parallax depths instead.
 *   - Source writes to the DOM via jQuery `.css()` on every mousemove.
 *     This returns framer-motion MotionValues instead: updates don't
 *     trigger a React re-render on every pointer-move tick (framer writes
 *     directly to the DOM), matching how continuous pointer/scroll-driven
 *     motion is already done elsewhere in this codebase (see
 *     use-card-scroll-motion.ts, use-node-scroll.ts) — component JSX
 *     stays declarative; this hook owns all the pointer-tracking math.
 */
export function useParallaxTilt() {
  const cardRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  // Pointer offset from card center, normalized to roughly [-0.5, 0.5] —
  // same convention as the source pen's offsetX/offsetY (0.5 - pos/size).
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    offsetX.set(0.5 - (event.clientX - rect.left) / rect.width);
    offsetY.set(0.5 - (event.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    offsetX.set(0);
    offsetY.set(0);
  }

  // Card tilt — same rotateX/rotateY idea as the source's poster transform.
  // Source multiplies by a page-width-relative `data-offset` (5); ours is
  // already relative to the card's own size, so a smaller fixed multiplier
  // keeps the tilt subtle rather than flipping the whole card.
  const rotateX = useTransform(offsetY, (v) => -v * 16);
  const rotateY = useTransform(offsetX, (v) => v * 16);
  const cardTransform = useMotionTemplate`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  // Depth layers — frame sits furthest back (smallest shift, plus its
  // existing static 8px offset baked in here since this transform
  // replaces the Tailwind translate-x-2/translate-y-2 utility that would
  // otherwise be overridden by this inline transform), badge floats
  // nearest (largest shift) — same idea as the source's per-layer
  // data-offset, mapped onto the three pieces the hero image actually has.
  const frameX = useTransform(offsetX, (v) => 8 + v * 4);
  const frameY = useTransform(offsetY, (v) => 8 + v * 4);
  const badgeX = useTransform(offsetX, (v) => v * -10);
  const badgeY = useTransform(offsetY, (v) => v * -10);

  // Gloss overlay — gradient angle from cursor angle (atan2, same formula
  // as the source's `.light` layer), opacity from vertical offset (0 at
  // top of card, 0.25 at bottom, half the source's peak since this glosses
  // a photo rather than a dark movie poster).
  // `useTransform([offsetX, offsetY], ([x, y]) => ...)` — reading two
  // motion values via the array-of-values form — turned out not to be a
  // real framer-motion API (confirmed elsewhere: RoomsSection's frame
  // slide silently never re-ran with that form when only one of two
  // inputs changed). The correct form is a dependency-free callback that
  // calls `.get()` on whatever it needs; framer auto-subscribes to those.
  const glossAngle = useTransform(() => {
    const deg = Math.atan2(-offsetY.get(), -offsetX.get()) * (180 / Math.PI);
    return deg < 0 ? deg + 360 : deg;
  });
  const glossOpacity = useTransform(offsetY, (v) => Math.min(0.25, Math.max(0, 0.25 * (0.5 - v))));
  const glossBackground = useMotionTemplate`linear-gradient(${glossAngle}deg, rgba(255,255,255,${glossOpacity}) 0%, rgba(255,255,255,0) 70%)`;

  return {
    cardRef,
    handlers: { onPointerMove: handlePointerMove, onPointerLeave: handlePointerLeave },
    cardStyle: { transform: cardTransform, transformStyle: 'preserve-3d' as const },
    frameStyle: { x: frameX, y: frameY },
    badgeStyle: { x: badgeX, y: badgeY },
    glossStyle: { background: glossBackground },
  };
}
