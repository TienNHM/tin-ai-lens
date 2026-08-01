import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ModelMeta,
  TrustReport,
} from "@tin-ai-lens/types";

import {
  configFromUserKey,
  type AiRuntimeConfig,
  type ByokProviderName,
} from "./config.js";
import { groundTrustReport } from "./grounding/snippets.js";
import { assertNoBannedPhrases } from "./policy/banned-phrases.js";
import {
  ANALYZE_PROMPT_VERSION,
  ANALYZE_REPAIR_HINT,
  ANALYZE_SYSTEM_PROMPT,
  buildAnalyzeUserPrompt,
} from "./prompts/analyze.v1.js";
import { truncateMarkdown } from "./truncate.js";

/**
 * Browser-safe analyze path for extension BYOK.
 * Uses fetch only — no Vercel AI SDK, no Zod runtime (Plasmo/Parcel stubs zod broken).
 */

const JSON_OUTPUT_HINT = `Respond with a single JSON object only (no markdown fences) matching this shape:
{
  "trustScore": number|null,
  "confidence": number,
  "summary": string,
  "reasons": [{"id":string,"signalType":string,"summary":string,"evidenceSnippet":{"text":string,"startOffset":number|null,"endOffset":number|null}|null}],
  "signals": {
    "ai": {"present":boolean,"severity":"low"|"medium"|"high","explanation":string,"evidenceSnippet":object|null,"uncertain":boolean},
    "clickbait": same,
    "missingSource": same,
    "missingAuthor": same
  },
  "claims": [{"id":string,"text":string,"type":string,"confidence":number,"snippet":object|null}],
  "suggestions": [{"id":string,"action":string,"rationale":string}],
  "uncertainty": {"summary":string,"factors":[string]},
  "coverage": {"ratio":number,"truncated":boolean,"notes":string|null},
  "warnings": [string]
}`;

function insufficientResponse(
  requestId: string,
  modelMeta: ModelMeta | null,
): AnalyzeResponse {
  return {
    status: "insufficient",
    report: null,
    error: null,
    requestId,
    modelMeta,
  };
}

function errorResponse(
  requestId: string,
  code: string,
  message: string,
  modelMeta: ModelMeta | null,
): AnalyzeResponse {
  return {
    status: "error",
    report: null,
    error: { code, message },
    requestId,
    modelMeta,
  };
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
  locale: "vi" | "en",
): TrustReport {
  const warnings = [...report.warnings];
  if (truncated && !warnings.some((w) => /truncat|cắt ngắn/i.test(w))) {
    warnings.push(
      locale === "vi"
        ? "Nội dung trang đã bị cắt ngắn để phân tích; độ bao phủ chỉ một phần."
        : "Page content was truncated for analysis; coverage is partial.",
    );
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Soft structural check — avoids Zod in the Plasmo bundle. */
function softParseTrustReport(raw: unknown): TrustReport {
  if (!isRecord(raw)) {
    throw new Error("Report is not an object");
  }
  if (typeof raw.summary !== "string" || raw.summary.length < 1) {
    throw new Error("Report missing summary");
  }
  if (typeof raw.confidence !== "number") {
    throw new Error("Report missing confidence");
  }
  if (!isRecord(raw.signals) || !isRecord(raw.uncertainty) || !isRecord(raw.coverage)) {
    throw new Error("Report missing signals/uncertainty/coverage");
  }
  if (!Array.isArray(raw.reasons) || !Array.isArray(raw.claims) || !Array.isArray(raw.suggestions)) {
    throw new Error("Report missing reasons/claims/suggestions arrays");
  }
  if (raw.trustScore !== null && typeof raw.trustScore !== "number") {
    throw new Error("Invalid trustScore");
  }
  if (raw.trustScore !== null && raw.reasons.length < 1) {
    throw new Error("trustScore requires at least one reason");
  }
  if (!Array.isArray(raw.warnings)) {
    raw.warnings = [];
  }
  return raw as unknown as TrustReport;
}

function finalizeReport(raw: unknown, sourceMarkdown: string): TrustReport {
  assertNoBannedPhrases(raw);
  const parsed = softParseTrustReport(raw);
  return groundTrustReport(parsed, sourceMarkdown);
}

function parseJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  const body = (fenced?.[1] ?? trimmed).trim();
  return JSON.parse(body) as unknown;
}

async function callGoogle(args: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  abortSignal: AbortSignal;
}): Promise<{ text: string; usage?: { inputTokens?: number; outputTokens?: number } }> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(args.model)}:generateContent?key=${encodeURIComponent(args.apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: args.abortSignal,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: args.system }] },
      contents: [{ role: "user", parts: [{ text: args.user }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  const data = (await res.json()) as {
    error?: { message?: string };
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
    };
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `Gemini HTTP ${res.status}`);
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? "")
    .join("")
    .trim();
  if (!text) {
    throw new Error("Gemini returned empty content");
  }

  return {
    text,
    usage: {
      inputTokens: data.usageMetadata?.promptTokenCount,
      outputTokens: data.usageMetadata?.candidatesTokenCount,
    },
  };
}

