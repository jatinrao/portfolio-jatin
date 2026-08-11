/**
 * CORS handling for browser clients on a different origin (e.g. the
 * Sanity Studio dev server on :3333 calling this API on :3000).
 *
 * Configure allowed origins via env:
 *   TRANSLATE_CORS_ORIGINS="http://localhost:3333,https://studio.example.com"
 *
 * Leave unset to allow no cross-origin requests (same-origin only).
 * Use "*" to allow any origin (fine for a local/internal tool; avoid in
 * production if the endpoint requires auth, since "*" cannot be combined
 * with credentials).
 */

const rawOrigins = process.env.TRANSLATE_CORS_ORIGINS ?? "";
const allowedOrigins = rawOrigins
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function resolveAllowedOrigin(requestOrigin: string | null): string | null {
  if (allowedOrigins.length === 0) return null;
  if (allowedOrigins.includes("*")) return "*";
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) return requestOrigin;
  return null;
}

/** Build CORS headers for a given request. Returns {} if origin isn't allowed. */
export function getCorsHeaders(requestOrigin: string | null): Record<string, string> {
  const allowOrigin = resolveAllowedOrigin(requestOrigin);
  if (!allowOrigin) return {};

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-request-id",
    "Access-Control-Max-Age": "86400",
    // Only needed if you send cookies; harmless with a specific origin,
    // but must be omitted when allowOrigin is "*".
    ...(allowOrigin !== "*" ? { "Access-Control-Allow-Credentials": "true" } : {}),
  };
}
