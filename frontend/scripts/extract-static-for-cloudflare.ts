#!/usr/bin/env node
/**
 * extract-static-for-cloudflare.ts
 *
 * Run this AFTER a completely normal `next build` (the same build Vercel runs).
 * It does not read or modify next.config.ts/js, and does not require a second
 * `next build` invocation with different flags.
 *
 * It walks the existing .next output, finds routes that were pre-rendered as
 * pure static HTML (no ISR / revalidate), and copies just those + required
 * assets into ./cf-static, ready to upload to Cloudflare Pages. It also
 * pre-generates the resume PDF for every language/theme combination (the
 * Cloudflare deploy has no server, so it can't run the live `/api/resume/pdf`
 * route — see generateResumePdfs below) and writes those into ./cf-static too.
 *
 * Run with tsx (required — the PDF-generation step below imports .tsx
 * component modules, which plain Node's built-in TS support can erase types
 * from but can't transform JSX out of), preloading mock-server-only.cjs
 * (required — see that file's own comment for why) and loading .env.local
 * if present (unlike `next build`, a standalone tsx process doesn't load it
 * automatically; `--env-file-if-exists`, not `--env-file`, so this doesn't
 * hard-fail in CI environments that inject Sanity env vars directly instead
 * of via a physical .env.local file):
 *   NODE_OPTIONS="--require $(pwd)/scripts/mock-server-only.cjs" npx tsx --env-file-if-exists=.env.local scripts/extract-static-for-cloudflare.ts
 *   npx wrangler pages deploy cf-static --project-name=my-app
 *
 * (the `build:cf-static` npm script already wires all of this up)
 *
 * Prerequisites for the PDF step specifically:
 *   - Playwright's Chromium must be installed: `npx playwright install chromium`
 *   - The same Sanity env vars `next build` already needs (SSG also fetches
 *     Sanity at build time), so no additional env plumbing is required.
 */

import fs from "node:fs";
import path from "node:path";
import {
  SANITY_LOCAL_IMAGE_DIR,
  localSanityImagePath,
  normalizedSanityUrl,
} from "../lib/sanity-cf-image";
import { client } from "../sanity/lib/client";
import { RESUME_BY_SLUG_QUERY } from "../sanity/lib/queries";
import { ResumeMapper } from "../lib/resume/mapper";
import type { ResumeQueryResult } from "../lib/resume-query-result";
import type { ResumeModel } from "../lib/resume/types";
import { renderResumeToHtml } from "../lib/rendering/resume-renderer";
import { getPdfGenerator } from "../lib/pdf/get-pdf-generator";
import { getPdfCompressor } from "../lib/pdf/get-pdf-compressor";
import {
  DEFAULT_RESUME_SLUG,
  SUPPORTED_LANGUAGES,
  RESUME_THEMES,
} from "../lib/resume/validation";

const ROOT = process.cwd();
const NEXT_DIR = path.join(ROOT, ".next");
const OUT_DIR = path.join(ROOT, "cf-static");
const PUBLIC_DIR = path.join(ROOT, "public");

interface PrerenderRouteInfo {
  initialRevalidateSeconds?: number | false;
  srcRoute?: string | null;
  dataRoute?: string | null;
}

interface PrerenderManifest {
  version: number;
  routes: Record<string, PrerenderRouteInfo>;
  dynamicRoutes?: Record<string, unknown>;
}

