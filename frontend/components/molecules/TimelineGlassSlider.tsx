'use client';

import { motion, useTransform } from 'framer-motion';
import { useTimelineScrollContext } from '@/context/timeline-scroll-context';

export function TimelineGlassSlider() {
  const { scrollXProgress } = useTimelineScrollContext();
  const fillWidth = useTransform(scrollXProgress, (value) => `${value * 100}%`);
  const knobLeft = useTransform(scrollXProgress, (value) => `${value * 100}%`);

  return (
    <div className="timeline-slider" aria-hidden="true">
      <div className="timeline-slider-track">
        <motion.div className="timeline-slider-fill" style={{ width: fillWidth }} />
      </div>
      <motion.div className="timeline-slider-knob" style={{ left: knobLeft }} />
    </div>
  );
}
