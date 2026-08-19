'use client';

import { useEffect, useState } from 'react';

/**
 * True when `breakpoint` matches — a px number is shorthand for
 * `(max-width: {breakpoint}px)`, or pass a raw media query string (e.g. to
 * reuse a multi-condition query already defined in CSS). Default 767px is
 * just under Tailwind's `md` breakpoint at 768px, so this flips exactly
 * where `md:` utilities do. Defaults to `false` on the server/first render
 * to avoid a hydration mismatch; corrects itself via the effect immediately
 * after mount, before paint in practice for this use case.
 */
export function useIsMobile(breakpoint: number | string = 767): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = typeof breakpoint === 'number' ? `(max-width: ${breakpoint}px)` : breakpoint;
    const query = window.matchMedia(mediaQuery);

    const update = () => setIsMobile(query.matches);
    update();

    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}