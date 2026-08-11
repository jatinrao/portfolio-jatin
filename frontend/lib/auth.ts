import { UnauthorizedError } from "@/lib/errors";

/**
 * Minimal shared-secret auth. Client must send:
 *   Authorization: Bearer <TRANSLATE_API_SECRET>
 *
 * This is intentionally simple ("optional - for now") — swap for JWT/API
 * keys per-user/OAuth later without touching the rest of the pipeline.
 */
export function verifyAuth(headers: Headers): void {
  const expected = process.env.TRANSLATE_API_SECRET;

  // If no secret is configured, auth is effectively disabled (dev mode).
  if (!expected) return;

  const authHeader = headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing bearer token");
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!timingSafeEqual(token, expected)) {
    throw new UnauthorizedError("Invalid token");
  }
}

/** Constant-time string comparison to avoid timing side-channels. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