async function callOpenAI(args: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  abortSignal: AbortSignal;
}): Promise<{ text: string; usage?: { inputTokens?: number; outputTokens?: number } }> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.apiKey}`,
    },
    signal: args.abortSignal,
    body: JSON.stringify({
      model: args.model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: args.system },
        { role: "user", content: args.user },
      ],
    }),
  });

  const data = (await res.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `OpenAI HTTP ${res.status}`);
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("OpenAI returned empty content");
  }

  return {
    text,
    usage: {
      inputTokens: data.usage?.prompt_tokens,
      outputTokens: data.usage?.completion_tokens,
    },
  };
}

async function generateRawJson(args: {
  config: AiRuntimeConfig;
  userPrompt: string;
  repair: boolean;
  abortSignal: AbortSignal;
}): Promise<{ object: unknown; usage?: { inputTokens?: number; outputTokens?: number } }> {
  const system = `${ANALYZE_SYSTEM_PROMPT}\n\n${JSON_OUTPUT_HINT}`;
  const user = args.repair
    ? `${ANALYZE_REPAIR_HINT}\n\n${args.userPrompt}`
    : args.userPrompt;

  const provider = args.config.provider;
  if (provider !== "google" && provider !== "openai") {
    throw new Error(`BYOK browser path only supports google|openai, got ${provider}`);
  }

  const result =
    provider === "google"
      ? await callGoogle({
          apiKey: args.config.apiKeys.google!,
          model: args.config.model,
          system,
          user,
          abortSignal: args.abortSignal,
        })
      : await callOpenAI({
          apiKey: args.config.apiKeys.openai!,
          model: args.config.model,
          system,
          user,
          abortSignal: args.abortSignal,
        });

  return {
    object: parseJsonObject(result.text),
    usage: result.usage,
  };
}

export interface BrowserAnalyzeOptions {
  config: AiRuntimeConfig;
}

/**
 * Analyze page content in the browser using the user's API key (BYOK).
 */
export async function analyzeContentInBrowser(
  request: AnalyzeRequest,
  options: BrowserAnalyzeOptions,
): Promise<AnalyzeResponse> {
  const config = options.config;
  const started = Date.now();

  const trimmed = request.markdown.trim();
  if (trimmed.length < config.minMarkdownChars) {
    return insufficientResponse(
      request.requestId,
      buildModelMeta(config, undefined, Date.now() - started),
    );
  }

  const truncated = truncateMarkdown(trimmed, config.maxMarkdownChars);
  const locale = request.locale ?? "vi";
  const userPrompt = buildAnalyzeUserPrompt({
    url: request.url,
    title: request.title,
    markdown: truncated.markdown,
    language: request.language,
    locale,
    extractedMeta: request.extractedMeta,
    truncated: truncated.truncated,
    coverageRatio: truncated.coverageRatio,
  });

  const abortSignal = AbortSignal.timeout(config.timeoutMs);
  let lastUsage: { inputTokens?: number; outputTokens?: number } | undefined;

  try {
    let attempt = await generateRawJson({
      config,
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
        locale,
      );
      return {
        status: "ready",
        report,
        error: null,
        requestId: request.requestId,
        modelMeta: buildModelMeta(config, lastUsage, Date.now() - started),
      };
    } catch {
      attempt = await generateRawJson({
        config,
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
          locale,
        );
        return {
          status: "ready",
          report,
          error: null,
          requestId: request.requestId,
          modelMeta: buildModelMeta(config, lastUsage, Date.now() - started),
        };
      } catch {
        return {
          status: "insufficient",
          report: null,
          error: null,
          requestId: request.requestId,
          modelMeta: buildModelMeta(config, lastUsage, Date.now() - started),
        };
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
        : `Analysis provider failed: ${message.slice(0, 280)}`,
      buildModelMeta(config, lastUsage, Date.now() - started),
    );
  }
}

export function analyzeWithUserKey(
  request: AnalyzeRequest,
  input: { provider: ByokProviderName; apiKey: string },
): Promise<AnalyzeResponse> {
  return analyzeContentInBrowser(request, {
    config: configFromUserKey(input),
  });
}
