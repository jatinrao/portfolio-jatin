'use client';

import { useRef } from 'react';
import { useMotionTemplate, useScroll, useTransform,} from 'framer-motion';
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

  const y = useTransform(cardProgress, [0, 0.5, 1], [14, 0, 14]);
  const opacity = useTransform(cardProgress, [0, 0.15, 0.5, 0.85, 1], [0.55, 1, 1, 1, 0.55]);
  const scale = useTransform(cardProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  // Bottom-left light source → shadow falls up-and-right; magnitude peaks
  // at center (most "lifted"), color shifts to theme green when centered.
  const distanceFromCenter = useTransform(cardProgress, (p) => Math.abs(p - 0.5));
  const shadowOffset = useTransform(distanceFromCenter, [0, 0.5], [10, 3], { clamp: true });
  const shadowColor = useTransform(distanceFromCenter, [0, 0.12], ['#3b684a', '#c9a84c'], { clamp: true });
  const boxShadow = useMotionTemplate`${shadowOffset}px -${shadowOffset}px 0px 0px ${shadowColor}`;

  return { cardRef, wrapperStyle: { y, opacity, scale }, cardStyle: { boxShadow } };
}