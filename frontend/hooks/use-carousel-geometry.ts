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

// Base (unscaled) mobile shape, from which mobileGeometry derives every
// other value proportionally — see mobileGeometry below.
const MOBILE_BASE_WIDTH = 151;
const MOBILE_BASE: Omit<CarouselGeometry, "cardWidth"> = {
  cardHeight: 207,
  containerHeight: 252,
  xOffsets: [-180, -99, 0, 99, 180],
  zDepths: [72, -36, -126],
};

/**
 * The "MOBILE" bucket below covers everything from a small phone up to a
 * 1024px portrait tablet (matches RoomsSection's own mobile-flow
 * breakpoint), so a single fixed card size either looks tiny on the wide
 * end or overflows on the narrow end. Scale cardWidth as a fraction of the
 * viewport instead, clamped to a sane range, and derive the rest of the
 * geometry from it so offsets/depth stay proportional.
 */
function mobileGeometry(width: number): CarouselGeometry {
  const cardWidth = Math.round(Math.min(340, Math.max(220, width * 0.72)));
  const scale = cardWidth / MOBILE_BASE_WIDTH;
  return {
    cardWidth,
    cardHeight: Math.round(MOBILE_BASE.cardHeight * scale),
    containerHeight: Math.round(MOBILE_BASE.containerHeight * scale),
    xOffsets: MOBILE_BASE.xOffsets.map((v) => Math.round(v * scale)) as CarouselGeometry["xOffsets"],
    zDepths: MOBILE_BASE.zDepths.map((v) => Math.round(v * scale)) as CarouselGeometry["zDepths"],
  };
}

/**
 * All pixel math for card position (x offset, z depth, card size) lives
 * here rather than scattered magic numbers, so the drag/flick physics in
 * `useCoverflow` — which work in raw pixels — stay correct at every screen
 * size. SSR/SSG renders the desktop preset (no window access on the
 * server), then this narrows on mount and on resize, so desktop has no
 * layout shift and phones correct immediately after hydration.
 */
export function useCarouselGeometry(): CarouselGeometry {
  const [geometry, setGeometry] = useState<CarouselGeometry>(DESKTOP);

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      const portrait = window.matchMedia('(orientation: portrait)').matches;
      if (width < 560 || (portrait && width < 1024)) {
        setGeometry(mobileGeometry(width));
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
