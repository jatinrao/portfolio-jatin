import { z } from "zod";
import { ValidationError } from "@/lib/errors";
import type { TranslateRequestBody } from "@/types/translation";

// Basic ISO-639-1-ish check (2-3 lowercase letters) or "auto".
const langCode = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^(auto|[a-z]{2,3}(-[a-z]{2,4})?)$/, "Invalid language code");

export const translateRequestSchema = z.object({
  text: z
    .string()
    .min(1, "text must not be empty")
    .max(5000, "text must be 5000 characters or fewer"),
  sourceLang: langCode.default("auto"),
  targetLang: langCode,
  model: z.string().min(1).max(100).optional(),
  formal: z.boolean().optional(),
});

export function parseTranslateRequest(body: unknown): TranslateRequestBody {
  const result = translateRequestSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError("Invalid request body", result.error.flatten());
  }
  return result.data;
}
