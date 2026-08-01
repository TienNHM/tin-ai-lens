import {
  BadRequestException,
  type PipeTransform,
} from "@nestjs/common";
import { AnalyzeRequestSchema, type AnalyzeRequest } from "@tin-ai-lens/types";
import type { ZodTypeAny } from "zod";

/**
 * Validates request bodies with Zod. Fail closed with a calm 400.
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodTypeAny) {}

  transform(value: unknown): AnalyzeRequest {
    const parsed = this.schema.safeParse(value);

    if (!parsed.success) {
      const message = parsed.error.issues
        .slice(0, 5)
        .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
        .join("; ");

      throw new BadRequestException({
        status: "error",
        error: {
          code: "validation_error",
          message: message || "Invalid analyze request",
        },
      });
    }

    return parsed.data as AnalyzeRequest;
  }
}

export function analyzeRequestPipe() {
  return new ZodValidationPipe(AnalyzeRequestSchema);
}
