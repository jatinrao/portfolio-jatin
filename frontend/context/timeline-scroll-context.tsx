'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';

interface TimelineScrollContextValue {
  containerRef: RefObject<HTMLDivElement | null>;
  scrollXProgress: MotionValue<number>;
}

const TimelineScrollContext = createContext<TimelineScrollContextValue | null>(null);

export function useTimelineScrollContext() {
  const ctx = useContext(TimelineScrollContext);
  if (!ctx) {
    throw new Error('useTimelineScrollContext must be used within <TimelineScrollProvider>');
  }
  return ctx;
}

/**
 * The timeline's true "start" isn't scrollLeft 0 — Timeline.tsx pads the
 * row so the first card centers under the viewport, and use-room-wipe's
 * scroll-jack already resets to `paddingLeft - 20` as its own zero point.
 * Every consumer of "progress" (this context's scrollXProgress, the glass
 * slider's drag math, the scroll-jack itself) has to agree on that same
 * zero point, or they visibly disagree about what "all the way left"
 * means — which is what made the knob rest off-position and made
 * dragging feel like it fought the scroll-jack.
 *
 * Cached per element: this runs from both use-room-wipe's scroll-jack and
 * this context's own 'scroll' listener, so an uncached version forced a
 * synchronous layout read (getComputedStyle) on literally every scroll
 * frame from both call sites — the jitter this was producing. The padding
 * this reads only changes across responsive breakpoints, not per-frame, so
 * it's safe to compute once and only invalidate on resize.
 */
let boundsCache = new WeakMap<HTMLElement, { start: number; max: number }>();

export function getTimelineScrollBounds(el: HTMLElement) {
  const cached = boundsCache.get(el);
  if (cached) return cached;
  const inner = el.firstElementChild as HTMLElement | null;
  const paddingLeft = inner ? parseFloat(getComputedStyle(inner).paddingLeft) || 0 : 0;
  const start = Math.max(0, paddingLeft - 20);
  const max = Math.max(start, el.scrollWidth - el.clientWidth);
  const bounds = { start, max };
  boundsCache.set(el, bounds);
  return bounds;
}

/** Called from TimelineScrollProvider's own resize listener below — the single place that already watches for layout changes. */
function invalidateTimelineScrollBounds() {
  boundsCache = new WeakMap();
}

export function TimelineScrollProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollXProgress = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const { start } = getTimelineScrollBounds(el);
    el.scrollLeft = start;

    const update = () => {
      const { start, max } = getTimelineScrollBounds(el);
      const travel = Math.max(1, max - start);
      scrollXProgress.set(Math.min(1, Math.max(0, (el.scrollLeft - start) / travel)));
    };
    const onResize = () => {
      invalidateTimelineScrollBounds();
      update();
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', onResize);
    };
  }, [scrollXProgress]);

  return (
    <TimelineScrollContext.Provider value={{ containerRef, scrollXProgress }}>
      <div ref={containerRef} className="timeline-scroll horizontal-scroll-container scroll-hide relative h-full min-h-0 w-full overflow-x-auto overflow-y-hidden">
        {children}
      </div>
    </TimelineScrollContext.Provider>
  );
}
