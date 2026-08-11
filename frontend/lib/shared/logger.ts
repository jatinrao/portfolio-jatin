import "server-only";

interface LogContext {
  requestId: string;
  [key: string]: unknown;
}

function writeLine(line: string, isError = false) {
  if (typeof process === "undefined") return;

  const stream = isError ? process.stderr : process.stdout;
  stream?.write(`${line}\n`);
}

function log(level: "info" | "warn" | "error", message: string, context: LogContext) {
  const entry = { level, message, timestamp: new Date().toISOString(), ...context };
  const line = JSON.stringify(entry);
  writeLine(line, level === "error");
}

export const logger = {
  info: (message: string, context: LogContext) => log("info", message, context),
  warn: (message: string, context: LogContext) => log("warn", message, context),
  error: (message: string, context: LogContext) => log("error", message, context),
};
