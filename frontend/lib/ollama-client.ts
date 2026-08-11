import { TimeoutError, UpstreamError, UpstreamUnavailableError } from "@/lib/errors";
import type { OllamaGenerateRequest, OllamaGenerateResponse } from "@/types/translation";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";

export interface OllamaClientOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

/**
 * Calls the local Ollama /api/generate endpoint with a hard timeout.
 * Non-streaming for simplicity; swap `stream: true` + an async iterator
 * if you want to stream tokens back to the client later.
 */
export async function generate(
  request: OllamaGenerateRequest,
  options: OllamaClientOptions = {}
): Promise<OllamaGenerateResponse> {
  const { timeoutMs = 30_000 } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Allow an external abort (e.g. client disconnect) to also cancel.
  options.signal?.addEventListener("abort", () => controller.abort());

  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await safeReadText(res);
      throw new UpstreamError(`Ollama responded with status ${res.status}`, bodyText);
    }

    const data = (await res.json()) as OllamaGenerateResponse;
    return data;
  } catch (err) {
    if (err instanceof UpstreamError) throw err;

    if (err instanceof Error && err.name === "AbortError") {
      throw new TimeoutError(`Ollama request exceeded ${timeoutMs}ms timeout`);
    }

    // fetch throws TypeError on connection refused / DNS failure / etc.
    if (err instanceof TypeError) {
      throw new UpstreamUnavailableError(
        `Could not reach Ollama at ${OLLAMA_BASE_URL}. Is it running?`
      );
    }

    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function safeReadText(res: Response): Promise<string | undefined> {
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}
