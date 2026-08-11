import type { TranslateRequestBody } from "@/types/translation";

/**
 * Builds the prompt sent to the local Ollama model. Kept isolated so you
 * can tune wording per-model (translategemma vs qwen) without touching
 * the rest of the service.
 */
export function buildTranslationPrompt(req: TranslateRequestBody): string {
  const { text, sourceLang, targetLang, formal } = req;

  const sourceClause = sourceLang === "auto" ? "the source language (auto-detect it)" : sourceLang;
  const toneClause = formal ? " Use a formal register." : "";

  // Instruct the model to return ONLY the translation, to keep response
  // parsing simple and deterministic.
  return [
    `Translate the following text from ${sourceClause} to ${targetLang}.`,
    `Return ONLY the translated text, with no explanations, quotes, or notes.${toneClause}`,
    "",
    "Text:",
    text,
  ].join("\n");
}

/** Picks the model to use: explicit override, else env default. */
export function resolveModel(req: TranslateRequestBody): string {
  return req.model ?? process.env.OLLAMA_DEFAULT_MODEL ?? "translategemma";
}
