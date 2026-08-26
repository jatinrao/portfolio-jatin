'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';
import { applySkillRiverProgress, invalidateSkillRiverTrackMetrics } from '@/lib/skill-room-filters';
import { getTimelineScrollBounds } from '@/context/timeline-scroll-context';
import type { RoomPlayback } from '@/context/room-playback-context';

const ENABLE_SLIDE_OUT = true;

const DEFAULT_PLAYBACK: RoomPlayback = { skillsProgress: 0, experienceProgress: 0, projectsProgress: 0 };

/**
 * Visible fraction of the TV screen below `clipY`. Progress is measured
 * against the screen rect (not the viewport) so the page color split
 * (room top) and the in-frame clip line share the same Y.
 */
export function clipProgress(clipY: number, stackTop: number, stackHeight: number) {
  const stackBottom = stackTop + stackHeight;
  if (clipY >= stackBottom) return 0;
  if (clipY <= stackTop) return 1;
  return (stackBottom - clipY) / stackHeight;
}

/**
 * Takes already-read `offsetHeight`/rect-top values rather than the
 * element itself — see the read-phase comment in `apply()` below for why
 * this can't read the DOM itself anymore.
 */
function settledInnerProgress(
  roomOffsetHeight: number,
  roomTop: number,
  enter: number,
  exit: number,
  stackTop: number,
  stackHeight: number,
) {
  if (enter < 1) return 0;
  if (exit > 0) return 1;
  const travel = Math.max(1, roomOffsetHeight - stackHeight);
  return Math.min(1, Math.max(0, (stackTop - roomTop) / travel));
}

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function setSlideOut(layer: HTMLDivElement, exit: number) {
  const panel = layer.querySelector<HTMLElement>('.tv-screen-panel');
  if (panel) {
    panel.style.transform = 'none';
    panel.style.transformOrigin = 'center center';
  }
  layer.style.transformOrigin = 'center center';
  layer.style.transform = `translate3d(0, ${-Math.min(1, Math.max(0, exit)) * 100}%, 0)`;
}

export function setWipe(
  layer: HTMLDivElement,
  scaleY: number,
  origin: 'top' | 'bottom',
) {
  const s = Math.min(1, Math.max(0, scaleY));
  const originValue = origin === 'top' ? 'center top' : 'center bottom';
  const panel = layer.querySelector<HTMLElement>('.tv-screen-panel');

  layer.style.transformOrigin = originValue;
  layer.style.transform = `matrix(1, 0, 0, ${s}, 0, 0)`;

  if (panel) {
    panel.style.transformOrigin = originValue;
    panel.style.transform =
      s < 0.001 ? 'matrix(1, 0, 0, 0, 0, 0)' : `matrix(1, 0, 0, ${1 / s}, 0, 0)`;
  }
}

/**
 * Apple TV rooms wipe, plus inner-room progress while a room is settled.
 * Extra article height is the hijack budget: skills → river pan
 * (one step per skill in the longest category row), experience →
 * timeline scroll. Then the next room's top starts the wipe.
 */
