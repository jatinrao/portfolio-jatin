'use client';

import { useCallback, useState } from 'react';

/** Tracks which item (by id) is hovered, so siblings can be dimmed/shrunk. */
export function useHoverFocus() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getFocusProps = useCallback(
    (id: string) => ({
      isDimmed: hoveredId !== null && hoveredId !== id,
      onHoverStart: () => setHoveredId(id),
      onHoverEnd: () => setHoveredId((current) => (current === id ? null : current)),
    }),
    [hoveredId],
  );

  return { hoveredId, getFocusProps };
}