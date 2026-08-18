"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

export interface IndicatorDotProps {
  index: number;
  springIndex: MotionValue<number>;
  label: string;
  onClick: () => void;
}

/** HIG page control: equidistant circular dots; solid = current page. */
export function IndicatorDot({ index, springIndex, label, onClick }: IndicatorDotProps) {
  const distance = useTransform(springIndex, (value) => Math.abs(value - index));
  const opacity = useTransform(distance, [0, 1, 4], [1, 0.38, 0.22], { clamp: true });
  const scale = useTransform(distance, [0, 3, 6], [1, 1, 0.55], { clamp: true });

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="page-control-hit"
    >
      <motion.span
        aria-hidden="true"
        style={{ opacity, scale }}
        className="page-control-dot"
      />
    </button>
  );
}
