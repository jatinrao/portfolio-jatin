"use client";

import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useMotionValue, useSpring, type PanInfo } from "framer-motion";

/** Tuned to feel like Cover Flow's damped, slightly overshooting settle. */
const SPRING = { stiffness: 300, damping: 32, mass: 0.9 };
/** Near-instant, non-bouncy settle for prefers-reduced-motion users. */
const SPRING_REDUCED_MOTION = { stiffness: 1000, damping: 100, mass: 0.5 };
/** Pixels of horizontal drag equivalent to moving exactly one card slot. */
const DRAG_SENSITIVITY = 220;
/** Above this release velocity (px/s) a drag counts as a "flick". */
const VELOCITY_FLICK_THRESHOLD = 500;
/** How much extra momentum a flick contributes on top of raw drag distance. */
const FLICK_CARRY = 0.35;
/** Resistance applied once dragging past the first/last card (rubber-banding). */
const OVERSCROLL_RESISTANCE = 0.35;

export interface UseCoverflowOptions {
  count: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Pass `useReducedMotion()` through so the spring settles without bounce. */
  reducedMotion?: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function withRubberBand(value: number, max: number) {
  if (value < 0) return value * OVERSCROLL_RESISTANCE;
  if (value > max) return max + (value - max) * OVERSCROLL_RESISTANCE;
  return value;
}

/**
 * Drives a Cover Flow-style carousel from a single continuous spring value
 * (`springIndex`) rather than discrete CSS transition classes. Every card
 * reads its own distance from `springIndex` to compute position, rotation,
 * scale and opacity, so drag, flick, click and keyboard navigation all
 * animate through the exact same physics instead of separate code paths.
 */
export function useCoverflow({
  count,
  initialIndex = 0,
  onIndexChange,
  reducedMotion = false,
}: UseCoverflowOptions) {
  const [activeIndex, setActiveIndex] = useState(() => clamp(initialIndex, 0, count - 1));

  // `target` is the value we snap to; `springIndex` eases toward it and is
  // what every card actually reads from during render.
  const target = useMotionValue(activeIndex);
  const springIndex = useSpring(target, reducedMotion ? SPRING_REDUCED_MOTION : SPRING);
  const dragStartIndexRef = useRef(activeIndex);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((current) => {
       const next = clamp(Math.round(index), 0, count - 1);
       target.set(next);
       onIndexChange?.(next);
       return next;
     });
    },
    [count, target, onIndexChange],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  const onDragStart = useCallback(() => {
    dragStartIndexRef.current = activeIndex;
  }, [activeIndex]);

  const onDrag = useCallback(
    (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      const fractionalOffset = -info.offset.x / DRAG_SENSITIVITY;
      const raw = dragStartIndexRef.current + fractionalOffset;
      target.set(withRubberBand(raw, count - 1));
    },
    [count, target],
  );
  

  const onDragEnd = useCallback(
    (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      const isFlick = Math.abs(info.velocity.x) > VELOCITY_FLICK_THRESHOLD;

      if (!isFlick) {
        // A hold-and-drag is a "peek": releasing without enough speed always
        // resettles on whichever card was active when the drag began, no
        // matter how far it was dragged.
        goTo(dragStartIndexRef.current);
        return;
      }

      const fractionalOffset = -info.offset.x / DRAG_SENSITIVITY;
      const flickCarry = (-info.velocity.x / DRAG_SENSITIVITY) * FLICK_CARRY;
      goTo(dragStartIndexRef.current + fractionalOffset + flickCarry);
    },
    [goTo],
  );


  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          event.preventDefault();
          goPrev();
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(count - 1);
          break;
        default:
          break;
      }
    },
    [count, goNext, goPrev, goTo],
  );

  return {
    activeIndex,
    springIndex,
    goTo,
    goNext,
    goPrev,
    canGoPrev: activeIndex > 0,
    canGoNext: activeIndex < count - 1,
    dragHandlers: { onDragStart, onDrag, onDragEnd },
    onKeyDown,
  };
}
