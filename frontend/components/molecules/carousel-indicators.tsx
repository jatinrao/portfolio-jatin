"use client";

import type { MotionValue } from "framer-motion";
import { IndicatorDot } from "@/components/atoms/indicator-dot";

export interface CarouselIndicatorsProps {
  count: number;
  springIndex: MotionValue<number>;
  onSelect: (index: number) => void;
}

export function CarouselIndicators({ count, springIndex, onSelect }: CarouselIndicatorsProps) {
  return (
    <nav className="page-control" aria-label="Project pages">
      {Array.from({ length: count }, (_, index) => (
        <IndicatorDot
          key={index}
          index={index}
          springIndex={springIndex}
          label={`Go to page ${index + 1} of ${count}`}
          onClick={() => onSelect(index)}
        />
      ))}
    </nav>
  );
}
