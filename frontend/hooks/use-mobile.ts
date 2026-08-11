'use client';

import { useEffect, useState } from 'react';

/**
 * True when the viewport is at or below `breakpointPx` (default 767 — just
 * under Tailwind's `md` breakpoint at 768px, so this flips exactly where
 * `md:` utilities do). Defaults to `false` on the server/first render to
 * avoid a hydration mismatch; corrects itself via the effect immediately
 * after mount, before paint in practice for this use case.
 */
export function useIsMobile(breakpointPx = 767): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx}px)`);

    const update = () => setIsMobile(query.matches);
    update();

    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [breakpointPx]);

  return isMobile;
}