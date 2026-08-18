'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { useScroll, type MotionValue } from 'framer-motion';

interface TimelineScrollContextValue {
  containerRef: RefObject<HTMLDivElement | null>;
  scrollXProgress: MotionValue<number>;
}

const TimelineScrollContext = createContext<TimelineScrollContextValue | null>(null);

export function useTimelineScrollContext() {
  const ctx = useContext(TimelineScrollContext);
  if (!ctx) {
    throw new Error('useTimelineScrollContext must be used within <TimelineScrollProvider>');
  }
  return ctx;
}

export function TimelineScrollProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });

  useEffect(() => {
    const el = containerRef.current;
    const inner = el?.firstElementChild as HTMLElement | null;
    if (!el || !inner) return;
    const paddingLeft = parseFloat(getComputedStyle(inner).paddingLeft) || 0;
    el.scrollLeft = Math.max(0, paddingLeft - 20);
  }, []);

  return (
    <TimelineScrollContext.Provider value={{ containerRef, scrollXProgress }}>
      <div ref={containerRef} className="timeline-scroll horizontal-scroll-container scroll-hide relative h-full min-h-0 w-full overflow-x-auto overflow-y-hidden">
        {children}
      </div>
    </TimelineScrollContext.Provider>
  );
}
