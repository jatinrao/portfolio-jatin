"use client";

import { localSanityImagePath } from "./sanity-cf-image";

const SANITY_HOST = "cdn.sanity.io";

interface LoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Custom next/image loader used only for the Cloudflare static build (see
 * next.config.ts — gated on NEXT_PUBLIC_DEPLOY_TARGET=cloudflare). Needed
 * because scripts/extract-static-for-cloudflare.ts self-hosts every Sanity
 * image by rewriting the *already-rendered static HTML* after `next build`
 * — which only ever covers markup that was actually server-rendered.
 * Anything that mounts client-side only (e.g. RoomsSection's isMobile
 * branch, never present in the SSR output because useIsMobile defaults to
 * false on the server — see hooks/use-mobile.ts) instead fell through to
 * next/image's default behavior of generating a live `/_next/image?url=...`
 * request at render time — a route that only exists on a real Next.js
 * server, so it 404s on Cloudflare Pages. That's why projects/timeline
 * images disappeared on mobile but not desktop: desktop never unmounts and
 * remounts that subtree, so it keeps the rewritten markup from the initial
 * static HTML.
 *
 * Server-side (`typeof window === 'undefined'`, i.e. during `next build`'s
 * prerender pass): emit the exact same `/_next/image?url=...&w=...&q=...`
 * string Next's own default loader would, so the static HTML this produces
 * is byte-for-byte what extract-static-for-cloudflare.ts already knows how
 * to find and rewrite — no change needed there.
 *
 * Client-side: resolve straight to the self-hosted path instead. Every
 * Sanity <Image> in this app renders with the same `sizes`/`width` props
 * regardless of which branch mounts it, so this is always a filename the
 * build already downloaded for the server-rendered instance of the same
 * image — see sanity-cf-image.ts's doc comment for why the two sides agree.
 */
export default function cloudflareImageLoader({ src, width, quality }: LoaderParams): string {
  const q = quality ?? 75;

  let isSanity = false;
  try {
    isSanity = new URL(src).hostname === SANITY_HOST;
  } catch {
    isSanity = false; // relative/local path — not a Sanity URL
  }

  if (!isSanity) {
    // Local /public assets: same underlying problem, but every such <Image>
    // in this app already sets `unoptimized` by hand (see HeroSection.tsx)
    // since there's no generic way to self-host an unbounded set of local
    // paths here. This loader is a deliberate no-op for them either way —
    // `unoptimized` skips calling a loader at all, so this branch is only
    // ever reached by a stray non-Sanity, non-unoptimized <Image>, in which
    // case leaving `src` untouched matches Next's own "unknown host" loader
    // fallback rather than silently mis-optimizing it.
    return src;
  }

  if (typeof window === "undefined") {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
  }

  return localSanityImagePath(src, width, q);
}
