/**
 * Centralized error types + mapping to HTTP responses.
 * Keeping errors typed lets the route handler translate any failure
 * in the pipeline into a consistent, safe API response.
 */

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "UPSTREAM_UNAVAILABLE"
  | "UPSTREAM_ERROR"
  | "PARSE_ERROR"
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

export class UnauthorizedError extends AppError {
  constructor(message = "Invalid or missing credentials") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class RateLimitedError extends AppError {
  readonly retryAfterSeconds: number;
  constructor(retryAfterSeconds: number) {
    super("RATE_LIMITED", "Too many requests", 429);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class TimeoutError extends AppError {
  constructor(message = "Upstream request timed out") {
    super("TIMEOUT", message, 504);
  }
}

export class UpstreamUnavailableError extends AppError {
  constructor(message = "Translation backend is unavailable") {
    super("UPSTREAM_UNAVAILABLE", message, 502);
  }
}

export class UpstreamError extends AppError {
  constructor(message: string, details?: unknown) {
    super("UPSTREAM_ERROR", message, 502, details);
  }
}

export class ParseError extends AppError {
  constructor(message = "Failed to parse model response") {
    super("PARSE_ERROR", message, 502);
  }
}

/**
 * Normalizes any thrown value into an AppError so the route handler
 * has one consistent shape to serialize.
 */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof Error && err.name === "AbortError") {
    return new TimeoutError();
  }

  if (err instanceof Error) {
    return new AppError("INTERNAL_ERROR", err.message, 500);
  }

  return new AppError("INTERNAL_ERROR", "Unknown error", 500);
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
      // Only leak details for client-caused errors (validation), never for
      // upstream/internal errors, to avoid exposing implementation details.
      details: err.httpStatus < 500 ? err.details : undefined,
    },
  };
}
