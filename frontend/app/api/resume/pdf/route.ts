import { NextRequest, NextResponse } from "next/server";
import { parseResumeQuery } from "@/lib/resume/validation";
import { getResumeService } from "@/lib/resume/service";
import { renderResumeToHtml } from "@/lib/rendering/resume-renderer";
import { getPdfGenerator } from "@/lib/pdf/get-pdf-generator";
import { toAppError, buildErrorBody } from "@/lib/shared/errors";
import { logger } from "@/lib/shared/logger";

// Playwright needs a full Node.js process — this route can never run on
// the Edge runtime.
export const runtime = "nodejs";

// Always regenerate: Sanity content can change between requests, and we
// never persist the PDF anywhere, so there is nothing safe to cache.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    // 1. Validate query params — slug AND lang
    const { slug, lang } = parseResumeQuery(request.nextUrl.searchParams);

    logger.info("resume_pdf.request_received", { requestId, slug, lang });

    // 2. Fetch + normalize (ResumeRepository -> ResumeMapper), once,
    //    language-agnostic — the same ResumeModel works for any lang.
    const resume = await getResumeService().getResume(slug);

    // 3. Render the shared React component to a standalone HTML document,
    //    resolving locale fields for the requested language.
    const html = await renderResumeToHtml(resume, lang);

    // 4. Hand the HTML to whichever PdfGenerator implementation is configured
    const pdfBuffer = await getPdfGenerator().generate(html);

    logger.info("resume_pdf.request_succeeded", { requestId, slug, lang });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${slug}-${lang}-resume.pdf"`,
        "Cache-Control": "private, no-store",
        "x-request-id": requestId,
      },
    });
  } catch (err) {
    const appError = toAppError(err);

    // `err` here is often the AppError itself (e.g. PdfGenerationError),
    // whose own `.message` is a deliberately generic wrapper string like
    // "Failed to render PDF" — the actually useful diagnostic detail is
    // one level deeper, in `.cause` (the raw Playwright/Sanity/etc. error
    // that caused it). Unwrap both so server logs show the real reason.
    const cause = err instanceof Error ? (err as { cause?: unknown }).cause : undefined;
    const causeMessage = cause instanceof Error ? cause.message : cause !== undefined ? String(cause) : undefined;

    logger.error("resume_pdf.request_failed", {
      requestId,
      code: appError.code,
      httpStatus: appError.httpStatus,
      // Logged server-side only — never sent to the client (see
      // buildErrorBody, which never reads `cause`).
      message: err instanceof Error ? err.message : String(err),
      cause: causeMessage,
    });

    return NextResponse.json(buildErrorBody(appError, requestId), {
      status: appError.httpStatus,
      headers: { "x-request-id": requestId },
    });
  }
}