function readJSON<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function copyFile(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDirRecursive(src: string, dest: string): void {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Hosts whose images already come pre-optimized/resizable from their own CDN.
// We download and self-host images from these instead of proxying through
// them at request time (avoids third-party cookies/connections entirely).
const EXTERNAL_IMAGE_CDN_HOSTS = ["cdn.sanity.io"];

// --- Self-hosting Sanity images instead of pointing at cdn.sanity.io ---
// Downloaded images are cached in a persistent directory OUTSIDE cf-static
// (which gets wiped on every clean build) so re-running the script doesn't
// re-download unchanged images every time.
const IMAGE_CACHE_DIR = path.join(ROOT, ".cache", "sanity-images");
const MAX_CONCURRENT_DOWNLOADS = 8;

// Filename hashing lives in lib/sanity-cf-image.ts, shared with
// lib/sanity-cf-image-loader.ts (the custom next/image loader used for the
// Cloudflare build) — both sides must land on the identical filename for
// the same (url, width, quality), or a client-side-only image mount (never
// present in this script's server-rendered HTML input) asks for a file
// this step never downloaded. See that module's doc comment for why.
async function downloadAndCacheImage(
  originalUrl: string,
  width: number,
  quality: number
): Promise<string | null> {
  const fetchUrl = normalizedSanityUrl(originalUrl, width, quality);
  const localPath = localSanityImagePath(originalUrl, width, quality);
  const filename = path.basename(localPath);
  const cachePath = path.join(IMAGE_CACHE_DIR, filename);

  if (!fs.existsSync(cachePath)) {
    try {
      const res = await fetch(fetchUrl);
      if (!res.ok) {
        console.warn(`   ! Failed to download image (${res.status}): ${fetchUrl}`);
        return null;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.mkdirSync(IMAGE_CACHE_DIR, { recursive: true });
      fs.writeFileSync(cachePath, buf);
    } catch (err) {
      console.warn(`   ! Error downloading image: ${fetchUrl} (${(err as Error).message})`);
      return null;
    }
  }

  const dest = path.join(OUT_DIR, localPath);
  copyFile(cachePath, dest);
  return localPath;
}

/** Runs async tasks with a concurrency cap so we don't open hundreds of
 *  simultaneous connections to Sanity at once. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/**
 * Finds every /_next/image?... reference pointing at a known Sanity URL,
 * downloads each unique (url + width + quality) variant, and returns a map
 * from the original matched substring to its new local path.
 */
async function buildImageDownloadMap(
  allContent: string[]
): Promise<Map<string, string>> {
  const NEXT_IMAGE_RE = /\/_next\/image\?[^"'\s]+/g;
  const uniqueMatches = new Set<string>();

  for (const content of allContent) {
    for (const match of content.matchAll(NEXT_IMAGE_RE)) {
      uniqueMatches.add(match[0]);
    }
  }

  const matchList = Array.from(uniqueMatches);
  const map = new Map<string, string>();

  await mapWithConcurrency(matchList, MAX_CONCURRENT_DOWNLOADS, async (match) => {
    const normalized = match.replace(/&amp;/g, "&");
    let parsed: URL;
    try {
      parsed = new URL(normalized, "https://placeholder.local");
    } catch {
      return;
    }
    const originalUrl = parsed.searchParams.get("url");
    if (!originalUrl) return;

    let target: URL;
    try {
      target = new URL(originalUrl);
    } catch {
      return; // relative/local asset — handled separately, not a download case
    }

    const isKnownCdn = EXTERNAL_IMAGE_CDN_HOSTS.some(
      (host) => target.hostname === host || target.hostname.endsWith(`.${host}`)
    );
    if (!isKnownCdn) return;

    const width = parsed.searchParams.get("w");
    if (!width) return;
    const quality = parsed.searchParams.get("q") ?? "75";

    const localPath = await downloadAndCacheImage(originalUrl, Number(width), Number(quality));
    if (localPath) map.set(match, localPath);
  });

  return map;
}

/**
 * Walks the output directory and rewrites Sanity image URLs in both static
 * HTML pages and any copied _next/data JSON (used for client-side nav) to
 * point at locally downloaded, self-hosted copies instead of cdn.sanity.io.
 */
async function rewriteImagesInOutputDir(dir: string): Promise<number> {
  function collectTargetFiles(d: string): string[] {
    let files: string[] = [];
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) files = files.concat(collectTargetFiles(full));
      else if (/\.(html|json)$/.test(entry.name)) files.push(full);
    }
    return files;
  }

  const targetFiles = collectTargetFiles(dir);
  const contents = targetFiles.map((f) => fs.readFileSync(f, "utf8"));

  const downloadMap = await buildImageDownloadMap(contents);

  let filesTouched = 0;
  targetFiles.forEach((file, i) => {
    const original = contents[i];
    const updated = original.replace(
      /\/_next\/image\?[^"'\s]+/g,
      (match) => downloadMap.get(match) ?? match
    );
    if (updated !== original) {
      fs.writeFileSync(file, updated, "utf8");
      filesTouched++;
    }
  });

  return filesTouched;
}

/**
 * Fetches and maps a resume the same way ResumeService/SanityResumeRepository
 * do (see lib/resume/service.ts), but via the plain `sanity/lib/client`
 * instead of `sanityFetch` (lib/resume/repository.ts's usual fetcher,
 * from sanity/lib/live.ts). `defineLive`'s live/draft-mode-aware fetch
 * only works inside Next's own React Server Component graph — it checks
 * for Node's "react-server" export condition, which is never set when
 * this script runs standalone via tsx, and throws
 * ("defineLive can't be imported by a client component") if used here.
 * The plain client has no such restriction and is already used the same
 * way in other build/generateStaticParams-time code (see
 * app/[lang]/projects/[slug]/page.tsx). `stega: false` for the same
 * reason repository.ts sets it: stega-encoded characters must never end
 * up in the PDF's text layer.
 */
async function fetchResumeForBuild(slug: string): Promise<ResumeModel> {
  const doc = await client.fetch<ResumeQueryResult | null>(
    RESUME_BY_SLUG_QUERY,
    { slug },
    { perspective: "published", stega: false }
  );
  if (!doc) {
    throw new Error(`Resume not found for slug "${slug}"`);
  }
  return ResumeMapper.toResumeModel(doc);
}

/**
 * Pre-generates the resume PDF for every supported language × theme
 * combination and writes them into OUT_DIR, since the Cloudflare deploy
 * has no server to run the live `/api/resume/pdf` route on. Reuses the
 * same renderer → generator → compressor pipeline that route uses (see
 * fetchResumeForBuild's doc comment for why fetching itself can't reuse
 * ResumeService) — this just calls it 12 times at build time instead of
 * once per request.
 *
 * The resume document itself only needs fetching once (it's the same
 * language-agnostic ResumeModel for every lang/theme combo), so it's
 * hoisted out of the loop.
 *
 * Naming (`<slug>-<lang>-<theme>.pdf`, under /resume/) is what
 * DownloadResumeButton's NEXT_PUBLIC_DEPLOY_TARGET=cloudflare branch
 * links to — keep the two in sync if either changes.
 */
async function generateResumePdfs(): Promise<void> {
  const slug = DEFAULT_RESUME_SLUG;
  const destDir = path.join(OUT_DIR, "resume");
  fs.mkdirSync(destDir, { recursive: true });

  console.log(
    `\nGenerating ${SUPPORTED_LANGUAGES.length * RESUME_THEMES.length} resume PDF(s) for slug "${slug}"...`
  );

  const resume = await fetchResumeForBuild(slug);
  const generator = getPdfGenerator();
  const compressor = getPdfCompressor();

  for (const lang of SUPPORTED_LANGUAGES) {
    for (const theme of RESUME_THEMES) {
      const html = await renderResumeToHtml(resume, lang, theme);
      const rawPdf = await generator.generate(html);
      const pdf = await compressor.compress(rawPdf);

      const dest = path.join(destDir, `${slug}-${lang}-${theme}.pdf`);
      fs.writeFileSync(dest, pdf);
      console.log(`   - ${slug}-${lang}-${theme}.pdf (${pdf.length} bytes)`);
    }
  }
}

async function main(): Promise<void> {
  const prerenderManifestPath = path.join(NEXT_DIR, "prerender-manifest.json");
  if (!fs.existsSync(prerenderManifestPath)) {
    console.error(
      "prerender-manifest.json not found. Did you run `next build` first?"
    );
    process.exit(1);
  }

  const manifest = readJSON<PrerenderManifest>(prerenderManifestPath);
  const routes = manifest.routes || {};

  // Split routes into pure-static (safe for Cloudflare) vs ISR (needs a server,
  // will just be a stale snapshot if served statically — skipped by default).
  const staticRoutes: string[] = [];
  const isrRoutes: string[] = [];

  for (const [route, info] of Object.entries(routes)) {
    if (info.initialRevalidateSeconds) {
      isrRoutes.push(route);
    } else {
      staticRoutes.push(route);
    }
  }

  if (isrRoutes.length) {
    console.warn(
      `Skipping ${isrRoutes.length} ISR route(s) (have revalidate set, need a server to stay fresh):`
    );
    isrRoutes.forEach((r) => console.warn(`   - ${r}`));
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Detect app dir vs pages dir output location
  const appServerDir = path.join(NEXT_DIR, "server", "app");
  const pagesServerDir = path.join(NEXT_DIR, "server", "pages");
  const usingAppDir = fs.existsSync(appServerDir);
  const sourceDir = usingAppDir ? appServerDir : pagesServerDir;

  let copiedCount = 0;
  const routeHandlerRoutes: string[] = [];

  // Route Handlers for metadata files (robots.txt, sitemap.xml, manifest.webmanifest,
  // etc.) aren't reliably listed in prerender-manifest.json's `routes` object — that
  // manifest is really built for ISR/revalidation bookkeeping, not a general file
  // index. So instead of relying on it, scan the app server dir directly for any
  // `.body` files and copy them by their own relative path.
  function findRouteHandlerFiles(dir: string, base = dir): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(findRouteHandlerFiles(full, base));
      } else if (entry.name.endsWith(".body")) {
        results.push(path.relative(base, full));
      }
    }
    return results;
  }

  if (usingAppDir) {
    const bodyFiles = findRouteHandlerFiles(sourceDir);
    for (const relBodyPath of bodyFiles) {
      // relBodyPath is e.g. "robots.txt.body" or "sitemap.xml.body"
      const relDestPath = relBodyPath.replace(/\.body$/, "");
      const src = path.join(sourceDir, relBodyPath);
      const dest = path.join(OUT_DIR, relDestPath);
      copyFile(src, dest);
      copiedCount++;
      routeHandlerRoutes.push(`/${relDestPath}`);
    }
  }

  for (const route of staticRoutes) {
    // route is like "/" or "/about" or "/blog/my-post"
    const clean = route === "/" ? "/index" : route;

    // Skip anything already handled by the direct .body scan above, so we
    // don't try (and fail) to treat it as an HTML page.
    if (routeHandlerRoutes.includes(route)) continue;

    const htmlCandidate = path.join(sourceDir, `${clean}.html`);
    const htmlIndexCandidate = path.join(sourceDir, clean, "index.html");

    let htmlSrc: string | null = null;
    if (fs.existsSync(htmlCandidate)) htmlSrc = htmlCandidate;
    else if (fs.existsSync(htmlIndexCandidate)) htmlSrc = htmlIndexCandidate;

    if (!htmlSrc) {
      console.warn(`   ! No static output found for ${route}, skipping`);
      continue;
    }

    const destRel =
      route === "/"
        ? "index.html"
        : path
            .join(clean.replace(/^\//, ""), "index.html")
            .replace(/index\/index\.html$/, "index.html");
    const dest = path.join(OUT_DIR, destRel);
    copyFile(htmlSrc, dest);
    copiedCount++;

    // Pages router also emits a matching .json for client-side navigation
    const jsonSrc = path.join(sourceDir, `${clean}.json`);
    if (fs.existsSync(jsonSrc)) {
      try {
        const buildIdPath = path.join(NEXT_DIR, "BUILD_ID");
        const buildId = fs.existsSync(buildIdPath)
          ? fs.readFileSync(buildIdPath, "utf8").trim()
          : "";
        const jsonDest = path.join(
          OUT_DIR,
          "_next",
          "data",
          buildId,
          `${clean}.json`
        );
        copyFile(jsonSrc, jsonDest);
      } catch {
        /* best-effort; safe to skip */
      }
    }
  }

  // Static assets (JS/CSS chunks) — always required for hydration
  copyDirRecursive(
    path.join(NEXT_DIR, "static"),
    path.join(OUT_DIR, "_next", "static")
  );

  // Anything in /public (favicons, images, robots.txt, etc.)
  copyDirRecursive(PUBLIC_DIR, OUT_DIR);

  // Download and self-host Sanity images (bypasses both the nonexistent
  // /_next/image optimizer endpoint AND avoids third-party cookies from
  // proxying live requests through cdn.sanity.io).
  const imagesRewritten = await rewriteImagesInOutputDir(OUT_DIR);
  if (imagesRewritten) {
    console.log(
      `Downloaded and self-hosted Sanity images in ${imagesRewritten} file(s)`
    );
  }

  // Cache headers for Cloudflare Pages
  fs.writeFileSync(
    path.join(OUT_DIR, "_headers"),
    "/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n"
  );

  // If a public/_redirects file has a catch-all SPA-style rule (e.g.
  // "/* /index.html 200"), it will intercept requests for real static files
  // like /robots.txt and /_next/static/*.js before Cloudflare ever looks for
  // the actual file — this is the same root cause as the "JS chunk served as
  // text/html" and "robots.txt looks like the homepage" issues.
  const redirectsPath = path.join(OUT_DIR, "_redirects");
  if (fs.existsSync(redirectsPath)) {
    const redirectsContent = fs.readFileSync(redirectsPath, "utf8");
    if (/^\s*\/\*\s+\/index\.html/m.test(redirectsContent)) {
      console.warn(
        "\n! _redirects has a catch-all '/* /index.html' rule.\n" +
          "  This will swallow requests for robots.txt, sitemap.xml, and JS chunks\n" +
          "  that aren't otherwise matched first. Add explicit exceptions above it, e.g.:\n" +
          "    /robots.txt        /robots.txt        200\n" +
          "    /sitemap.xml       /sitemap.xml        200\n" +
          "    /_next/*           /_next/:splat       200"
      );
    }
  }

  if (routeHandlerRoutes.length) {
    console.log(
      `Copied ${routeHandlerRoutes.length} route handler file(s): ${routeHandlerRoutes.join(", ")}`
    );
  }

  // robots.txt is important enough for SEO to fail loudly rather than
  // silently 404 (or worse, get caught by a catch-all redirect and served
  // as HTML, which is what "malformed robots.txt" usually means in practice).
  const robotsPath = path.join(OUT_DIR, "robots.txt");
  if (!fs.existsSync(robotsPath)) {
    console.warn(
      "\n! No robots.txt found in output. Falling back to a permissive default.\n" +
        "  Add app/robots.ts (App Router) or public/robots.txt to control this yourself."
    );
    fs.writeFileSync(
      robotsPath,
      "User-agent: *\nAllow: /\n"
    );
  } else {
    console.log(`robots.txt present at ${robotsPath}`);
  }

  console.log(`\nDone. Copied ${copiedCount} static route(s) into ${OUT_DIR}`);

  await generateResumePdfs();

  console.log(
    "\nDeploy with:  npx wrangler pages deploy cf-static --project-name=<your-project>"
  );
}

main()
  .then(() => {
    // generateResumePdfs() launches a process-wide Chromium instance
    // (see PlaywrightPdfGenerator) that's never explicitly closed — fine
    // in a long-lived server, but left open it'd keep this one-shot
    // script's Node process alive indefinitely.
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });