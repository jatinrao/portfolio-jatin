'use client';

import type { RefObject } from 'react';
import { motion } from 'framer-motion';
import { useTimelineScrollContext } from '@/context/timeline-scroll-context';
import { useNodeScrollMotion } from '@/hooks/use-node-scroll';

export function TimelineNode() {
  const { containerRef } = useTimelineScrollContext();
  const { nodeRef, nodeStyle } = useNodeScrollMotion(containerRef as RefObject<HTMLDivElement>);

  return <motion.div ref={nodeRef} style={nodeStyle} className="z-10 h-5 w-5 border-4" />;
}