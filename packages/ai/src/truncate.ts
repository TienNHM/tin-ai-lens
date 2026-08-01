export interface TruncateResult {
  markdown: string;
  truncated: boolean;
  coverageRatio: number;
  originalLength: number;
}

/**
 * Cap markdown size for the LLM while recording coverage impact.
 */
export function truncateMarkdown(
  markdown: string,
  maxChars: number,
): TruncateResult {
  const originalLength = markdown.length;
  if (originalLength <= maxChars) {
    return {
      markdown,
      truncated: false,
      coverageRatio: 1,
      originalLength,
    };
  }

  const sliced = markdown.slice(0, maxChars);
  // Prefer cutting at a paragraph boundary when possible
  const lastBreak = Math.max(sliced.lastIndexOf("\n\n"), sliced.lastIndexOf("\n"));
  const markdownOut =
    lastBreak > maxChars * 0.6 ? sliced.slice(0, lastBreak).trimEnd() : sliced;

  return {
    markdown: markdownOut,
    truncated: true,
    coverageRatio: Math.min(1, markdownOut.length / originalLength),
    originalLength,
  };
}
