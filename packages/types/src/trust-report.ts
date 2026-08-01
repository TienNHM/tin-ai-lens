import { z } from "zod";

import {
  ClaimTypeSchema,
  ReasonSignalTypeSchema,
  SignalSeveritySchema,
} from "./enums.js";

export const EvidenceSnippetSchema = z.object({
  text: z.string().min(1).max(500),
  startOffset: z.number().int().nonnegative().optional(),
  endOffset: z.number().int().nonnegative().optional(),
});

export const TrustSignalSchema = z.object({
  /** Whether the signal condition appears present on this page */
  present: z.boolean(),
  severity: SignalSeveritySchema,
  /** Plain-language explanation — required; explain presence or absence */
  explanation: z.string().min(1).max(1000),
  evidenceSnippet: EvidenceSnippetSchema.optional(),
  /** Explicit uncertainty about this signal */
  uncertain: z.boolean().default(false),
});

export const TrustReasonSchema = z.object({
  id: z.string().min(1),
  signalType: ReasonSignalTypeSchema,
  summary: z.string().min(1).max(500),
  evidenceSnippet: EvidenceSnippetSchema.optional(),
});

export const ClaimSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(1000),
  type: ClaimTypeSchema,
  confidence: z.number().min(0).max(1),
  snippet: EvidenceSnippetSchema.optional(),
});

export const SuggestionSchema = z.object({
  id: z.string().min(1),
  action: z.string().min(1).max(300),
  rationale: z.string().min(1).max(500),
});

export const CoverageSchema = z.object({
  /** 0–1 estimate of how much of the page was considered */
  ratio: z.number().min(0).max(1),
  truncated: z.boolean(),
  notes: z.string().max(500).optional(),
});

export const UncertaintySchema = z.object({
  summary: z.string().min(1).max(1000),
  factors: z.array(z.string().min(1).max(300)).max(10),
});

export const ModelMetaSchema = z.object({
  provider: z.string().min(1),
  model: z.string().min(1),
  promptVersion: z.string().min(1),
  latencyMs: z.number().int().nonnegative().optional(),
  inputTokens: z.number().int().nonnegative().optional(),
  outputTokens: z.number().int().nonnegative().optional(),
});

export const TrustSignalsSchema = z.object({
  ai: TrustSignalSchema,
  clickbait: TrustSignalSchema,
  missingSource: TrustSignalSchema,
  missingAuthor: TrustSignalSchema,
});

export const TrustReportObjectSchema = z.object({
  trustScore: z.number().int().min(0).max(100).nullable(),
  confidence: z.number().min(0).max(1),
  summary: z.string().min(1).max(2000),
  reasons: z.array(TrustReasonSchema).max(12),
  signals: TrustSignalsSchema,
  claims: z.array(ClaimSchema).max(12),
  suggestions: z.array(SuggestionSchema).max(8),
  uncertainty: UncertaintySchema,
  coverage: CoverageSchema,
  warnings: z.array(z.string().min(1).max(300)).max(10),
});

export const TrustReportSchema = TrustReportObjectSchema.superRefine((val, ctx) => {
  if (val.trustScore !== null && val.reasons.length < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "trustScore requires at least one reason",
      path: ["reasons"],
    });
  }
});

export type EvidenceSnippet = z.infer<typeof EvidenceSnippetSchema>;
export type TrustSignal = z.infer<typeof TrustSignalSchema>;
export type TrustReason = z.infer<typeof TrustReasonSchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type Suggestion = z.infer<typeof SuggestionSchema>;
export type Coverage = z.infer<typeof CoverageSchema>;
export type Uncertainty = z.infer<typeof UncertaintySchema>;
export type ModelMeta = z.infer<typeof ModelMetaSchema>;
export type TrustSignals = z.infer<typeof TrustSignalsSchema>;
export type TrustReport = z.infer<typeof TrustReportSchema>;
