'use client';

import { useEffect, useRef, type CSSProperties, type RefObject } from 'react';

const SCREEN_MAX = 938;
const SCREEN_VW = 0.86;
/** First 10% of the hero track: scale holds (measured on apple.com/apple-tv-4k). */
const HOLD = 0.1;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Matches Apple’s post-hold zoom: 1 − (1 − x)² */
function easeOutQuad(x: number) {
  return 1 - (1 - x) * (1 - x);
}

/**
 * Linear scroll → zoom progress used on apple.com/apple-tv-4k:
 * hold ~0–0.10, then ease-out quad to 1.
 */
function zoomProgress(t: number) {
  if (t <= HOLD) return 0;
  return easeOutQuad((t - HOLD) / (1 - HOLD));
}

/**
 * Frame shrinks from the sticky viewport to a 16:9 TV.
 * The live hero is sized to the stage and optically scaled with the frame,
 * so t=0 is the original full-bleed layout (scale 1).
 */
export function useHeroScale() {
  const trackRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  useEffect(() => {
    function update() {
      const node = trackRef.current;
      if (!node) return;
      const sticky = node.querySelector('.hero-sticky') as HTMLElement | null;
      const stageW = sticky?.clientWidth || window.innerWidth;
      const stageH = sticky?.clientHeight || window.innerHeight;
      const rect = node.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const scrolled = Math.min(scrollable, Math.max(0, -rect.top));
      const linear = scrolled / scrollable;
      const z = zoomProgress(linear);
      const screenW = Math.min(SCREEN_MAX, stageW * SCREEN_VW);
      const screenH = screenW * (9 / 16);
      const frameW = lerp(stageW, screenW, z);
      const frameH = lerp(stageH, screenH, z);
      const showScale = frameW / Math.max(1, stageW);
      const phone = clamp((z - 0.82) / 0.14);
      const glow = clamp((z - 0.72) / 0.2);

      node.style.setProperty('--hero-t', z.toFixed(4));
      node.style.setProperty('--hero-stage-w', `${stageW}px`);
      node.style.setProperty('--hero-stage-h', `${stageH}px`);
      node.style.setProperty('--hero-frame-w', `${frameW.toFixed(2)}px`);
      node.style.setProperty('--hero-frame-h', `${frameH.toFixed(2)}px`);
      node.style.setProperty('--hero-show-scale', showScale.toFixed(4));
      node.style.setProperty('--hero-phone', phone.toFixed(4));
      node.style.setProperty('--hero-glow-opacity', glow.toFixed(4));
      node.dataset.heroSettled = z > 0.92 ? 'true' : 'false';
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const style = {
    '--hero-t': 0,
    '--hero-frame-w': '100%',
    '--hero-frame-h': '100%',
    '--hero-show-scale': 1,
    '--hero-phone': 0,
    '--hero-glow-opacity': 0,
  } as CSSProperties;

  return { trackRef, style };
}
