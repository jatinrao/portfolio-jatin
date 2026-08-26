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
// Must match .timeline-slider-knob's width in timeline-section.css. The
// knob is centered on `left` via `translate: -50%`, so at raw
// `left: {progress}%` its half-width overhangs past the track's own edges
// at the two scroll extremes — invisible (clipped by the horizontal
// scroller's overflow) whenever the track's start/end inset is smaller
// than that half-width, which is exactly the case on mobile (small
// start/end padding) even though desktop's much wider centering padding
// hides the same issue there.
const KNOB_WIDTH = 72;

/**
 * `.timeline-slider` (this component's own root) is `inset-inline: 0`
 * inside the node-marker row — but that row is a `flex-nowrap` container
 * whose *columns* (`shrink-0`) are allowed to overflow it, which is how
 * the horizontal-scroll gallery works at all: the row's own CSS box stays
 * at whatever width its content model gives it, while the columns paint
 * past that box uncomplained (overflow: visible). So the track's own
 * width is *not* the true scrollable extent — on this timeline it was
 * roughly half of it. A `left: {progress}%` computed against that
 * undersized box tops out well before scrollXProgress reaches 1, so once
 * real scrolling passed that point the whole slider (row-anchored, and so
 * everything positioned inside it, knob included) had already scrolled
 * off past the left edge of the viewport and never came back on-screen.
 *
 * Fix: compute the knob/fill's position in real pixels against the
 * scroller's own `scrollWidth` (the browser's true, measured overflow —
 * always correct regardless of what the row's own box reports) instead of
 * against the track element's box. `left`/`width` in px are allowed to
 * exceed the track's own 0–100% range with no clipping (nothing between
 * the track and `.timeline-scroll` sets overflow:hidden) — only the
 * scroller's actual viewport clips, which this now tracks correctly.
 */
function progressToPx(value: number, scroller: HTMLElement) {
  const { paddingLeft, scrollWidth } = getTimelineScrollBounds(scroller);
  // Content-coordinate target (from the scroller's own left edge) minus
  // the track's own left inset (paddingLeft, since the track sits flush
  // against the row, which sits flush against that padding) — converts
  // to a position relative to the track element, matching what a plain
  // `left` px value on a child of the track means.
  return value * scrollWidth - paddingLeft;
}

export function TimelineGlassSlider() {
  const { containerRef, scrollXProgress } = useTimelineScrollContext();
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  // `.timeline-slider-track` clips its fill (`overflow: hidden`, the pill
  // groove shape) — same undersized-row-box problem `progressToPx` works
  // around for `fillWidth`/`knobLeft`, but the track's own box is CSS-sized
  // (`inset-inline: 0` against that same row), so it was clipping the fill
  // at ~half its real length regardless of what pixel width the fill
  // itself asked for. The knob sits *outside* that clip (a sibling, not a
  // descendant), so it kept sliding to the correct real position while the
  // fill visually maxed out under it a few cards in — the fill looked
  // "done" while the knob kept going. Sizing the track to the same
  // `scrollWidth` the fill/knob math already targets makes its clip
  // boundary match the real full-scroll length instead of the row's box.
  const trackWidth = useTransform(scrollXProgress, () => {
    const scroller = containerRef.current;
    if (!scroller) return '100%';
    return `${getTimelineScrollBounds(scroller).scrollWidth}px`;
  });

  const fillWidth = useTransform(scrollXProgress, (value) => {
    const scroller = containerRef.current;
    if (!scroller) return `${value * 100}%`;
    return `${Math.max(0, progressToPx(value, scroller))}px`;
  });
  // Insets the knob by half its own width at each end (the standard
  // native-range-thumb trick) so its center never asks for a position
  // closer to either edge than its own radius allows.
  const knobLeft = useTransform(scrollXProgress, (value) => {
    const scroller = containerRef.current;
    const inset = (KNOB_WIDTH / 2) * (1 - 2 * value);
    if (!scroller) return `calc(${value * 100}% + ${inset}px)`;
    return `${progressToPx(value, scroller) + inset}px`;
  });

  // Keeps aria-valuenow current without a React re-render per scroll frame.
  useMotionValueEvent(scrollXProgress, 'change', (value) => {
    knobRef.current?.setAttribute('aria-valuenow', String(Math.round(value * 100)));
  });

  const scrubToClientX = useCallback(
    (clientX: number) => {
      // trackRef now points at .timeline-slider-track itself (see render),
      // which is what carries the real-scrollWidth `trackWidth` fix above —
      // reading its rect gets the true full-timeline span. It used to sit
      // on the outer .timeline-slider wrapper instead, which is never
      // resized and stays pinned to the row's undersized box, so a
      // click/drag ratio computed against it landed on the wrong card for
      // any click past roughly the same point the fill used to visually
      // stall at.
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
    <div className="timeline-slider">
      <motion.div
        ref={trackRef}
        className="timeline-slider-track"
        style={{ width: trackWidth }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <motion.div className="timeline-slider-fill" style={{ width: fillWidth }} />
      </motion.div>
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
