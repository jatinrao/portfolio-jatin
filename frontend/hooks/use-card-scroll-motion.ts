'use client';

import { useRef } from 'react';
import { useScroll, useTransform,} from 'framer-motion';
import type { RefObject } from 'react';
/**
 * All scroll-linked motion for one timeline card, as a function of its own
 * position in the horizontal scroll track. Returns plain style-ready
 * values (a ref to attach, plus MotionValues for style props) — the
 * component itself stays pure markup.
 *
 * Must be called from a Client Component (it calls useScroll internally),
 * but keeping it in `hooks/` alongside the other animation hooks means
 * TimelineStepCard's JSX/content and its motion logic are cleanly
 * separated — nothing about the *content* is client-only, so there's
 * nothing here that can cause an SSG/hydration content mismatch; only the
 * motion values differ between server-rendered markup and the
 * post-hydration animated state.
 */
export function useCardScrollMotion(containerRef: RefObject<HTMLDivElement>) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollXProgress: cardProgress } = useScroll({
    target: cardRef,
    container: containerRef,
    axis: 'x',
    offset: ['start end', 'center center', 'end start'],
  });

  const y = useTransform(cardProgress, [0, 0.5, 1], [0, 0, 0]);
  const opacity = useTransform(cardProgress, [0, 0.15, 0.5, 0.85, 1], [0.92, 1, 1, 1, 0.92]);
  const scale = useTransform(cardProgress, [0, 0.5, 1], [1, 1, 1]);

  return { cardRef, wrapperStyle: { y, opacity, scale } };
}