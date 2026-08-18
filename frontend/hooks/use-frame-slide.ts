/**
 * The sticky frame's content position, in room-units (0 = room 0 fully
 * settled, 1 = room 1 fully settled, etc, ramping smoothly through the
 * fractional values in between only during each boundary's transition).
 *
 * A plain function, not a hook — this is pure arithmetic over the numbers
 * useScrollProgress already tracks in React state, recomputed each render
 * along with everything else. No MotionValue/useTransform involved (see
 * useScrollProgress's own comment for why): this needs to be locked 1:1
 * to scroll, not eased/sprung, so there's nothing here that benefits from
 * framer's render-skipping machinery.
 *
 * The transition window is exactly `frameHeightPx` of scroll — not a
 * fraction of the (much taller, unrelated) text block's height, which is
 * what an earlier version got wrong: guessing a percentage of room-text
 * height from a screen recording gave a window disconnected from the
 * frame's own size, so the slide covered `frameHeightPx` of visual
 * distance over a different, mismatched number of scrolled pixels — not
 * actually aligned with scroll. Sizing the window to `frameHeightPx`
 * itself makes scrolling 1px move the frame content 1px during the
 * transition, by construction — a real 1:1 match, not a tuned guess.
 */
export function computeFramePos(scrolledPx: number, scrollablePx: number, count: number, frameHeightPx: number): number {
  const roomSpan = scrollablePx / count;
  const x = Math.min(count - 1e-6, Math.max(0, scrolledPx / roomSpan));
  const roomIndex = Math.floor(x);
  const intoRoom = x - roomIndex;

  const windowFrac = frameHeightPx > 0 ? Math.min(1, frameHeightPx / roomSpan) : 0;
  if (roomIndex < count - 1 && windowFrac > 0 && intoRoom > 1 - windowFrac) {
    const t = (intoRoom - (1 - windowFrac)) / windowFrac;
    return roomIndex + Math.min(1, Math.max(0, t));
  }
  return roomIndex;
}
