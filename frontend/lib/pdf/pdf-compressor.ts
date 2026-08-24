import "server-only";

/**
 * Abstraction the route/service layer depends on for shrinking a
 * generated PDF's file size. Mirrors `PdfGenerator`: any implementation
 * (pdf-lib today; Ghostscript or an external service tomorrow) only
 * needs to satisfy this one method, and nothing outside `lib/pdf/`
 * should ever import a specific compression library directly.
 */
export interface PdfCompressor {
  compress(pdf: Buffer): Promise<Buffer>;
}
