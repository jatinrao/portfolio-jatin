"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

export interface IndicatorDotProps {
  index: number;
  springIndex: MotionValue<number>;
  label: string;
  onClick: () => void;
}

/**
 * Reads distance from the shared continuous index so the active segment
 * widens in step with the card that's animating into focus, instead of
 * snapping instantly the moment a threshold is crossed.
 */
export function IndicatorDot({ index, springIndex, label, onClick }: IndicatorDotProps) {
  const distance = useTransform(springIndex, (value) => Math.abs(value - index));
  const width = useTransform(distance, [0, 1], [32, 12], { clamp: true });
  const background = useTransform(distance, (value) =>
    value < 0.5 ? "#755b00" : "#edeae0",
  );

  return (
    <button
      type="button"
      aria-label={label}
      // aria-current={index === springIndex ? "true" : undefined}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center"
    >
      <motion.span
        aria-hidden="true"
        style={{ width, backgroundColor: background }}
        className="h-2 border border-heading-ink"
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      />
    </button>
  );
}




