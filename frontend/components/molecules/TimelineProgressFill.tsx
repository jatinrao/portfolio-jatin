'use client';

import { motion, useTransform } from 'framer-motion';
import { useTimelineScrollContext } from '@/context/timeline-scroll-context';

export function TimelineProgressFill() {
  const { scrollXProgress } = useTimelineScrollContext();
  const width = useTransform(scrollXProgress, (v) => `${v * 100}%`);

  return <motion.div style={{ width,height:'100%' }} className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-primary/50" />;
}