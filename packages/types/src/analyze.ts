import { z } from "zod";

import { AnalysisStatusSchema } from "./enums.js";
import { ModelMetaSchema, TrustReportSchema } from "./trust-report.js";

export const ExtractedMetaSchema = z.object({
  author: z.string().max(300).optional(),
  byline: z.string().max(500).optional(),
  siteName: z.string().max(300).optional(),
  publishedAt: z.string().max(100).optional(),
});

export const AnalyzeRequestSchema = z.object({
  requestId: z.string().uuid(),
  url: z.string().url(),
  title: z.string().min(1).max(500),
  markdown: z.string().min(1).max(200_000),
  language: z.string().min(2).max(35).optional(),
  extensionVersion: z.string().min(1).max(50),
  extractedMeta: ExtractedMetaSchema.optional(),
});

export const AnalyzeErrorSchema = z.object({
  code: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
});

export const AnalyzeResponseSchema = z
  .object({
    status: AnalysisStatusSchema,
    report: TrustReportSchema.nullable(),
    error: AnalyzeErrorSchema.nullable(),
    requestId: z.string().uuid(),
    modelMeta: ModelMetaSchema.nullable(),
  })
  .superRefine((val, ctx) => {
    if (val.status === "ready" && val.report === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "status ready requires a TrustReport",
        path: ["report"],
      });
    }

    if (val.status === "error" && val.error === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "status error requires an error object",
        path: ["error"],
      });
    }
  });

export type ExtractedMeta = z.infer<typeof ExtractedMetaSchema>;
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AnalyzeError = z.infer<typeof AnalyzeErrorSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
