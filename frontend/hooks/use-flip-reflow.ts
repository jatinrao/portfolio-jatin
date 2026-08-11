'use client';

import { useLayoutEffect, useRef } from 'react';
import type { RefObject, DependencyList } from 'react';

const FLIP_DURATION = 840;

/**
 * Hand-rolled FLIP: whenever `deps` changes (e.g. the rendered list),
 * diffs each `[data-flip-id]` node's new position against where it was a
 * moment ago and animates away the difference, so removing/reordering
 * items reads as a slide rather than an instant snap.
 */
export function useFlipReflow(containerRef: RefObject<HTMLElement>, deps: DependencyList) {
  const prevRects = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = Array.from(container.querySelectorAll<HTMLElement>('[data-flip-id]'));
    const nextRects = new Map<string, DOMRect>();

    nodes.forEach((node) => {
      const id = node.dataset.flipId!;
      const newRect = node.getBoundingClientRect();
      nextRects.set(id, newRect);

      const oldRect = prevRects.current.get(id);
      if (!oldRect) return;

      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (!dx && !dy) return;

      node.style.transition = 'none';
      node.style.transform = `translate(${dx}px, ${dy}px)`;
      void node.offsetHeight;
      requestAnimationFrame(() => {
        node.style.transition = `transform ${FLIP_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        node.style.transform = '';
      });
    });

    prevRects.current = nextRects;
    // deps drives re-measurement; contents intentionally not exhaustively listed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}