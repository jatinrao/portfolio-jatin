/**
 * The only rules that genuinely cannot be expressed as inline React
 * styles: `@page` (page size/margins) and print-media page-break
 * guarantees as a belt-and-suspenders backup to the inline
 * `breakInside`/`pageBreakInside` styles already set on each entry.
 *
 * Everything else — colors, type, spacing — lives as inline `style`
 * objects on the components themselves, matching this project's existing
 * convention (see HeroSection.tsx) rather than a separate stylesheet.
 *
 * Exported as a string so it can be embedded identically in both the
 * standalone HTML document handed to Playwright and the browser preview
 * page's <style> tag — one definition, two consumers.
 */
export const PRINT_STYLES = /* css */ `
  @page {
    size: A4;
    padding: 0mm 8mm 0mm;
    background: var(--color-surface);
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      margin: 0;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
  }
`;
