import { ParseError } from "@/lib/errors";
import type { OllamaGenerateResponse } from "@/types/translation";

/**
 * Extracts and cleans the translated text from a raw Ollama response.
 * Models sometimes wrap output in quotes or add a leading label
 * ("Translation:") despite instructions — strip those defensively.
 */
export function parseTranslationResponse(raw: OllamaGenerateResponse): string {
  if (!raw || typeof raw.response !== "string") {
    throw new ParseError("Ollama response missing 'response' field");
  }

  let text = raw.response.trim();

  if (text.length === 0) {
    throw new ParseError("Ollama returned an empty translation");
  }

  // Strip a leading "Translation:" / "Translated text:" style label.
  text = text.replace(/^(translation|translated text)\s*:\s*/i, "");

  // Strip wrapping quotes if the whole string is quoted.
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1);
  }

  return text.trim();
}
