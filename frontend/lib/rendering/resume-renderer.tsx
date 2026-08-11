import "server-only";
import { localize } from "@/lib/locale";
import type { ResumeModel } from "@/lib/resume/types";
import type { SupportedLanguage } from "@/lib/resume/validation";
import { ResumeDocument } from "@/components/resume/ResumeDocument";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders the shared ResumeDocument component — for a specific, already
 * resolved `lang` — to a static markup string and wraps it in a complete,
 * self-contained HTML document: no external stylesheet request, no
 * client-side JS, since this HTML only ever exists to be rasterized to a
 * PDF once.
 *
 * `renderToStaticMarkup` (not `renderToString`) is deliberate: it omits
 * hydration attributes, since this markup is never hydrated in a
 * browser — Playwright only needs to paint it once.
 *
 * Imported dynamically (not as a top-level `import`), combined with
 * `serverExternalPackages: ["react-dom"]` in next.config.ts: Next's App
 * Router blocks static imports of `react-dom/server` anywhere reachable
 * from `app/` (including Route Handlers), since its RSC pipeline uses a
 * separate internal renderer — surfacing as "You're importing a
 * component that imports react-dom/server." Both the config change and
 * this dynamic import are needed to fully suppress that restriction for
 * this legitimate, requirements-mandated use (React → HTML for a PDF,
 * not for RSC/hydration).
 */
export async function renderResumeToHtml(resume: ResumeModel, lang: SupportedLanguage): Promise<string> {
  const { renderToStaticMarkup } = await import("react-dom/server");

  const bodyMarkup = renderToStaticMarkup(<ResumeDocument resume={resume} lang={lang} />);
  const title = localize(resume.name, lang) || "Resume";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(title)} — Resume</title>
</head>
<body>
${bodyMarkup}
</body>
</html>`;
}