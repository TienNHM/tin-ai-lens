import {
  AnalyzeResponseSchema,
  TrustReportObjectSchema,
  TrustReportSchema,
  type AnalyzeRequest,
  type AnalyzeResponse,
  type ModelMeta,
  type TrustReport,
} from "@tin-ai-lens/types";
import { generateObject, type LanguageModel } from "ai";

import { loadAiConfig, type AiRuntimeConfig } from "./config.js";
import { groundTrustReport } from "./grounding/snippets.js";
import { assertNoBannedPhrases } from "./policy/banned-phrases.js";
import {
  ANALYZE_PROMPT_VERSION,
  ANALYZE_REPAIR_HINT,
  ANALYZE_SYSTEM_PROMPT,
  buildAnalyzeUserPrompt,
} from "./prompts/analyze.v1.js";
import { createLanguageModel } from "./providers/create-model.js";
import { truncateMarkdown } from "./truncate.js";

export interface AnalyzeContentOptions {
  config?: AiRuntimeConfig;
  /** Inject model for tests; skips provider factory. */
  model?: LanguageModel;
}

function insufficientResponse(
  requestId: string,
  modelMeta: ModelMeta | null,
): AnalyzeResponse {
  return AnalyzeResponseSchema.parse({
    status: "insufficient",
    report: null,
    error: null,
    requestId,
    modelMeta,
  });
}

function errorResponse(
  requestId: string,
  code: string,
  message: string,
  modelMeta: ModelMeta | null,
): AnalyzeResponse {
  return AnalyzeResponseSchema.parse({
    status: "error",
    report: null,
    error: { code, message },
    requestId,
    modelMeta,
  });
}

function buildModelMeta(
  config: AiRuntimeConfig,
  usage?: { inputTokens?: number; outputTokens?: number },
  latencyMs?: number,
): ModelMeta {
  return {
    provider: config.provider,
    model: config.model,
    promptVersion: ANALYZE_PROMPT_VERSION,
    latencyMs,
    inputTokens: usage?.inputTokens,
    outputTokens: usage?.outputTokens,
  };
}

function applyCoverageHints(
  report: TrustReport,
  truncated: boolean,
  coverageRatio: number,
): TrustReport {
  const warnings = [...report.warnings];
  if (truncated && !warnings.some((w) => /truncat/i.test(w))) {
    warnings.push("Page content was truncated for analysis; coverage is partial.");
  }

  return {
    ...report,
    coverage: {
      ratio: Math.min(report.coverage.ratio, coverageRatio),
      truncated: truncated || report.coverage.truncated,
      notes: report.coverage.notes,
    },
    warnings,
  };
}

async function generateTrustReport(args: {
  model: LanguageModel;
  userPrompt: string;
  repair: boolean;
  abortSignal: AbortSignal;
}): Promise<{ object: unknown; usage?: { inputTokens?: number; outputTokens?: number } }> {
  const result = await generateObject({
    model: args.model,
    schema: TrustReportObjectSchema,
    system: ANALYZE_SYSTEM_PROMPT,
    prompt: args.repair
      ? `${ANALYZE_REPAIR_HINT}\n\n${args.userPrompt}`
      : args.userPrompt,
    abortSignal: args.abortSignal,
  });

  return {
    object: result.object,
    usage: {
      inputTokens: result.usage?.inputTokens,
      outputTokens: result.usage?.outputTokens,
    },
  };
}

function finalizeReport(raw: unknown, sourceMarkdown: string): TrustReport {
  assertNoBannedPhrases(raw);
  const parsed = TrustReportSchema.parse(raw);
  return groundTrustReport(parsed, sourceMarkdown);
}

/**
 * Analyze page content into an explainable Trust Report envelope.
 * Provider is selected via config/env — never hardcoded at the call site.
 */
export async function analyzeContent(
  request: AnalyzeRequest,
  options: AnalyzeContentOptions = {},
): Promise<AnalyzeResponse> {
  const config = options.config ?? loadAiConfig();
  const started = Date.now();

  const trimmed = request.markdown.trim();
  if (trimmed.length < config.minMarkdownChars) {
    return insufficientResponse(
      request.requestId,
      buildModelMeta(config, undefined, Date.now() - started),
    );
  }

  const truncated = truncateMarkdown(trimmed, config.maxMarkdownChars);
  const userPrompt = buildAnalyzeUserPrompt({
    url: request.url,
    title: request.title,
    markdown: truncated.markdown,
    language: request.language,
    extractedMeta: request.extractedMeta,
    truncated: truncated.truncated,
    coverageRatio: truncated.coverageRatio,
  });

  let model: LanguageModel;
  try {
    model = options.model ?? createLanguageModel(config);
  } catch (err) {
    return errorResponse(
      request.requestId,
      "provider_config",
      err instanceof Error ? err.message : "Provider configuration failed",
      buildModelMeta(config, undefined, Date.now() - started),
    );
  }

  const abortSignal = AbortSignal.timeout(config.timeoutMs);
  let lastUsage: { inputTokens?: number; outputTokens?: number } | undefined;

  try {
    let attempt = await generateTrustReport({
      model,
      userPrompt,
      repair: false,
      abortSignal,
    });
    lastUsage = attempt.usage;

    try {
      const report = applyCoverageHints(
        finalizeReport(attempt.object, truncated.markdown),
        truncated.truncated,
        truncated.coverageRatio,
      );
      return AnalyzeResponseSchema.parse({
        status: "ready",
        report,
        error: null,
        requestId: request.requestId,
        modelMeta: buildModelMeta(config, lastUsage, Date.now() - started),
      });
    } catch {
      // one repair attempt
      attempt = await generateTrustReport({
        model,
        userPrompt,
        repair: true,
        abortSignal,
      });
      lastUsage = attempt.usage;

      try {
        const report = applyCoverageHints(
          finalizeReport(attempt.object, truncated.markdown),
          truncated.truncated,
          truncated.coverageRatio,
        );
        return AnalyzeResponseSchema.parse({
          status: "ready",
          report,
          error: null,
          requestId: request.requestId,
          modelMeta: buildModelMeta(config, lastUsage, Date.now() - started),
        });
      } catch {
        return AnalyzeResponseSchema.parse({
          status: "insufficient",
          report: null,
          error: null,
          requestId: request.requestId,
          modelMeta: buildModelMeta(config, lastUsage, Date.now() - started),
        });
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    const timedOut =
      abortSignal.aborted || /timeout|aborted|AbortError/i.test(message);

    return errorResponse(
      request.requestId,
      timedOut ? "timeout" : "provider_error",
      timedOut
        ? "Analysis timed out. Please retry."
        : "Analysis provider failed. Please retry.",
      buildModelMeta(config, lastUsage, Date.now() - started),
    );
  }
}
