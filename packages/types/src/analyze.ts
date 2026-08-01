import { z } from "zod/v3";

import { AnalysisStatusSchema } from "./enums.js";
import { ModelMetaSchema, TrustReportSchema } from "./trust-report.js";

/** UI + report output locale. Vietnamese is the product default. */
export const LocaleSchema = z.enum(["vi", "en"]);
export type Locale = z.infer<typeof LocaleSchema>;
export const DEFAULT_LOCALE: Locale = "vi";

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
  /** Page content language hint (BCP 47), if known */
  language: z.string().min(2).max(35).optional(),
  /** Preferred language for Trust Report prose + UI */
  locale: LocaleSchema.default(DEFAULT_LOCALE),
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
