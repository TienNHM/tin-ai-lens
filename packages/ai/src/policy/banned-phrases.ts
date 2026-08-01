/** Verdict-style patterns forbidden in user-facing AI output (en + vi). */
export const BANNED_PHRASE_PATTERNS: RegExp[] = [
  /\bthis is fake\b/i,
  /\bthis is true\b/i,
  /\bthis is false\b/i,
  /\bthis is ai[- ]generated\b/i,
  /\bthis is ai\b/i,
  /\bthis was written by ai\b/i,
  /\bai detected\b/i,
  /\bconfirmed propaganda\b/i,
  /\bdisinformation confirmed\b/i,
  /\byou should believe\b/i,
  /\byou must ignore\b/i,
  /đây là tin giả/i,
  /đây là thật/i,
  /đây là sai/i,
  /đây là giả/i,
  /được tạo bởi ai/i,
  /do ai viết/i,
  /phát hiện ai/i,
  /tuyên truyền đã xác nhận/i,
  /bạn nên tin/i,
  /bạn phải bỏ qua/i,
];

export interface PolicyHit {
  pattern: string;
  excerpt: string;
}

function collectText(value: unknown, bag: string[]): void {
  if (typeof value === "string") {
    bag.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectText(item, bag);
    return;
  }
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) collectText(child, bag);
  }
}

/**
 * Scan structured report fields for banned verdict language.
 * Fail-closed: any hit means the output must not ship as-is.
 */
export function findBannedPhrases(report: unknown): PolicyHit[] {
  const texts: string[] = [];
  collectText(report, texts);
  const joined = texts.join("\n");

  const hits: PolicyHit[] = [];
  for (const pattern of BANNED_PHRASE_PATTERNS) {
    const match = joined.match(pattern);
    if (match?.[0]) {
      hits.push({
        pattern: pattern.source,
        excerpt: match[0],
      });
    }
  }
  return hits;
}

export function assertNoBannedPhrases(report: unknown): void {
  const hits = findBannedPhrases(report);
  if (hits.length > 0) {
    throw new Error(
      `Policy violation: banned phrase(s): ${hits.map((h) => h.excerpt).join(", ")}`,
    );
  }
}
