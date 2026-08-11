/**
 * Shared types for the translation API pipeline.
 */

export interface TranslateRequestBody {
  text: string;
  sourceLang: string; // e.g. "en", "auto"
  targetLang: string; // e.g. "fr"
  model?: string; // optional override, e.g. "translategemma" | "qwen2.5"
  formal?: boolean; // optional tone hint
}

export interface TranslateResult {
  translatedText: string;
  detectedSourceLang?: string;
  model: string;
  requestId: string;
  durationMs: number;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: false;
  options?: {
    temperature?: number;
    top_p?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason?: string;
  total_duration?: number;
}

export interface LogContext {
  requestId: string;
  [key: string]: unknown;
}
