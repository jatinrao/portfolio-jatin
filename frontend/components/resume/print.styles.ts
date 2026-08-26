/**
 * The resume document's whole styling layer.
 *
 * Exported as a string so it can be embedded identically in both the
 * standalone HTML document handed to Playwright and the browser preview
 * page's <style> tag — one definition, two consumers.
 *
 * Two things live here that inline `style` objects genuinely cannot
 * express, which is why this file exists at all:
 *
 *   1. `@page`/`@media print` rules.
 *   2. Theme-conditional values. Inline styles have no way to say "this
 *      color in light mode, that one in dark", so every themed value is a
 *      custom property declared once on `.resume-root` and re-declared
 *      under `.dark .resume-root`. Components keep referencing
 *      `var(--…)` and theme for free.
 *
 * Tokens are scoped to `.resume-root` rather than `:root` on purpose:
 * `:root` here would out-specify (equal specificity, later source order)
 * globals.css's own `.dark` block and break the site chrome around the
 * document. Scoping also keeps it working in the PDF pipeline, where
 * `renderResumeToHtml` wraps this markup with no stylesheet at all — the
 * document's own outer element carries `.resume-root`, so every
 * `var(--color-*)` inline style still resolves.
 *
 * Visual language (glass panels, gloss sweep, accent section rules, chip
 * grids) follows the "Resume with glass material theme" Claude Design
 * project, whose iOS/iPadOS 27 kit is the same one globals.css was
 * imported from.
 */

/** Light-mode token values, reused verbatim by the print override. */
const LIGHT_TOKENS = /* css */ `
    --r-canvas: #eef1f6;
    --r-surface: #ffffff;
    /* Corner shines. The reference draws these as 34%×34% boxes with a
       diagonal gradient; a sized background layer does the same thing
       without an extra element, but its box edge lands mid-gradient and
       reads as a hard vertical seam down the page. Corner-anchored
       radials in absolute units fade out on their own and stay
       corner-sized however long the document runs. */
    --r-page-bg:
      radial-gradient(520px 360px at 0% 0%, rgba(255,255,255,0.45), transparent 70%),
      radial-gradient(520px 360px at 0% 100%, rgba(255,255,255,0.34), transparent 70%),
      radial-gradient(circle at 12% 8%, rgba(120,150,255,0.12), transparent 42%),
      radial-gradient(circle at 90% 12%, rgba(255,150,200,0.18), transparent 45%),
      radial-gradient(circle at 75% 88%, rgba(150,220,255,0.11), transparent 48%),
      radial-gradient(circle at 15% 90%, rgba(200,170,255,0.16), transparent 45%),
      linear-gradient(155deg, #f7f8fa 0%, #f1f2f6 55%, #eef1f6 100%);

    --r-text-primary: #000000;
    --r-text-secondary: rgba(60,60,67,0.6);
    --r-text-tertiary: rgba(60,60,67,0.35);
    --r-accent: #0071e3;
    --r-accent-orange: #ff8d28;
    --r-separator: rgba(0,0,0,0.12);

    --r-glass-bg: rgba(255,255,255,0.62);
    --r-glass-border: rgba(255,255,255,0.8);
    --r-glass-shadow:
      0 4px 12px rgba(30,30,60,0.08),
      inset 0 1px 0.5px rgba(255,255,255,0.85),
      inset 0 -1px 0.5px rgba(255,255,255,0.15);
    --r-inner-highlight: rgba(255,255,255,0.9);
    --r-chip-bg: rgba(255,255,255,0.7);
    --r-chiclet-bg: rgba(255,255,255,0.5);
    --r-gloss: rgba(255,255,255,0.55);

    /* Opaque stand-ins for the three translucent chip fills, used only
       under @media print — see the note beside their rules below for why
       the alpha has to go there. Each is the colour that chip already
       composites to over this palette's page gradient. */
    --r-chip-flat: #fafbfd;
    --r-chiclet-flat: #f8f9fc;
    --r-separator-flat: #dfe1e5;
`;

