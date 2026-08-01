import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AnalyzeRequestSchema, AnalyzeResponseSchema } from "./analyze.js";
import { TrustReportSchema, type TrustReport } from "./trust-report.js";

function validSignal(overrides: Partial<TrustReport["signals"]["ai"]> = {}) {
  return {
    present: false,
    severity: "low" as const,
    explanation: "No concerning pattern detected for this signal.",
    evidenceSnippet: null,
    uncertain: false,
    ...overrides,
  };
}

function reportInput(overrides: Record<string, unknown> = {}) {
  return {
    trustScore: 62,
    confidence: 0.7,
    summary: "Mixed sourcing; verify the load-bearing statistics before citing.",
    reasons: [
      {
        id: "r1",
        signalType: "missing_source",
        summary: "Several statistics lack linked primary sources.",
        evidenceSnippet: null,
      },
    ],
    signals: {
      ai: validSignal(),
      clickbait: validSignal({
        present: true,
        severity: "medium",
        explanation: "Headline uses urgency language not matched in the body.",
      }),
      missingSource: validSignal({
        present: true,
        severity: "high",
        explanation: "Key claims omit citations.",
      }),
      missingAuthor: validSignal({
        present: true,
        severity: "medium",
        explanation: "No clear author byline found.",
      }),
    },
    claims: [
      {
        id: "c1",
        text: "The study showed a 40% increase.",
        type: "statistic",
        confidence: 0.6,
        snippet: null,
      },
    ],
    suggestions: [
      {
        id: "s1",
        action: "Find the original study or dataset behind the 40% figure.",
        rationale: "Statistics without primary sources are easy to misread.",
      },
    ],
    uncertainty: {
      summary: "Extraction covered the main article body only.",
      factors: ["Comments and sidebars were excluded"],
    },
    coverage: {
      ratio: 0.85,
      truncated: false,
      notes: null,
    },
    warnings: [],
    ...overrides,
  };
}

function validReport(overrides: Record<string, unknown> = {}): TrustReport {
  return TrustReportSchema.parse(reportInput(overrides));
}

describe("TrustReportSchema", () => {
  it("accepts a valid report", () => {
    const report = validReport();
    assert.equal(report.trustScore, 62);
    assert.equal(report.signals.missingSource.present, true);
  });

  it("rejects a score without reasons", () => {
    const result = TrustReportSchema.safeParse(
      reportInput({
        trustScore: 50,
        reasons: [],
      }),
    );
    assert.equal(result.success, false);
  });

  it("allows null score with empty reasons", () => {
    const report = validReport({
      trustScore: null,
      reasons: [],
      confidence: 0.2,
      summary: "Insufficient evidence to score confidently.",
    });
    assert.equal(report.trustScore, null);
  });
});

describe("AnalyzeRequestSchema", () => {
  it("accepts a valid request", () => {
    const parsed = AnalyzeRequestSchema.parse({
      requestId: "550e8400-e29b-41d4-a716-446655440000",
      url: "https://example.com/article",
      title: "Example Article",
      markdown: "# Hello\n\nBody text.",
      extensionVersion: "0.1.0",
      language: "en",
      extractedMeta: { author: "Ada", siteName: "Example" },
    });
    assert.match(parsed.url, /example\.com/);
  });
});

describe("AnalyzeResponseSchema", () => {
  it("requires report when status is ready", () => {
    const result = AnalyzeResponseSchema.safeParse({
      status: "ready",
      report: null,
      error: null,
      requestId: "550e8400-e29b-41d4-a716-446655440000",
      modelMeta: null,
    });
    assert.equal(result.success, false);
  });

  it("accepts ready with report", () => {
    const parsed = AnalyzeResponseSchema.parse({
      status: "ready",
      report: validReport(),
      error: null,
      requestId: "550e8400-e29b-41d4-a716-446655440000",
      modelMeta: {
        provider: "openrouter",
        model: "test-model",
        promptVersion: "analyze.v1",
      },
    });
    assert.equal(parsed.status, "ready");
  });

  it("requires error when status is error", () => {
    const result = AnalyzeResponseSchema.safeParse({
      status: "error",
      report: null,
      error: null,
      requestId: "550e8400-e29b-41d4-a716-446655440000",
      modelMeta: null,
    });
    assert.equal(result.success, false);
  });
});
