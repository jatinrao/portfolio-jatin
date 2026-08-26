import type {NextConfig} from 'next'

// The origin Sanity Studio's Presentation tool runs at — needs to be
// allowed to iframe this site for Visual Editing to work.
const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333'

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
  frame-ancestors 'self' ${studioUrl};
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
