'use client';

import { createContext, useContext, useRef, type ReactNode, type RefObject } from 'react';
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

/**
 * Owns the one `useScroll` call for the whole timeline and the ref to the
 * actual scrollable element. Renders the scroll container itself and takes
 * server-rendered rows as `children` — Server Components can be passed as
 * children into a Client Component like this without becoming client
 * components themselves; only the interactive leaves nested inside
 * (TimelineDotTrack, TimelineProgressFill, TimelineStepCard) need to read
 * from this context, via `useTimelineScrollContext()`, which is itself
 * only usable from a client boundary.
 */
export function TimelineScrollProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });

  return (
    <TimelineScrollContext.Provider value={{ containerRef, scrollXProgress }}>
      <div ref={containerRef} className="horizontal-scroll-container scroll-hide relative w-full overflow-x-auto pb-12">
        {children}
      </div>
    </TimelineScrollContext.Provider>
  );
}