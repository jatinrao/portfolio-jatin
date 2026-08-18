'use client';

import { useEffect, useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useTimelineScrollContext } from '@/context/timeline-scroll-context';

/**
 * framer-motion's `useTransform` color interpolation needs literal
 * hex/rgb values to mix between — it can't resolve `var(--color-x)`
 * strings. Reading the tokens from the DOM at mount (rather than
 * hardcoding a second copy of the hex) keeps this in sync with
 * app/globals.css, including live edits from the dev design-token panel.
 */
function useResolvedColorToken(cssVar: string, fallback: string) {
  const [color, setColor] = useState(fallback);
  useEffect(() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    if (value) setColor(value);
  }, [cssVar]);
  return color;
}

export function TimelineDotTrack({ count = 72 }: { count?: number }) {
  const { scrollXProgress } = useTimelineScrollContext();
  const positions = Array.from({ length: count }, (_, index) => index / (count - 1));

  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-between">
      {positions.map((position) => (
        <TimelineDot key={position} position={position} scrollXProgress={scrollXProgress} />
      ))}
    </div>
  );
}

function TimelineDot({ position, scrollXProgress }: { position: number; scrollXProgress: MotionValue<number> }) {
  const distance = useTransform(scrollXProgress, (progress) => Math.abs(progress - position));
  // Raised the floor on opacity/scale/weight, and swapped the resting
  // color from a near-background beige to something with real contrast —
  // the ambient page dots sit at low opacity too, so the track needs to
  // read clearly distinct from them even at rest, not just at its peak.
  const opacity = useTransform(distance, [0, 0.05, 0.18], [1, 0.95, 0.6], { clamp: true });
  const scale = useTransform(distance, [0, 0.05, 0.18], [2.2, 1.6, 1.2], { clamp: true });
  const fontWeight = useTransform(distance, [0, 0.05, 0.18], [900, 700, 500], { clamp: true });
  const peakColor = useResolvedColorToken('--color-secondary-fixed', '#c9a84c');
  const restColor = useResolvedColorToken('--color-outline', '#7e7665');
  const color = useTransform(distance, [0, 0.18], [peakColor, restColor], { clamp: true });

  return (
    <motion.span style={{ opacity, scale, fontWeight, color }} className="select-none font-label-caps text-xs leading-none">
      •
    </motion.span>
  );
}