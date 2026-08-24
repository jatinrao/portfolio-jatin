import "server-only";
import { PDFDocument } from "pdf-lib";
import type { PdfCompressor } from "@/lib/pdf/pdf-compressor";

/**
 * Re-parses and re-serializes the Playwright-produced PDF via pdf-lib.
 * `save()` flate-compresses content streams and drops unreferenced
 * objects, which trims file size with no native binaries (Ghostscript
 * etc.) — important since this runs both in Vercel's Node function and
 * in the Cloudflare static build script, neither of which can rely on a
 * system Ghostscript install.
 *
 * This does NOT recompress embedded raster images (pdf-lib has no image
 * transcoder) — the resume's headshot is already served pre-compressed
 * by Sanity's CDN (see lib/resume/image.ts's `auto=format&q=80`), so the
 * remaining win here is stream/object overhead, not image weight.
 *
 * If compression ever fails (a malformed or unusual PDF pdf-lib can't
 * parse), the original buffer is returned rather than failing the whole
 * request — a slightly larger download beats no download.
 */
export class PdfLibCompressor implements PdfCompressor {
  async compress(pdf: Buffer): Promise<Buffer> {
    try {
      const doc = await PDFDocument.load(pdf);
      const bytes = await doc.save({ useObjectStreams: true });
      return Buffer.from(bytes);
    } catch {
      return pdf;
    }
  }
}