export function useRoomWipe(
  galleryRef: RefObject<HTMLElement | null>,
  slideOutEnabled = ENABLE_SLIDE_OUT,
  resetKey?: unknown,
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playback, setPlayback] = useState<RoomPlayback>(DEFAULT_PLAYBACK);

  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const stack = gallery.querySelector<HTMLElement>('.tv-screen-stack');
    const layers = [...gallery.querySelectorAll<HTMLDivElement>('.tv-screen')];
    const roomEls = [...gallery.querySelectorAll<HTMLElement>('[data-room-copy]')];
    if (!stack || layers.length === 0 || roomEls.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const last = layers.length - 1;
    let raf = 0;

    const apply = () => {
      // Read phase: capture every geometry read up front, before any
      // style/scroll writes below. The original shape of this function
      // interleaved a getBoundingClientRect()/offsetHeight read per room
      // with style writes from the *previous* room in the same forEach
      // pass — each subsequent read then forced the browser to
      // synchronously flush the prior write's layout impact instead of
      // batching it, once per room, every scroll frame. Reading
      // everything first (this only needs one flush, for the very first
      // read below) and writing everything after removes that thrashing.
      const stackBox = stack.getBoundingClientRect();
      const roomTops = roomEls.map((el) => el.getBoundingClientRect().top);
      const roomOffsetHeights = roomEls.map((el) => el.offsetHeight);

      let nextActive = 0;
      let skillsProgress = 0;
      let experienceProgress = 0;
      let projectsProgress = 0;
      let projectsReveal = 0;
      // Shine sweep progress for whichever room is currently entering —
      // one full 0→1 sweep per section as it wipes in, not a single sweep
      // tied to overall gallery scroll (a continuous scroll-driven sweep
      // read as one shine "spread thin" across the whole skills/
      // experience/projects journey rather than a per-section moment).
      // Defaults to 1 (steady, fully revealed) when no room is mid-
      // transition, so the shine doesn't disappear between sections.
      let activeShineT = 1;

      layers.forEach((layer, index) => {
        const roomEl = roomEls[index];
        if (!roomEl) return;

        const enter =
          index === 0
            ? 1
            : clipProgress(roomTops[index], stackBox.top, stackBox.height);

        const nextRoom = roomEls[index + 1];
        const exit =
          index < last && nextRoom
            ? clipProgress(roomTops[index + 1], stackBox.top, stackBox.height)
            : 0;

        if (enter >= 0.5) nextActive = index;
        if (enter > 0 && enter < 1) activeShineT = enter;

        const settled = enter >= 1 && exit <= 0;
        layer.style.pointerEvents = settled ? 'auto' : 'none';

        const inner = settledInnerProgress(
          roomOffsetHeights[index],
          roomTops[index],
          enter,
          exit,
          stackBox.top,
          stackBox.height,
        );
        const kind = roomEl.dataset.roomKind;
        if (kind === 'projects') {
          projectsReveal = Math.min(1, Math.max(0, enter));
          projectsProgress = inner;
        }
        if (kind === 'skills') {
          skillsProgress = inner;
          const lanes = layer.querySelector<HTMLElement>('.skill-river-lanes');
          const clip = lanes ?? layer.querySelector<HTMLElement>('.skill-river-overflow');
          if (clip) {
            applySkillRiverProgress(clip, inner);
          }
        }
        if (kind === 'experience') {
          experienceProgress = inner;
          const scroller = layer.querySelector<HTMLElement>('.timeline-scroll');
          if (scroller) {
            // Same start/max convention as TimelineScrollProvider and the
            // glass slider's drag math (context/timeline-scroll-context.tsx)
            // — all three have to agree on what "all the way left" means.
            const { start, max } = getTimelineScrollBounds(scroller);
            const travel = Math.max(0, max - start);
            if (travel > 0) scroller.scrollLeft = start + inner * travel;
          }
        }

        if (reduced) {
          const shown = enter >= 0.5 && exit < 0.5;
          setWipe(layer, shown ? 1 : 0, shown ? 'bottom' : 'top');
          return;
        }

        const enterEased = smoothstep(enter);
        const exitEased = smoothstep(exit);

        if (exit > 0 && enter >= 1) {
          if (slideOutEnabled) {
            setSlideOut(layer, exitEased);
          } else {
            setWipe(layer, 1 - exitEased, 'top');
          }
          return;
        }

        setWipe(layer, enterEased, 'bottom');
      });

      gallery.style.setProperty('--room-projects-t', String(projectsReveal));
      gallery.style.setProperty('--rooms-shine-t', activeShineT.toFixed(4));

      setActiveIndex((current) => (current === nextActive ? current : nextActive));
      const activeKind = roomEls[nextActive]?.dataset.roomKind;
      setPlayback((current) => {
        if (
          Math.abs(current.skillsProgress - skillsProgress) < 0.002 &&
          Math.abs(current.experienceProgress - experienceProgress) < 0.002 &&
          Math.abs((current.projectsProgress ?? 0) - projectsProgress) < 0.002 &&
          current.activeKind === activeKind
        ) {
          return current;
        }
        return { skillsProgress, experienceProgress, projectsProgress, activeKind };
      });
    };

    apply();
    const onScrollOrResize = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };
    const onResize = () => {
      invalidateSkillRiverTrackMetrics();
      onScrollOrResize();
    };
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onResize);
    };
  }, [galleryRef, slideOutEnabled, resetKey]);

  return { activeIndex, playback };
}
