'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Raw pixel scroll position of `trackRef` through the window, plus the
 * track's total scrollable distance — a plain `scroll` listener + React
 * state, not framer-motion MotionValues. This effect needs to be locked
 * 1:1 to scroll with no spring/easing lag, so there was never a case for
 * MotionValues' "skip React's render cycle" optimization here — and that
 * indirection made a real bug (see use-frame-slide.ts) much harder to
 * spot than a plain `useState` update would have been. `useScroll({
 * target })` also measures its target synchronously against hydration
 * timing in a way that's thrown "Container ref is defined but not
 * hydrated" in this app before — a listener in a plain `useEffect`,
 * reading `getBoundingClientRect` only after mount, sidesteps that too.
 *
 * Returns raw px (not normalized 0→1) because the frame-slide math needs
 * to compare real pixel distances — how far you've scrolled against the
 * frame's own height — to keep the slide's speed matched 1:1 to scroll
 * speed. Normalizing to 0→1 first would throw that pixel relationship
 * away.
 */
export function useScrollProgress() {
  const trackRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const [scrolled, setScrolled] = useState(0);
  const [scrollable, setScrollable] = useState(1); // never 0 — avoids a divide-by-zero before the first measurement

  useEffect(() => {
    function update() {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollableHeight = Math.max(1, rect.height - window.innerHeight);
      setScrollable(scrollableHeight);
      setScrolled(Math.min(scrollableHeight, Math.max(0, -rect.top)));
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return { trackRef, scrolled, scrollable };
}
