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
  cardWidth: 342,
  cardHeight: 468,
  containerHeight: 540,
  xOffsets: [-504, -270, 0, 270, 504],
  zDepths: [198, -90, -288],
};

const TABLET: CarouselGeometry = {
  cardWidth: 270,
  cardHeight: 369,
  containerHeight: 450,
  xOffsets: [-387, -207, 0, 207, 387],
  zDepths: [153, -72, -234],
};

const MOBILE: CarouselGeometry = {
  cardWidth: 151,
  cardHeight: 207,
  containerHeight: 252,
  xOffsets: [-180, -99, 0, 99, 180],
  zDepths: [72, -36, -126],
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
      const portrait = window.matchMedia('(orientation: portrait)').matches;
      if (width < 560 || (portrait && width < 1024)) {
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
