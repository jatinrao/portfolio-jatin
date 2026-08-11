import "server-only";
import { chromium, type Browser } from "playwright";
import type { PdfGenerator } from "@/lib/pdf/pdf-generator";
import { PdfGenerationError } from "@/lib/shared/errors";

/**
 * Launching a full Chromium process per request is expensive (hundreds
 * of ms to seconds). A lazily-created, process-wide browser instance is
 * reused across requests; each request still gets its own isolated
 * BrowserContext + Page, so there's no shared mutable state between
 * requests — the API remains stateless from the caller's perspective.
 *
 * This is a private implementation detail of this one class. It doesn't
 * leak into the PdfGenerator interface, so a future implementation is
 * free to manage its own lifecycle differently (e.g. a stateless HTTP
 * call to an external rendering service).
 */
let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = chromium
      .launch({
        headless: true,
        // Uncomment if launch fails with something like "No usable
        // sandbox" — common in Docker/CI/serverless environments that
        // don't grant Chromium's sandbox the kernel privileges it wants.
        // Only add this if you've confirmed that's the actual failure;
        // it slightly weakens process isolation, so it shouldn't be on
        // by default.
        // args: ["--no-sandbox"],
      })
      .catch((err) => {
        // Allow the next request to retry launching instead of caching a
        // rejected promise forever.
        browserPromise = null;
        throw err;
      });
  }
  return browserPromise;
}

export class PlaywrightPdfGenerator implements PdfGenerator {
  async generate(html: string): Promise<Buffer> {
    let browser: Browser;
    try {
      browser = await getBrowser();
    } catch (err) {
      throw new PdfGenerationError("PDF rendering engine failed to start", err);
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // "load" is enough since all styles are inlined and there are no
      // external resources to wait on; fonts are handled explicitly below.
      await page.setContent(html, { waitUntil: "load" });

      // Ensure any @font-face fonts referenced in the stylesheet are fully
      // loaded before rasterizing — otherwise the PDF can be generated
      // with a fallback font mid-swap.
      await page.evaluate(() => document.fonts.ready);

      const pdfBytes = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        // Explicit even though `false` is Playwright's default: guards
        // against a future default change ever silently reintroducing
        // Chromium's own title/URL/date header-footer into the PDF.
        displayHeaderFooter: false,
      });

      return Buffer.from(pdfBytes);
    } catch (err) {
      throw new PdfGenerationError("Failed to render PDF", err);
    } finally {
      await page.close();
      await context.close();
    }
  }
}