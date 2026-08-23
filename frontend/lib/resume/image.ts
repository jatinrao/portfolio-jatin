/**
 * Sanity's image CDN resizes on the fly from query parameters, and the
 * resume is where that matters most.
 *
 * The GROQ query dereferences `asset->{ url }`, which is the *original*
 * upload — for this resume that's a 2048x2048 PNG headshot rendered into
 * a ~100px circle. On screen the browser just downscales it, but the PDF
 * pipeline embeds whatever bitmap the page loaded, at its source
 * resolution and losslessly (Flate, since the source is a PNG). That one
 * image was 4.5 MB of a 5.3 MB PDF — 87% of the file — and re-compositing
 * it at every repaint is what made the PDF scroll badly in viewers.
 *
 * `auto=format` additionally lets the CDN serve WebP/JPEG instead of PNG,
 * so Chromium embeds a DCT-compressed stream rather than a lossless one.
 */

interface SizedImageOptions {
  /**
   * Pixel ratio to request above the display size, so the image still
   * looks sharp on retina screens and when a PDF viewer zooms in.
   */
  dpr?: number;
  /** Sanity CDN quality, 0-100. */
  quality?: number;
}

/**
 * Returns `url` with CDN sizing parameters for an image displayed at
 * `displayPx` CSS pixels. `fit=max` bounds the image by that size without
 * cropping or upscaling — cropping to shape (the circular headshot) is
 * left to the element's own `object-fit`, so this never has to know
 * whether a given asset is square.
 *
 * Non-Sanity and SVG URLs are returned untouched: an SVG has no raster
 * size to reduce, and appending parameters to a URL the CDN doesn't serve
 * would at best do nothing and at worst break the request.
 */
export function sizedImageUrl(
  url: string | undefined,
  displayPx: number,
  { dpr = 2, quality = 80 }: SizedImageOptions = {},
): string | undefined {
  if (!url) return url;
  if (!url.startsWith("https://cdn.sanity.io/")) return url;

  const [base] = url.split("?");
  if (base.endsWith(".svg")) return url;

  const size = Math.round(displayPx * dpr);
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}w=${size}&h=${size}&fit=max&auto=format&q=${quality}`;
}
