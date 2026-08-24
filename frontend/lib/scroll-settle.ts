/**
 * Debounced "the user stopped scrolling" signal. Call `notify()` on every
 * scroll-driven frame; `onSettle` fires once `delay`ms have passed with no
 * further notifications — the moment to run a gentle snap-to-center
 * animation instead of fighting continuous scroll input. Used to keep the
 * skill river / experience timeline / project carousel panning perfectly
 * continuous (unnoticeable) while the user is actively scrolling, with the
 * "land on a whole card" correction happening only once, after they stop.
 */
export function createScrollSettle(onSettle: () => void, delay = 140) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const notify = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(onSettle, delay);
  };

  const cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };

  return { notify, cancel };
}
