import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { TrustReport } from "@tin-ai-lens/types";

import { groundTrustReport, isSnippetGrounded } from "./snippets.js";

describe("isSnippetGrounded", () => {
  it("matches normalized whitespace", () => {
    const ok = isSnippetGrounded(
      "Hello   world",
      "Intro\nHello world\nOutro",
    );
    assert.equal(ok, true);
  });

  it("rejects invented snippets", () => {
    assert.equal(isSnippetGrounded("totally invented claim text", "Hello world"), false);
  });
});

describe("groundTrustReport", () => {
  it("drops ungrounded snippets", () => {
    const report = {
      trustScore: null,
      confidence: 0.4,
      summary: "Limited evidence.",
      reasons: [
        {
          id: "r1",
          signalType: "evidence",
          summary: "Check sourcing.",
          evidenceSnippet: { text: "not in the page at all xyz" },
        },
      ],
      signals: {
        ai: {
          present: false,
          severity: "low",
          explanation: "No strong template signal.",
          uncertain: false,
        },
        clickbait: {
          present: false,
          severity: "low",
          explanation: "Headline is calm.",
          uncertain: false,
        },
        missingSource: {
          present: true,
          severity: "medium",
          explanation: "Sources are thin.",
          uncertain: false,
          evidenceSnippet: { text: "Sources are thin." },
        },
        missingAuthor: {
          present: false,
          severity: "low",
          explanation: "Author present.",
          uncertain: false,
        },
      },
      claims: [
        {
          id: "c1",
          text: "Claim text",
          type: "other",
          confidence: 0.5,
          snippet: { text: "Claim text" },
        },
      ],
      suggestions: [
        {
          id: "s1",
          action: "Find a primary source.",
          rationale: "Attribution is weak.",
        },
      ],
      uncertainty: { summary: "Partial page.", factors: [] },
      coverage: { ratio: 1, truncated: false },
      warnings: [],
    } as TrustReport;

    const grounded = groundTrustReport(
      report,
      "Author present. Sources are thin. Claim text appears here.",
    );

    assert.equal(grounded.reasons[0]?.evidenceSnippet, undefined);
    assert.ok(grounded.signals.missingSource.evidenceSnippet);
    assert.ok(grounded.claims[0]?.snippet);
  });
});
