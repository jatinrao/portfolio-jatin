"use client";

import { useEffect, useState } from "react";

export interface CarouselGeometry {
  cardWidth: number;
  cardHeight: number;
  containerHeight: number;
  /** x offsets for [-2, -1, 0, 1, 2] card slots, in px */
  xOffsets: [number, number, number, number, number];
  /** z depth for [0, 1, 2] distance-from-active, in px */
  zDepths: [number, number, number];
}

const DESKTOP: CarouselGeometry = {
  cardWidth: 380,
  cardHeight: 520,
  containerHeight: 600,
  xOffsets: [-560, -300, 0, 300, 560],
  zDepths: [220, -100, -320],
};

const TABLET: CarouselGeometry = {
  cardWidth: 300,
  cardHeight: 410,
  containerHeight: 500,
  xOffsets: [-430, -230, 0, 230, 430],
  zDepths: [170, -80, -260],
};

const MOBILE: CarouselGeometry = {
  cardWidth: 210,
  cardHeight: 288,
  containerHeight: 380,
  xOffsets: [-270, -145, 0, 145, 270],
  zDepths: [110, -55, -180],
};

/**
 * All pixel math for card position (x offset, z depth, card size) lives
 * in one of these three presets rather than scattered magic numbers, so
 * the drag/flick physics in `useCoverflow` — which work in raw pixels —
 * stay correct at every screen size. SSR/SSG renders the desktop preset
 * (no window access on the server), then this narrows on mount and on
 * resize, so desktop has no layout shift and phones correct immediately
 * after hydration.
 */
export function useCarouselGeometry(): CarouselGeometry {
  const [geometry, setGeometry] = useState<CarouselGeometry>(DESKTOP);

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      if (width < 560) {
        setGeometry(MOBILE);
      } else if (width < 900) {
        setGeometry(TABLET);
      } else {
        setGeometry(DESKTOP);
      }
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return geometry;
}
