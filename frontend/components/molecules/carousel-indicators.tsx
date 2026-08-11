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
    <div className="mt-16 flex items-center gap-4">
      {/* <span className="font-label-caps text-[10px] text-muted-body">SEQ_INDEX</span> */}
      <div className="flex h-2 gap-1">
        {Array.from({ length: count }, (_, index) => (
          <IndicatorDot
            key={index}
            index={index}
            springIndex={springIndex}
            label={`Go to card ${index + 1} of ${count}`}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  );
}
