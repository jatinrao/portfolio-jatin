/**
 * Translation engine abstraction.
 *
 * Calls the custom translation API (Next.js route handler backed by a
 * local Ollama model — see /api/translate) instead of talking to a
 * model provider directly from the browser.
 *
 * Required env vars:
 *
 *   SANITY_STUDIO_TRANSLATE_API_URL
 *     Full URL to the translate endpoint, e.g.
 *     "http://localhost:3000/api/translate" or your deployed URL.
 *
 *   SANITY_STUDIO_TRANSLATE_API_SECRET   (optional)
 *     Bearer token sent as `Authorization: Bearer <token>`. Only required
 *     if the API's TRANSLATE_API_SECRET is set server-side.
 *
 * If SANITY_STUDIO_TRANSLATE_API_URL is not set the function throws, so
 * the button will show an error state rather than silently doing nothing.
 */

export interface TranslateParams {
  text: string
  from: string      // BCP-47 language id, e.g. "en"
  to: string        // BCP-47 language id, e.g. "es"
  toTitle?: string  // Human-readable name (unused by the API; prompt building happens server-side)
}

interface TranslateApiSuccess {
  translatedText: string
  detectedSourceLang?: string
  model: string
  requestId: string
  durationMs: number
}

interface TranslateApiError {
  error: {
    code: string
    message: string
    requestId: string
    details?: unknown
  }
}

// ─── Internal helpers ──────────────────────────────────────────────────────

async function translateViaApi(params: TranslateParams): Promise<string> {
  const endpoint = process.env.SANITY_STUDIO_TRANSLATE_API_URL
  if (!endpoint) {
    throw new Error(
      'SANITY_STUDIO_TRANSLATE_API_URL is not set. ' +
      'Point it at your /api/translate endpoint, e.g. http://localhost:3000/api/translate',
    )
  }

  const secret = process.env.SANITY_STUDIO_TRANSLATE_API_SECRET

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (secret) {
    headers.Authorization = `Bearer ${secret}`
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      text: params.text,
      sourceLang: params.from,
      targetLang: params.to,
    }),
  })

  // console.log(`translateViaApi: ${response.status} ${response.statusText}`)
  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as Partial<TranslateApiError>
    throw new Error(err.error?.message ?? `HTTP ${response.status}`)
  }

  const data = await response.json() as TranslateApiSuccess
  if (!data.translatedText) throw new Error('Translate API returned no translatedText field')
  return data.translatedText
}

// ─── Public API ────────────────────────────────────────────────────────────

export async function translateText(params: TranslateParams): Promise<string> {
  return translateViaApi(params)
}