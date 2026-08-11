import type { LogContext } from "@/types/translation";

/**
 * Minimal structured logger. Swap the console calls for pino/winston/
 * a log-drain client in production if you need more.
 */
type Level = "debug" | "info" | "warn" | "error";

function writeLine(line: string, isError = false) {
  if (typeof process === "undefined") return;

  const stream = isError ? process.stderr : process.stdout;
  stream?.write(`${line}\n`);
}

function log(level: Level, message: string, context: LogContext, extra?: Record<string, unknown>) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
    ...extra,
  };

  const line = JSON.stringify(entry);
  writeLine(line, level === "error");
}

export const logger = {
  debug: (message: string, context: LogContext, extra?: Record<string, unknown>) =>
    log("debug", message, context, extra),
  info: (message: string, context: LogContext, extra?: Record<string, unknown>) =>
    log("info", message, context, extra),
  warn: (message: string, context: LogContext, extra?: Record<string, unknown>) =>
    log("warn", message, context, extra),
  error: (message: string, context: LogContext, extra?: Record<string, unknown>) =>
    log("error", message, context, extra),
};
