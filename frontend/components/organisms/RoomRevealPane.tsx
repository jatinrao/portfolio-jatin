'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RoomRevealPaneProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * A room's text/frame column settling into its (static, normal-flow)
 * position the first time it scrolls into view — a one-time reveal, not
 * continuous scroll-scrubbing. Deliberately `whileInView`, not
 * `useScroll`/`useTransform`: this needs no ongoing scroll-progress
 * tracking, and `whileInView`'s IntersectionObserver setup is SSR-safe
 * (unlike a `target`-ref `useScroll`, which raced hydration when tried for
 * the earlier pinned version of this section — see git history). The
 * column's actual position never leaves normal document flow; this only
 * animates its opacity/offset on first appearance.
 */
export function RoomRevealPane({ children, className, delay = 0 }: RoomRevealPaneProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