/** Dark-mode token values, reused verbatim by the dark PDF export. */
const DARK_TOKENS = /* css */ `
    --r-canvas: #0b0c10;
    --r-surface: #14151c;
    --r-page-bg:
      radial-gradient(520px 360px at 0% 0%, rgba(255,255,255,0.10), transparent 70%),
      radial-gradient(520px 360px at 0% 100%, rgba(255,255,255,0.08), transparent 70%),
      radial-gradient(circle at 12% 8%, rgba(90,120,255,0.14), transparent 42%),
      radial-gradient(circle at 90% 12%, rgba(255,100,170,0.10), transparent 45%),
      radial-gradient(circle at 75% 88%, rgba(80,190,255,0.12), transparent 48%),
      radial-gradient(circle at 15% 90%, rgba(160,120,255,0.10), transparent 45%),
      linear-gradient(155deg, #0e0f14 0%, #14151c 55%, #101218 100%);

    --r-text-primary: rgb(255,255,255);
    --r-text-secondary: rgba(235,235,245,0.7);
    --r-text-tertiary: rgba(235,235,245,0.4);
    --r-accent: #0091ff;
    --r-accent-orange: #ff9230;
    --r-separator: rgba(255,255,255,0.17);

    --r-glass-bg: rgba(32,34,42,0.66);
    --r-glass-border: rgba(255,255,255,0.16);
    --r-glass-shadow:
      0 4px 12px rgba(0,0,0,0.45),
      inset 0 1px 0.5px rgba(255,255,255,0.06);
    --r-inner-highlight: rgba(255,255,255,0.08);
    --r-chip-bg: rgba(255,255,255,0.14);
    --r-chiclet-bg: rgba(255,255,255,0.1);
    --r-gloss: rgba(255,255,255,0.14);

    --r-chip-flat: #2b2c34;
    --r-chiclet-flat: #26272f;
    --r-separator-flat: #3a3b43;
`;

/**
 * Print-only stand-ins for --r-page-bg's 7 stacked layers (2 corner-shine
 * radials + 4 accent-colour radials fading to transparent + 1 opaque
 * linear base) — see the note beside the print @media block below for
 * why those layers, cheap as a single paint on screen, are what actually
 * made the exported PDF slow to scroll: each fade-to-transparent radial
 * needs its own soft-mask transparency group in the PDF, ×7 layers ×
 * every page. A single opaque 3-stop linear gradient needs none of that
 * — one lightweight axial shading per page — while keeping the same
 * canvas tone the reference's base layer already established.
 *
 * STATIC_SHINE is the same 135° band the screen version animates (see
 * resume-gloss-sweep below), frozen at a single position instead of
 * sliding — used for reduced-motion screens. It used to also ride along
 * in FLAT_PAGE_BG_LIGHT/DARK for the PDF, but a Chrome DevTools trace on
 * an actual exported PDF (scrolled in Chromium's built-in PDF viewer,
 * not the browser preview — a different rendering path entirely, so the
 * transform/backdrop-filter fixes elsewhere in this file don't reach it)
 * showed sustained near-100% CPU during scroll. Multi-stop gradients
 * with a repeated-colour plateau (transparent/highlight/highlight/
 * transparent, like this one) don't fit a single PDF axial shading
 * function — Chromium's PDF writer splits them into several shading
 * patterns to reproduce the ramp exactly, so this one band was actually
 * costing 2 shading patterns per page, not the 1 "one soft mask" this
 * comment used to claim. Multiplied across every page a viewer
 * re-rasterizes on scroll, that's the kind of cost the trace caught.
 * Dropped from the PDF for exactly that reason; still animates fine on
 * screen, where it's GPU-composited rather than re-rasterized per page.
 */
const STATIC_SHINE = `linear-gradient(
    135deg,
    transparent 0%,
    rgba(255,255,255,0.03) 38%,
    var(--r-gloss) 47%,
    var(--r-gloss) 53%,
    rgba(255,255,255,0.03) 62%,
    transparent 100%
  )`;

const FLAT_PAGE_BG_LIGHT = `linear-gradient(155deg, #f7f8fa 0%, #f1f2f6 55%, #eef1f6 100%)`;
const FLAT_PAGE_BG_DARK = `linear-gradient(155deg, #0e0f14 0%, #14151c 55%, #101218 100%)`;

