import type { TrustReport } from "@tin-ai-lens/types";

/** Normalize whitespace for fuzzy substring checks. */
export function normalizeForGrounding(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export function isSnippetGrounded(snippet: string, sourceMarkdown: string): boolean {
  if (!snippet.trim()) return false;
  const haystack = normalizeForGrounding(sourceMarkdown);
  const needle = normalizeForGrounding(snippet);
  if (needle.length < 8) {
    // Very short snippets: require exact normalized inclusion still
    return haystack.includes(needle);
  }
  return haystack.includes(needle);
}

function dropUngroundedSnippet<T extends { text: string }>(
  snippet: T | null | undefined,
  sourceMarkdown: string,
): T | null {
  if (!snippet) return null;
  return isSnippetGrounded(snippet.text, sourceMarkdown) ? snippet : null;
}

/**
 * Remove ungrounded evidence snippets. Does not invent replacements.
 * If a claim/reason only existed via bad snippet, keep text but drop snippet.
 */
export function groundTrustReport(
  report: TrustReport,
  sourceMarkdown: string,
): TrustReport {
  return {
    ...report,
    reasons: report.reasons.map((reason) => ({
      ...reason,
      evidenceSnippet: dropUngroundedSnippet(reason.evidenceSnippet, sourceMarkdown),
    })),
    claims: report.claims.map((claim) => ({
      ...claim,
      snippet: dropUngroundedSnippet(claim.snippet, sourceMarkdown),
    })),
    signals: {
      ai: {
        ...report.signals.ai,
        evidenceSnippet: dropUngroundedSnippet(
          report.signals.ai.evidenceSnippet,
          sourceMarkdown,
        ),
      },
      clickbait: {
        ...report.signals.clickbait,
        evidenceSnippet: dropUngroundedSnippet(
          report.signals.clickbait.evidenceSnippet,
          sourceMarkdown,
        ),
      },
      missingSource: {
        ...report.signals.missingSource,
        evidenceSnippet: dropUngroundedSnippet(
          report.signals.missingSource.evidenceSnippet,
          sourceMarkdown,
        ),
      },
      missingAuthor: {
        ...report.signals.missingAuthor,
        evidenceSnippet: dropUngroundedSnippet(
          report.signals.missingAuthor.evidenceSnippet,
          sourceMarkdown,
        ),
      },
    },
  };
}
