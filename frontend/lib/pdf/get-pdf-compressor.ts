import "server-only";
import type { PdfCompressor } from "@/lib/pdf/pdf-compressor";
import { PdfLibCompressor } from "@/lib/pdf/pdf-lib-compressor";

let instance: PdfCompressor | null = null;

/**
 * The only place that decides which PdfCompressor implementation is in
 * use. Mirrors get-pdf-generator.ts's factory pattern.
 */
export function getPdfCompressor(): PdfCompressor {
  if (!instance) {
    instance = new PdfLibCompressor();
  }
  return instance;
}
