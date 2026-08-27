import { NextResponse, type NextRequest } from "next/server";
import { getCorsHeaders } from "@/lib/cors";
import { locales, localeCookieName, defaultLocale, type Locale } from "@/i18n/config";
import { matchLocale, parseAcceptLanguage } from "@/i18n/matchLocale";
 
/**
 * Single middleware entry point, branching by concern:
 *
 * 1. /api/**  → CORS handling (unchanged from before).
 * 2. everything else → locale detection/redirect for the SSG [lang] routes.
 *
 * Next.js only allows one middleware.ts per project, so both live here
 * rather than as separate files — each branch is a pure function you can
 * read/test independently below.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
 
  if (pathname.startsWith("/api")) {
    return handleCors(request);
  }
 
  return handleLocaleRedirect(request);
}
 
/**
 * Central CORS handling for all API routes.
 *
 * - Domains are configured in one place (TRANSLATE_CORS_ORIGINS env var,
 *   see lib/cors.ts) — no route file needs CORS-specific code.
 * - Preflight OPTIONS requests are answered here directly, before the
 *   request ever reaches a route handler.
 * - Actual requests (POST/GET/etc.) get CORS headers attached to whatever
 *   response the route handler returns.
 */
function handleCors(request: NextRequest): NextResponse {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
 
  // Preflight: answer immediately, don't hit the route handler.
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }
 
  // Actual request: let it proceed, then stamp CORS headers onto the
  // response the route handler produces.
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}
 
/**
 * Locale detection for the SSG [lang] routes.
 *
 * WHY THIS RUNS IN MIDDLEWARE: app/[lang]/page.tsx is prerendered once per
 * locale at build time, so there's no request/browser context left to
 * inspect from inside the page by the time a visitor hits it. Middleware
 * runs per-request at the edge in front of that static HTML regardless of
 * the page's own rendering strategy, so it's the only place left that can
 * see *this visitor's* Accept-Language header and redirect them before the
 * static HTML is ever served.
 *
 * Only the bare `/` is redirected — any request already under `/en`, `/fr`,
 * etc. (or anything else) passes straight through untouched.
 */
function handleLocaleRedirect(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
 
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (pathnameHasLocale || pathname !== "/") {
    return NextResponse.next();
  }
 
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale: Locale =
    cookieLocale && (locales as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : matchLocale(parseAcceptLanguage(request.headers.get("accept-language")));

  // `/` now renders the same content as `/${defaultLocale}` directly (see
  // app/page.tsx) instead of being a redirect-only shell, so a visitor whose
  // detected locale is the default one already sees the right content here —
  // no redirect needed. Only an actual locale mismatch still redirects.
  if (locale === defaultLocale) {
    const response = NextResponse.next();
    response.cookies.set(localeCookieName, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  const redirectUrl = new URL(`/${locale}${request.nextUrl.search}`, request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
 
  return response;
}
 
export const config = {
  // Covers both /api/** (for CORS) and every page route (for locale
  // detection) in one matcher — skips Next internals and anything that
  // looks like a static file (has a dot in the last segment).
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
 