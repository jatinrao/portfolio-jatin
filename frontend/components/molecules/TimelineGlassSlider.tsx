'use client';

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import { useTimelineScrollContext, getTimelineScrollBounds } from '@/context/timeline-scroll-context';

/**
 * The "glass pointer" tracker for the experience timeline. Purely visual
 * before this — aria-hidden, no pointer handlers, just mirroring
 * scrollXProgress. Now draggable: dragging (or clicking the track) writes
 * `containerRef.current.scrollLeft` directly, and since scrollXProgress
 * (context/timeline-scroll-context.tsx) is framer-motion's own useScroll
 * over that same container, the fill/knob position updates for free from
 * the resulting scroll event — no second transform to keep in sync.
 *
 * Deliberately no overscroll/rubber-band or release animation here: those
 * were extra transforms firing on top of an already continuous scroll,
 * which read as jitter rather than polish. Dragging past either end just
 * clamps, plainly.
 */
export function TimelineGlassSlider() {
  const { containerRef, scrollXProgress } = useTimelineScrollContext();
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const fillWidth = useTransform(scrollXProgress, (value) => `${value * 100}%`);
  const knobLeft = useTransform(scrollXProgress, (value) => `${value * 100}%`);

  // Keeps aria-valuenow current without a React re-render per scroll frame.
  useMotionValueEvent(scrollXProgress, 'change', (value) => {
    knobRef.current?.setAttribute('aria-valuenow', String(Math.round(value * 100)));
  });

  const scrubToClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      const scroller = containerRef.current;
      if (!track || !scroller) return;
      const rect = track.getBoundingClientRect();
      const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
      const clamped = Math.min(1, Math.max(0, ratio));
      const { start, max } = getTimelineScrollBounds(scroller);
      scroller.scrollLeft = start + clamped * (max - start);
    },
    [containerRef],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      draggingRef.current = true;
      scrubToClientX(event.clientX);
      // Best-effort: capture keeps the drag tracking even if the pointer
      // leaves the knob mid-gesture. Ordered last and guarded — it can
      // throw (e.g. "no active pointer with that id") in edge cases, and
      // the drag itself must not depend on it succeeding.
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Non-fatal: pointermove/pointerup still work without capture.
      }
    },
    [scrubToClientX],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (!draggingRef.current) return;
      scrubToClientX(event.clientX);
    },
    [scrubToClientX],
  );

  const handlePointerUp = useCallback((event: ReactPointerEvent) => {
    draggingRef.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Non-fatal — see handlePointerDown.
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const scroller = containerRef.current;
      if (!scroller) return;
      const { start, max } = getTimelineScrollBounds(scroller);
      const step = scroller.clientWidth * 0.2;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        scroller.scrollTo({ left: Math.min(max, scroller.scrollLeft + step), behavior: 'smooth' });
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        scroller.scrollTo({ left: Math.max(start, scroller.scrollLeft - step), behavior: 'smooth' });
      } else if (event.key === 'Home') {
        event.preventDefault();
        scroller.scrollTo({ left: start, behavior: 'smooth' });
      } else if (event.key === 'End') {
        event.preventDefault();
        scroller.scrollTo({ left: max, behavior: 'smooth' });
      }
    },
    [containerRef],
  );

  return (
    <div className="timeline-slider" ref={trackRef}>
      <div
        className="timeline-slider-track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <motion.div className="timeline-slider-fill" style={{ width: fillWidth }} />
      </div>
      <motion.div
        ref={knobRef}
        className="timeline-slider-knob"
        style={{ left: knobLeft }}
        role="slider"
        tabIndex={0}
        aria-label="Scroll experience timeline"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
