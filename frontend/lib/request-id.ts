/**
 * Generates or forwards a request ID so calls can be traced end-to-end
 * across logs, error responses, and (if forwarded) the Ollama call.
 */
export function getOrCreateRequestId(headers: Headers): string {
  const incoming = headers.get("x-request-id");
  if (incoming && incoming.length <= 128) {
    return incoming;
  }
  return crypto.randomUUID();
}