export const PRINT_STYLES = /* css */ `
  /* ───────────────────────────────────────────────────────────────────
   * TOKENS — light (default)
   *
   * The --color-* half of this block are aliases, not new roles: the rest
   * of the site's --color-* tokens come from a Tailwind v4 @theme block
   * (app/globals.css) that the PDF document never loads, so without these
   * every var(--color-*) in an inline style would resolve to nothing —
   * and per the custom-properties spec that makes the *whole* declaration
   * invalid at computed-value time (a missing --color-primary silently
   * collapsed "border: 0.53mm solid var(--color-primary)" to
   * border-style: none). Pointing them at the --r-* tokens means anything
   * still styled the old way themes along with everything else.
   * ─────────────────────────────────────────────────────────────────── */
  .resume-root {
${LIGHT_TOKENS}
    --r-radius-card: 10.5pt;
    --r-font: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;

    --color-surface: var(--r-surface);
    --color-on-surface: var(--r-text-primary);
    --color-on-surface-variant: var(--r-text-secondary);
    --color-primary: var(--r-accent);
    --color-on-primary: #ffffff;
    --color-secondary: var(--r-accent-orange);
    --color-secondary-fixed: var(--r-accent-orange);
    --color-outline: var(--r-separator);
    --color-outline-variant: var(--r-separator);
    --color-heading-ink: var(--r-text-primary);
    --color-muted-body: var(--r-text-secondary);
  }

  /* ───────────────────────────────────────────────────────────────────
   * TOKENS — dark. Driven by the same .dark class on <html> that
   * ThemeToggle already toggles for the rest of the site, so the resume
   * follows the visitor's existing preference instead of owning a second,
   * separate theme state.
   * ─────────────────────────────────────────────────────────────────── */
  .dark .resume-root {
${DARK_TOKENS}
  }

  /* ───────────────────────────────────────────────────────────────────
   * DOCUMENT SHELL
   * ─────────────────────────────────────────────────────────────────── */
  .resume-root {
    background: var(--r-canvas);
    color: var(--r-text-primary);
    font-family: var(--r-font);
  }

  .resume-root a { color: var(--r-accent); text-decoration: none; }

  /*
   * The A4 column. "overflow: hidden" is deliberately NOT set here — it
   * would collapse the document into a single unbreakable box and destroy
   * Chromium's pagination in the PDF pipeline. Everything the design
   * reference draws with absolutely-positioned overlay divs (page tint,
   * corner shines) is folded into --r-page-bg's layer list instead, so no
   * extra element needs clipping.
   */
  .resume-page {
    position: relative;
    background: var(--r-page-bg);
  }

  /* On screen the A4 column reads as a sheet floating on the canvas.
     Not rounded: the header bar is full-bleed, so rounding the sheet
     would need clipping that costs pagination on the print side of this
     same class — but this rule is screen-only, so the overflow:hidden
     below (needed for the gloss sweep, see its own comment) is free to
     live here without touching the print pipeline at all. */
  @media screen {
    .resume-root { min-height: 100vh; padding: 24px 16px 96px; }
    .resume-page { box-shadow: 0 18px 48px rgba(0,0,0,0.18); overflow: hidden; }
  }

  /*
   * Gloss sweep — a 135° band travelling corner to corner across the
   * whole sheet, matching the reference's .page-shine.
   *
   * Animated via transform, not the background-position this used to
   * slide: background-position/-size are paint properties — animating
   * them repaints the gradient (and, worse, forces every glass card's
   * backdrop-filter blur to re-sample its backdrop, since that backdrop
   * is repainting underneath it) on every single frame, competing with
   * the browser's own scroll compositing and reading as lag. transform
   * is compositor-only: the browser can slide this layer on the GPU
   * without repainting anything behind it.
   *
   * The oversized-box + translate technique is exactly what the very
   * first version of this comment said the print pipeline couldn't
   * afford (an overflow:hidden clipping ancestor breaks Chromium's PDF
   * pagination) — true for print, irrelevant for screen, so it's scoped
   * to the @media screen rule above instead of .resume-page itself.
   *
   * The math: a box sized 200%×200% of .resume-page, painted with this
   * same gradient at its own default (auto) sizing, covers exactly the
   * same 2×-page-size area the old background-size:200% 200% did.
   * Translating that box from (0%, 0%) to (-50%, -50%) of *its own*
   * size — i.e. by exactly one page-width/-height — slides the same
   * visible window across it that background-position 0%→100% used to,
   * pixel for pixel.
   */
  @keyframes resume-gloss-sweep {
    from { transform: translate(0%, 0%); }
    to   { transform: translate(-50%, -50%); }
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    .resume-page::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 200%;
      height: 200%;
      pointer-events: none;
      z-index: 0;
      background-image: ${STATIC_SHINE};
      background-repeat: no-repeat;
      animation: resume-gloss-sweep 16s cubic-bezier(0.25,0.1,0.25,1) infinite alternate;
    }
  }

  /*
   * Reduced-motion counterpart — without this, a visitor with the OS
   * setting on got no shine at all rather than a still one, since the
   * rule above is explicitly gated on "no-preference". Same band, no
   * animation and none of the 200%-oversized sizing that sliding needs:
   * a gradient with no explicit background-size already fills the box.
   */
  @media screen and (prefers-reduced-motion: reduce) {
    .resume-page::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image: ${STATIC_SHINE};
      background-repeat: no-repeat;
    }
  }

  /* Everything the document actually renders sits above the gloss. */
  .resume-page > * { position: relative; z-index: 1; }

  /* ───────────────────────────────────────────────────────────────────
   * GLASS MATERIAL — the one surface treatment every panel shares.
   * ─────────────────────────────────────────────────────────────────── */
  /*
   * No backdrop-filter here, on screen or in print. It was tried at full
   * strength, then at half the blur radius (see the removed
   * --r-glass-blur token's history if you need the exact values) — both
   * still lagged while scrolling, because the radius was never the real
   * cost. backdrop-filter has to capture and re-blur whatever's
   * rendered behind an element every time that backdrop changes, and for
   * a normal (non-fixed) element sitting in the document's own scroll
   * flow — every one of these dozen-plus cards — "what's behind it"
   * changes on literally every scroll frame, purely from the page
   * moving, independent of any other animation on the page. That's a
   * live recomputation for every card, every frame, for as long as the
   * visitor is scrolling — smaller radius shrinks the sampling kernel,
   * it doesn't remove the recomputation itself. Dropping the filter
   * removes the cost at its source; the translucent background alone
   * (plain alpha, composited once, cheap) still reads as a glass panel
   * over the page gradient.
   */
  .resume-surface {
    position: relative;
    background: var(--r-glass-bg);
    border: 0.5px solid var(--r-glass-border);
    box-shadow: var(--r-glass-shadow);
    border-radius: var(--r-radius-card);
  }

  /* ───────────────────────────────────────────────────────────────────
   * PAGE LAYOUT
   *
   * These are in the stylesheet rather than inline style objects for one
   * reason: inline styles beat every stylesheet rule regardless of
   * specificity, so a layout set inline can't be restacked by the
   * narrow-viewport media query at the bottom of this file.
   * ─────────────────────────────────────────────────────────────────── */

  /* Full-bleed identity bar. The glass material carries the separation
     from the body that the old accent rule used to, so no bottom border. */
  .resume-header-bar {
    display: flex;
    align-items: flex-start;
    gap: 16.5pt;
    padding: 16.5pt 21pt;
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
  }

  /* Wraps below the name column instead of being crushed to a 6-word
     ribbon once the bar runs out of room. */
  .resume-header-bio { flex: 1 1 220px; min-width: 220px; }

  .resume-name {
    margin: 0;
    font-size: 18.5pt;
    font-weight: 700;
    letter-spacing: -0.01em;
    white-space: nowrap;
    color: var(--r-text-primary);
  }

  .resume-headline {
    margin: 1.5pt 0 0;
    font-size: 10.5pt;
    font-weight: 600;
    white-space: nowrap;
    color: var(--r-accent);
  }

  .resume-columns {
    display: grid;
    grid-template-columns: 30% 70%;
    align-items: start;
  }

  .resume-rail { padding: 8mm 4.5mm 5mm 7mm; box-sizing: border-box; min-width: 0; }
  .resume-main { padding: 8mm 7mm 5mm 4.5mm; box-sizing: border-box; min-width: 0; }

  /* ───────────────────────────────────────────────────────────────────
   * SHARED PRIMITIVES
   * ─────────────────────────────────────────────────────────────────── */
  .resume-section-title {
    font-size: 10.5pt;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--r-accent);
    margin: 0 0 9pt;
    padding-bottom: 4.5pt;
    border-bottom: 1.1pt solid var(--r-accent);
  }

  .resume-icon-chip {
    width: 21pt;
    height: 21pt;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    background: var(--r-chip-bg);
    border: 0.5px solid var(--r-separator);
    color: var(--r-accent);
    box-shadow: inset 0 1px 0.5px var(--r-inner-highlight);
  }

  /*
   * @web-portfolio/icons' "github" glyph wraps its paths in
   * <g fill="#181616"> — a literal hardcoded near-black, unlike every
   * sibling icon here (Portfolio/Mail use fill="currentColor" on their
   * own paths, LinkedIn's path has no fill at all and inherits the SVG
   * root's), so GitHub was the one icon in this row that never picked up
   * the chip's accent-blue tint and stayed a near-invisible near-black
   * in dark mode instead. An attribute selector on "fill" beats an SVG
   * presentation attribute regardless of specificity (presentation
   * attributes sit below the UA stylesheet in the cascade), so this
   * repaints just that one <g> without touching the other icons, whose
   * own fill is already "currentColor".
   */
  .resume-icon-chip svg [fill]:not([fill="currentColor"]):not([fill="none"]) {
    fill: currentColor;
  }

  .resume-tag {
    display: inline-flex;
    align-items: center;
    padding: 2.25pt 6.75pt;
    border-radius: 100px;
    background: var(--r-chip-bg);
    border: 0.5px solid var(--r-separator);
    font-size: 7.5pt;
    font-weight: 500;
    color: var(--r-text-secondary);
    white-space: nowrap;
  }

  /* Skills rail: fixed three-up grid of icon-over-label chiclets. Now a
     real ul/li (Check 2 — skills read as a list to a parser, not a row of
     anonymous spans), so the UA's default list box/marker/indent needs
     resetting; the grid layout itself is unaffected since setting
     display:grid on the ul overrides its default list-item display
     entirely. */
  .resume-chiclet-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 4.5pt;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .resume-chiclet {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3pt;
    padding: 6pt 3pt;
    min-height: 39pt;
    box-sizing: border-box;
    border-radius: 7.5pt;
    background: var(--r-chiclet-bg);
    border: 0.5px solid var(--r-separator);
    box-shadow: inset 0 1px 0.5px var(--r-inner-highlight);
    text-align: center;
    color: var(--r-text-primary);
    font-size: 6.75pt;
    font-weight: 500;
    line-height: 1.15;
    overflow-wrap: anywhere;
  }

  .resume-role {
    padding: 9pt 10.5pt;
    margin-bottom: 6pt;
    border-radius: var(--r-radius-card);
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Company mark. Sized like the reference's initials avatar; the source
     is whatever logo Sanity has, so it's contained rather than cropped. */
  .resume-avatar {
    width: 19.5pt;
    height: 19.5pt;
    flex: none;
    box-sizing: border-box;
    border-radius: 6pt;
    padding: 1.5pt;
    object-fit: contain;
    background: var(--r-chip-bg);
    border: 0.5px solid var(--r-separator);
  }

  /* ───────────────────────────────────────────────────────────────────
   * NARROW VIEWPORTS
   *
   * Screen only — the printed document is always A4, so none of this
   * reaches the PDF. Below roughly a tablet the sheet is narrower than
   * the two-column split needs: the skills rail ends up at ~100px, which
   * is not enough for three chiclets across, and the bio ends up a
   * one-word-per-line ribbon beside the headshot.
   * ─────────────────────────────────────────────────────────────────── */
  @media screen and (max-width: 760px) {
    .resume-root { padding: 12px 10px 96px; }

    .resume-header-bar { flex-wrap: wrap; gap: 12pt; padding: 13.5pt 15pt; }
    .resume-name, .resume-headline { white-space: normal; }

    .resume-columns { grid-template-columns: minmax(0, 1fr); }
    .resume-rail { padding: 6mm 5mm 0; }
    .resume-main { padding: 4mm 5mm 5mm; }

    .resume-chiclet-grid { grid-template-columns: repeat(auto-fill, minmax(74px, 1fr)); }
  }

  /* ───────────────────────────────────────────────────────────────────
   * PRINT
   * ─────────────────────────────────────────────────────────────────── */
  /*
   * No page padding. The 8mm horizontal padding this used to carry was
   * what inset the sheet from the paper edge, and the design is
   * full-bleed — the header bar and page gradient are meant to run edge
   * to edge. The old "background: var(--color-surface)" went with it: the
   * tokens live on .resume-root, not in the page context, so it never
   * resolved to anything; the sheet's background comes from .resume-page.
   */
  @page {
    size: A4;
    margin: 0;
    padding: 0;
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      margin: 0;
    }

    a { color: inherit; text-decoration: none; }

    /* A printed resume is a light document regardless of what the reader
       happens to be browsing in, so the dark palette is pinned back to
       light here rather than exported to paper or PDF. */
    .resume-root, .dark .resume-root {
${LIGHT_TOKENS}
      --r-page-bg: ${FLAT_PAGE_BG_LIGHT};
    }

    /* ...unless dark was asked for explicitly. resume-renderer.tsx stamps
       data-pdf-theme="dark" on <html> for a "?theme=dark" export, which
       out-specifies the pin above (0,2,1 vs 0,2,0) and comes later, so
       the deliberate choice wins while an incidental Ctrl+P does not. */
    html[data-pdf-theme="dark"] .resume-root {
${DARK_TOKENS}
      --r-page-bg: ${FLAT_PAGE_BG_DARK};
    }

    /*
     * backdrop-filter is already off at the base rule above (screen and
     * print both), so there's nothing to re-disable here.
     *
     * box-shadow is what still needs flattening for print specifically:
     * --r-glass-shadow is three blurred layers, and a blurred shadow
     * can't be painted as a flat fill — Skia rasterizes it into its own
     * soft-mask transparency group per element. With one glass card per
     * header/experience/education/project entry, that's a dozen-plus
     * blur groups stacked on a page that already has several radial
     * gradients fading to transparent (each of those needs its own soft
     * mask too), and every extra group is something a PDF viewer has to
     * re-composite on scroll — that compounding, not the file size, was
     * what made the export laggy to scroll. The translucent *fill*
     * survives (plain alpha is one cheap graphics-state entry, not a
     * mask); only the blur goes.
     */
    .resume-surface {
      box-shadow: none;
    }

    /*
     * Every translucent fill becomes its own soft-mask transparency group
     * in the PDF — a full-page-width rasterized alpha band per element.
     * The chips are the bulk of them by count (~40 skill chiclets + ~30
     * skill tags + the contact row), and each one is a few-millimetre
     * shape sitting on a near-white gradient, so the alpha is buying
     * nothing on paper. Flattening them to the colour they already
     * composite to keeps the printed look and drops the groups, which is
     * what made the generated PDF slow to scroll in viewers.
     *
     * The larger .resume-surface panels keep their translucency — that
     * one genuinely reads as glass over the page gradient.
     */
    .resume-tag,
    .resume-icon-chip {
      background: var(--r-chip-flat);
      border-color: var(--r-separator-flat);
      box-shadow: none;
    }

    .resume-chiclet {
      background: var(--r-chiclet-flat);
      border-color: var(--r-separator-flat);
      box-shadow: none;
    }

    .resume-no-print { display: none !important; }
  }
`;
