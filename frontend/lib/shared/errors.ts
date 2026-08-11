import "server-only";

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "PDF_GENERATION_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly httpStatus: number;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, httpStatus: number, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.httpStatus = httpStatus;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super("VALIDATION_ERROR", message, 400, details);
  }
}

export class ResumeNotFoundError extends AppError {
  constructor(slug: string) {
    super("NOT_FOUND", `No resume found for slug "${slug}"`, 404);
  }
}

export class PdfGenerationError extends AppError {
  constructor(message = "Failed to generate PDF", cause?: unknown) {
    super("PDF_GENERATION_ERROR", message, 500);
    // Server-side diagnostic only — buildErrorBody() below never reads
    // `cause`, so this can safely hold the raw Playwright/Chromium error
    // (which may include local paths, stack traces, etc.) without it ever
    // reaching the client. Without this, the real failure reason was
    // being silently discarded before this error was thrown, leaving even
    // server logs with nothing more useful than "Failed to render PDF".
    if (cause !== undefined) {
      this.cause = cause;
    }
  }
}

/**
 * Normalizes any thrown value into an AppError. Unknown/native errors are
 * deliberately given a generic message here — the real error is logged
 * server-side by the caller, but never forwarded to the client, since it
 * may contain stack traces, file paths, or Sanity credentials.
 */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  return new AppError("INTERNAL_ERROR", "Internal server error", 500);
}

export interface ErrorResponseBody {
  error: {
    code: ErrorCode;
    message: string;
    requestId: string;
    details?: unknown;
  };
}

export function buildErrorBody(err: AppError, requestId: string): ErrorResponseBody {
  return {
    error: {
      code: err.code,
      message: err.message,
      requestId,
      // Only surface details for client-caused errors (validation).
      details: err.httpStatus < 500 ? err.details : undefined,
    },
  };
}