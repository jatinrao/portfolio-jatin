import { NextRequest, NextResponse } from "next/server";
import { parseTranslateRequest } from "@/lib/validation";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";
import { verifyAuth } from "@/lib/auth";
import { getOrCreateRequestId } from "@/lib/request-id";
import { logger } from "@/lib/logger";
import { translate } from "@/lib/translation-service";
import { toAppError, buildErrorBody, RateLimitedError, ValidationError } from "@/lib/errors";

// Ollama runs locally over plain HTTP — this must run on the Node.js
// runtime (not Edge) to reach it.
export const runtime = "nodejs";

const REQUEST_TIMEOUT_MS = Number(process.env.TRANSLATE_TIMEOUT_MS ?? 30_000);

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request.headers);
  const startedAt = Date.now();

  // Overall request timeout, independent of the Ollama client's own
  // timeout, so slow JSON parsing/validation can't hang the request either.
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    logger.info("translate.request_received", { requestId }, {
      method: request.method,
      url: request.nextUrl.pathname,
    });

    // 1. Authentication (bearer secret token; no-op if unset)
    verifyAuth(request.headers);

    // 2. Rate limiting
    const clientKey = getClientKey(request.headers);
    const rateLimitResult = checkRateLimit(clientKey);
    if (!rateLimitResult.allowed) {
      throw new RateLimitedError(rateLimitResult.retryAfterSeconds);
    }

    // 3. Input validation
    const json = await request.json().catch(() => {
      throw new ValidationError("Request body must be valid JSON");
    });
    const body = parseTranslateRequest(json);

    logger.info("translate.request_validated", { requestId }, {
      targetLang: body.targetLang,
      sourceLang: body.sourceLang,
      textLength: body.text.length,
    });

    // 4. Call the translation service (prompt build -> Ollama -> parse)
    const result = await translate(body, {
      requestId,
      timeoutMs: REQUEST_TIMEOUT_MS,
      signal: controller.signal,
    });

    const totalDurationMs = Date.now() - startedAt;
    logger.info("translate.request_succeeded", { requestId }, { totalDurationMs });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "x-request-id": requestId,
        "x-ratelimit-remaining": String(rateLimitResult.remaining),
      },
    });
  } catch (err) {
    const appError = toAppError(err);
    const totalDurationMs = Date.now() - startedAt;

    logger.error("translate.request_failed", { requestId }, {
      code: appError.code,
      message: appError.message,
      httpStatus: appError.httpStatus,
      totalDurationMs,
    });

    const headers: Record<string, string> = { "x-request-id": requestId };
    if (appError instanceof RateLimitedError) {
      headers["retry-after"] = String(appError.retryAfterSeconds);
    }

    return NextResponse.json(buildErrorBody(appError, requestId), {
      status: appError.httpStatus,
      headers,
    });
  } finally {
    clearTimeout(timeoutHandle);
  }
}

// Reject other methods explicitly for a clean 405 instead of Next's default.
export async function GET() {
  return NextResponse.json(
    { error: { code: "METHOD_NOT_ALLOWED", message: "Use POST" } },
    { status: 405 }
  );
}
