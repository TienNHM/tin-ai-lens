import { z } from "zod";

export const AnalysisStatusSchema = z.enum(["ready", "insufficient", "error"]);

export const ClaimTypeSchema = z.enum([
  "factual_assertion",
  "opinion",
  "prediction",
  "statistic",
  "quote",
  "other",
]);

export const SignalSeveritySchema = z.enum(["low", "medium", "high"]);

export const ReasonSignalTypeSchema = z.enum([
  "ai",
  "clickbait",
  "missing_source",
  "missing_author",
  "source_quality",
  "claim_quality",
  "evidence",
  "rhetoric",
  "coverage",
  "other",
]);

export type AnalysisStatus = z.infer<typeof AnalysisStatusSchema>;
export type ClaimType = z.infer<typeof ClaimTypeSchema>;
export type SignalSeverity = z.infer<typeof SignalSeveritySchema>;
export type ReasonSignalType = z.infer<typeof ReasonSignalTypeSchema>;
