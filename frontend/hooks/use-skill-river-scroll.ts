'use client';

import { useLayoutEffect, type RefObject } from 'react';
import { applySkillRiverProgress } from '@/lib/skill-room-filters';
import { createScrollSettle } from '@/lib/scroll-settle';

/**
 * Mobile counterpart to use-room-wipe's skill-river pan — same
 * skillRiverLoopTranslateX math (via applySkillRiverProgress), but driven
 * by the row's own position as it scrolls through the viewport instead of
 * a hijacked scroll budget, since RoomsMobileFlow is plain document flow
 * with no pinned TV to tie progress to.
 *
 * No-ops entirely when `container` sits inside `.tv-screen` — that means
 * we're in the desktop pinned layout, where use-room-wipe already owns
 * this exact transform, so this would just fight it.
 */
export function useSkillRiverScroll(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || container.closest('.tv-screen')) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let raf = 0;
    let lastProgress = 0;
    // Continuous pan tracks scroll 1:1 (below); once scrolling pauses for a
    // beat this nudges the nearest skill into a centered rest position —
    // see the matching desktop logic in use-room-wipe.ts for why.
    const settle = createScrollSettle(() => {
      applySkillRiverProgress(container, lastProgress, { instant: false, quantize: true });
    });

    const apply = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // 0 as the card's top first enters the bottom of the viewport, 1 once
      // its bottom has scrolled past the top — a full pan across the card's
      // entire time on screen.
      const progress = Math.min(
        1,
        Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)),
      );
      lastProgress = progress;
      applySkillRiverProgress(container, progress, { instant: true, quantize: false });
      settle.notify();
    };

    apply();
    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.cancelAnimationFrame(raf);
      settle.cancel();
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [containerRef]);
}
