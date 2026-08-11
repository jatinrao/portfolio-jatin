'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useTimelineScrollContext } from '@/context/timeline-scroll-context';

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
  const color = useTransform(distance, [0, 0.18], ['#c9a84c', '#7e7665'], { clamp: true });

  return (
    <motion.span style={{ opacity, scale, fontWeight, color }} className="select-none font-label-caps text-xs leading-none">
      •
    </motion.span>
  );
}