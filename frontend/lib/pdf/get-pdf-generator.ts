import "server-only";
import type { PdfGenerator } from "@/lib/pdf/pdf-generator";
import { PlaywrightPdfGenerator } from "@/lib/pdf/playwright-pdf-generator";

let instance: PdfGenerator | null = null;

/**
 * The only place that decides which PdfGenerator implementation is in
 * use. To switch to Puppeteer, an external rendering service, or
 * anything else that satisfies the interface: write the new class next
 * to PlaywrightPdfGenerator and change the line below. Nothing in
 * app/api/resume/pdf/route.ts needs to change.
 */
export function getPdfGenerator(): PdfGenerator {
  if (!instance) {
    instance = new PlaywrightPdfGenerator();
  }
  return instance;
}
