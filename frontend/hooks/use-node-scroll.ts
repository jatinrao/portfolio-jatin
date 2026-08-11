'use client';

import { type RefObject, useRef } from 'react';
import { useScroll, useTransform,} from 'framer-motion';

/** Scroll-linked motion for one timeline node — active/square state driven by its own centered-ness. */
export function useNodeScrollMotion(containerRef: RefObject<HTMLDivElement> | undefined) {
  const nodeRef = useRef<HTMLDivElement>(null);

  const { scrollXProgress: nodeProgress } = useScroll({
    target: nodeRef,
    container: containerRef,
    axis: 'x',
    offset: ['start end', 'center center', 'end start'],
  });

  const distanceFromCenter = useTransform(nodeProgress, (p) => Math.abs(p - 0.5));
  const scale = useTransform(distanceFromCenter, [0, 0.12], [1.35, 1], { clamp: true });
  const backgroundColor = useTransform(distanceFromCenter, [0, 0.12], ['#3b684a', '#fcf9f3'], { clamp: true });
  const borderColor = useTransform(distanceFromCenter, [0, 0.12], ['#3b684a', '#1a1a1a'], { clamp: true });

  return { nodeRef, nodeStyle: { scale, backgroundColor, borderColor } };
}