"use strict";
/**
 * `import "server-only"` throws unconditionally when resolved as a plain
 * npm package (see node_modules/server-only/index.js) — it only no-ops
 * when a bundler sets Node's "react-server" export condition, which is
 * how Next.js's own webpack/turbopack build makes it safe there. This
 * script (extract-static-for-cloudflare.ts) runs standalone via tsx,
 * completely outside Next's bundler, so that condition is never set.
 *
 * Loaded via `node --require` before tsx starts, so it patches Node's
 * CJS resolver early enough to catch every `require("server-only")`
 * tsx performs on the script's behalf, redirecting it to the same
 * no-op stub the project's own vitest config already uses for the same
 * reason (see vitest.config.ts's `server-only` alias).
 *
 * Deliberately scoped to this one bare specifier — unlike setting
 * `--conditions=react-server` globally, which would also flip React's
 * own conditional exports to its stripped-down RSC-only build and break
 * anything importing ordinary "react".
 */
const Module = require("node:module");
const path = require("node:path");

const shimPath = path.join(__dirname, "..", "test", "server-only.ts");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function patchedResolveFilename(request, ...rest) {
  if (request === "server-only") {
    return shimPath;
  }
  return originalResolveFilename.call(this, request, ...rest);
};
