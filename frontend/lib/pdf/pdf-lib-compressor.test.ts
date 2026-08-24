// @vitest-environment node
//
// pdf-lib's Uint8Array/ArrayBuffer type checks don't play well with
// jsdom's separate realm (the shared "unit" project defaults to jsdom
// for component tests) — this file has no DOM dependency at all.
import { describe, it, expect } from "vitest";
import { PDFDocument } from "pdf-lib";
import { PdfLibCompressor } from "@/lib/pdf/pdf-lib-compressor";

async function buildFixturePdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([200, 200]);
  page.drawText("fixture");
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe("PdfLibCompressor", () => {
  it("returns a valid PDF buffer", async () => {
    const original = await buildFixturePdf();
    const compressed = await new PdfLibCompressor().compress(original);

    expect(compressed.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    // Re-parses cleanly — proves the output is still a well-formed PDF.
    await expect(PDFDocument.load(compressed)).resolves.toBeDefined();
  });

  it("falls back to the original buffer on unparsable input", async () => {
    const garbage = Buffer.from("not a pdf");
    const result = await new PdfLibCompressor().compress(garbage);
    expect(result).toBe(garbage);
  });
});
