/**
 * Shared between scripts/extract-static-for-cloudflare.ts (which downloads
 * every Sanity image variant into cf-static/_sanity-images/<hash>.<ext>
 * after `next build`) and lib/sanity-cf-image-loader.ts (the custom
 * next/image loader used only for the Cloudflare build). Both sides must
 * compute the exact same hash for the exact same (url, width, quality)
 * triple, or a client-side-only image mount (e.g. one that only exists
 * behind a useEffect-driven viewport check, never server-rendered) asks for
 * a filename the build step never downloaded.
 *
 * A non-cryptographic hash (not Node's `crypto`) is deliberate: the loader
 * half of this runs in the browser too, and a next/image loader must return
 * its URL synchronously — Web Crypto's `subtle.digest` is async, so Node's
 * crypto (sync, but Node-only) and Web Crypto (browser-only, but async) are
 * both unusable here. This only needs to be a stable, collision-unlikely
 * filename, not a security property.
 */

export function stableHash(input: string): string {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
}

export function extensionFromUrl(url: string): string {
  const match = new URL(url).pathname.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : "jpg";
}

/**
 * Builds the canonical Sanity CDN URL for a given display width/quality —
 * `w`+`q` set explicitly, `auto=format`/`fit=max` added if not already
 * present. This exact string (not the bare `originalUrl`) is what gets
 * hashed, so different sizes/qualities of the same source image get
 * different self-hosted filenames.
 */
export function normalizedSanityUrl(originalUrl: string, width: number, quality: number): string {
  const target = new URL(originalUrl);
  target.searchParams.set("w", String(width));
  target.searchParams.set("q", String(quality));
  if (!target.searchParams.has("auto")) target.searchParams.set("auto", "format");
  if (!target.searchParams.has("fit")) target.searchParams.set("fit", "max");
  return target.toString();
}

export const SANITY_LOCAL_IMAGE_DIR = "_sanity-images";

/**
 * The `/_sanity-images/<hash>.<ext>` path both the build-time download step
 * writes to and the client-side loader branch resolves straight to.
 */
export function localSanityImagePath(originalUrl: string, width: number, quality: number): string {
  const normalized = normalizedSanityUrl(originalUrl, width, quality);
  return `/${SANITY_LOCAL_IMAGE_DIR}/${stableHash(normalized)}.${extensionFromUrl(normalized)}`;
}
