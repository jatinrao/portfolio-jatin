'use client';

import { useEffect, useRef, type CSSProperties, type RefObject } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

const SCREEN_MAX = 938;
const SCREEN_VW = 0.86;
/** First 10% of the hero track: scale holds (measured on apple.com/apple-tv-4k). */
const HOLD = 0.1;
/** Start and end of `z`'s range that `phone` (the `--hero-phone` slide-in) maps from — exported so consumers can gate off `z` itself instead of reading `phone` (a derived value) inside another motion value's 'change' listener, which can read stale within the same synchronous callback. */
export const PHONE_REVEAL_START = 0.82;
export const PHONE_REVEAL_END = 0.96;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
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
 * Frame shrinks from the sticky viewport to a 16:9 TV as the hero track
 * scrolls by, and the feature-highlight row below it reveals once the
 * frame has settled.
 *
 * Scroll position is measured with the same plain `scroll`-listener
 * approach as before (framer-motion's `useScroll` turned out not to track
 * this particular nested-sticky layout reliably), then run through
 * Motion's official `useSpring` — the "smooth scroll progress" half of
 * https://motion.dev/docs/react-scroll-animations#smooth-scroll-progress —
 * so the shrink has rubber-band tactility (a little lag/give while
 * scrolling, easing to a stop rather than snapping) instead of tracking
 * the scrollbar 1:1. Every other value (frame size, glow, the icon
 * group's reveal) derives from that same spring, so the frame and the
 * icon group clamp to one shared "how visible is the hero right now"
 * state instead of drifting out of sync.
 */
export function useHeroScale() {
  const trackRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  const rawZ = useMotionValue(0);
  // Damping is kept high enough that this settles without visibly
  // overshooting — see the clamp in the write effect below for why an
  // actual overshoot can't be allowed to reach the DOM (it'd feed
  // straight into --hero-frame-w/h and can briefly explode the frame to
  // an invalid size, corrupting layout/paint until it settles back).
  const z = useSpring(rawZ, { stiffness: 300, damping: 40, mass: 0.5 });

  const stageW = useMotionValue(0);
  const stageH = useMotionValue(0);
  // 1 while inside the hero track's own scroll range, easing down to 0.7
  // over one viewport-height of scroll past it — the shine dims by 30%
  // once you've scrolled past the hero section, still tracking scroll
  // rather than jumping straight to the floor.
  const shineFalloff = useMotionValue(1);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    const sticky = node.querySelector('.hero-sticky') as HTMLElement | null;
    const stageTarget = sticky ?? node;

    function measureStage() {
      stageW.set(stageTarget.clientWidth || window.innerWidth);
      stageH.set(stageTarget.clientHeight || window.innerHeight);
    }

    function measureScroll() {
      const viewportH = Math.max(1, window.innerHeight);
      const rect = node!.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - viewportH);
      const scrolled = clamp(-rect.top, 0, scrollable);
      rawZ.set(zoomProgress(scrolled / scrollable));

      const overshoot = Math.max(0, -rect.top - scrollable);
      const postT = clamp(overshoot / viewportH);
      shineFalloff.set(1 - 0.3 * postT);
    }

    measureStage();
    measureScroll();
    const observer = new ResizeObserver(measureStage);
    observer.observe(stageTarget);
    window.addEventListener('scroll', measureScroll, { passive: true });
    window.addEventListener('resize', measureScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', measureScroll);
      window.removeEventListener('resize', measureScroll);
    };
  }, [rawZ, stageW, stageH, shineFalloff]);

  const phone = useTransform(z, [PHONE_REVEAL_START, PHONE_REVEAL_END], [0, 1]);
  const glow = useTransform(z, [0.72, 0.92], [0, 1]);
  // Icon group + intro copy clamp to the same settled-frame state instead
  // of their own independent `animation-timeline: view()` — they finish
  // revealing exactly as the frame finishes shrinking.
  const iconOpacity = useTransform(z, [0.85, 1], [0, 1]);
  const iconShift = useTransform(z, [0.85, 1], [24, 0]);

  useEffect(() => {
    const node = trackRef.current;
    const root = node?.parentElement; // .hero-section — shared ancestor with .hero-intro
    if (!node || !root) return;

    function write() {
      const zVal = z.get();
      const zGeom = clamp(zVal);
      const sw = stageW.get();
      const sh = stageH.get();
      const screenW = Math.min(SCREEN_MAX, sw * SCREEN_VW);
      const screenH = screenW * (9 / 16);
      const frameW = sw + (screenW - sw) * zGeom;
      const frameH = sh + (screenH - sh) * zGeom;
      const showScale = frameW / Math.max(1, sw);

      // .hero-scale centers its child via flex, so .hero-scale sits
      // (sh - frameH) / 2 px above .hero-sticky's own bottom edge. Layered
      // on top of that: .hero-glow-image (hero.css) is `bottom: -25%;
      // height: 22%` of .hero-scale, so *its* top edge sits a further 3%
      // of frameH below .hero-scale's bottom (25% − 22%). Net distance from
      // .hero-sticky's bottom (where .hero-intro starts in normal flow,
      // once the sticky sequence releases) up to the glow image's top:
      // (sh - frameH) / 2 - 0.03 * frameH, i.e. sh/2 - 0.53*frameH.
      // .hero-intro's negative margin-top pulls it up by exactly that, so
      // its top edge lands flush with the glow image's top instead of
      // however far below it .hero-sticky's leftover flex gap happens to be.
      const introGap = sh / 2 - 0.53 * frameH;

      // .hero-track's own stylesheet rule declares a fallback `--hero-t: 0`
      // (for the pre-hydration/SSR frame) — a same-element declaration
      // always beats one inherited from an ancestor, so this has to be set
      // on `node` directly too, not just on `root`. --hero-bezel and the
      // frame's box-shadow are both computed from var(--hero-t) inside
      // .hero-track's own rule, so without this the border/shadow that's
      // supposed to grow in as the frame shrinks stays frozen at 0.
      node!.style.setProperty('--hero-t', zVal.toFixed(4));
      root!.style.setProperty('--hero-t', zVal.toFixed(4));
      node!.style.setProperty('--hero-stage-w', `${sw}px`);
      node!.style.setProperty('--hero-stage-h', `${sh}px`);
      node!.style.setProperty('--hero-frame-w', `${frameW.toFixed(2)}px`);
      node!.style.setProperty('--hero-frame-h', `${frameH.toFixed(2)}px`);
      node!.style.setProperty('--hero-show-scale', showScale.toFixed(4));
      node!.style.setProperty('--hero-phone', phone.get().toFixed(4));
      node!.style.setProperty('--hero-glow-opacity', glow.get().toFixed(4));
      root!.style.setProperty('--hero-icon-opacity', iconOpacity.get().toFixed(4));
      root!.style.setProperty('--hero-icon-shift', `${iconShift.get().toFixed(2)}px`);
      root!.style.setProperty('--hero-shine-falloff', shineFalloff.get().toFixed(4));
      root!.style.setProperty('--hero-intro-gap', `${introGap.toFixed(2)}px`);
      node!.dataset.heroSettled = zVal > 0.92 ? 'true' : 'false';
    }

    write();
    const unsubscribe = [z, stageW, stageH, shineFalloff].map((value) => value.on('change', write));
    return () => unsubscribe.forEach((unsub) => unsub());
  }, [z, stageW, stageH, shineFalloff, phone, glow, iconOpacity, iconShift]);

  const style = {
    '--hero-t': 0,
    '--hero-frame-w': '100%',
    '--hero-frame-h': '100%',
    '--hero-show-scale': 1,
    '--hero-phone': 0,
    '--hero-glow-opacity': 0,
  } as CSSProperties;

  return { trackRef, style, phone, z };
}
