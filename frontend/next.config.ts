import type {NextConfig} from 'next'

// CSP's frame-ancestors only matches scheme+host+port — a source with a
// path (e.g. someone pasting the browser address bar's full Presentation
// URL, like https://www.sanity.io/@org/studio/<id>/default/presentation,
// into NEXT_PUBLIC_SANITY_STUDIO_URL) is invalid per the CSP grammar and
// gets silently dropped by the browser, leaving only 'self' — every
// Presentation iframe then gets blocked. Normalizing to origin-only here
// makes that mistake harmless instead of a silent production outage.
function toOrigin(url: string): string {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}

// The origin Sanity Studio's Presentation tool runs at — needs to be
// allowed to iframe this site for Visual Editing to work.
const studioUrl = toOrigin(process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333')

// Sanity also serves every project's Studio through its own hosted app
// shell at sanity.io/@<org>/studio/<project>/... — a fixed platform origin
// shared by all Sanity projects, not something specific to this deployment,
// so it's allowed unconditionally rather than pulled from env.
const SANITY_IO_ORIGIN = 'https://www.sanity.io'

// Cloudflare Pages has no server, so next/image's default `/_next/image`
// optimizer route (which the live Vercel deploy uses fine) 404s there.
// scripts/extract-static-for-cloudflare.ts self-hosts every Sanity image by
// rewriting the *already-rendered* static HTML after `next build`, but that
// only covers markup that actually got server-rendered — anything that
// mounts client-side only (e.g. RoomsSection's isMobile branch) falls
// through to a live `/_next/image` request and breaks. The custom loader
// (see lib/sanity-cf-image-loader.ts) fixes that by resolving straight to
// the self-hosted path on the client too, so it's only switched on for the
// Cloudflare build — the normal Vercel build keeps using Next's default
// loader, since it has a real server to back `/_next/image`.
const isCloudflareBuild = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'cloudflare'

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://cdn.sanity.io;
  font-src 'self';
  connect-src 'self' blob: https://*.api.sanity.io https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com;
  worker-src 'self' blob:;
  frame-ancestors 'self' ${studioUrl} ${SANITY_IO_ORIGIN};
`;



const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    ...(isCloudflareBuild
      ? { loader: 'custom' as const, loaderFile: './lib/sanity-cf-image-loader.ts' }
      : {}),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
  serverExternalPackages: ["playwright", "react-dom","vitest"],
  experimental: {
    // Inlines page CSS into <style> in <head> instead of render-blocking
    // <link> requests — this is a Tailwind (atomic CSS) site, exactly the
    // case Next's docs recommend it for: small per-page CSS, mostly
    // first-time visitors, so the "no cross-request caching" trade-off
    // barely applies. The CSP's `style-src 'self' 'unsafe-inline'` above
    // already allows inline <style>, so this doesn't need a CSP change.
    inlineCss: true,
  },
}

export default nextConfig
