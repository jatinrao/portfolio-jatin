import { buildTranslationPrompt, resolveModel } from "@/lib/prompt-builder";
import { generate } from "@/lib/ollama-client";
import { parseTranslationResponse } from "@/lib/response-parser";
import { logger } from "@/lib/logger";
import type { TranslateRequestBody, TranslateResult } from "@/types/translation";

export interface TranslateOptions {
  requestId: string;
  timeoutMs: number;
  signal?: AbortSignal;
}

export async function translate(
  req: TranslateRequestBody,
  { requestId, timeoutMs, signal }: TranslateOptions
): Promise<TranslateResult> {
  const startedAt = Date.now();
  const model = resolveModel(req);
  const prompt = buildTranslationPrompt(req);

  logger.debug("translation.prompt_built", { requestId }, { model, promptLength: prompt.length });

  const raw = await generate(
    {
      model,
      prompt,
      stream: false,
      options: { temperature: 0.2, top_p: 0.9 },
    },
    { timeoutMs, signal }
  );

  const translatedText = parseTranslationResponse(raw);
  const durationMs = Date.now() - startedAt;

  logger.info("translation.completed", { requestId }, { model, durationMs });

  return {
    translatedText,
    detectedSourceLang: req.sourceLang === "auto" ? undefined : req.sourceLang,
    model,
    requestId,
    durationMs,
  };
}
