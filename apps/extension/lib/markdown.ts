/**
 * Shared extraction helpers (also used in injected page context via executeScript).
 */

export interface ExtractedPagePayload {
  url: string;
  title: string;
  markdown: string;
  language?: string;
  extractedMeta?: {
    author?: string;
    byline?: string;
    siteName?: string;
    publishedAt?: string;
  };
}

export function htmlToMarkdown(html: string): string {
  // Lightweight HTML → markdown for article bodies (no Turndown in unit tests).
  // Runtime injection uses Turndown; this is a fallback / testable path.
  return html
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(a|span|strong|em|b|i)[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function metaFromDocument(doc: {
  querySelector: (sel: string) => { getAttribute?: (n: string) => string | null; textContent?: string | null } | null;
}): NonNullable<ExtractedPagePayload["extractedMeta"]> {
  const content = (sel: string) => {
    const el = doc.querySelector(sel);
    return (
      el?.getAttribute?.("content")?.trim() ||
      el?.textContent?.trim() ||
      undefined
    );
  };

  return {
    author:
      content('meta[name="author"]') ||
      content('meta[property="article:author"]'),
    byline: content('[rel="author"]') || content(".author") || content(".byline"),
    siteName:
      content('meta[property="og:site_name"]') ||
      content('meta[name="application-name"]'),
    publishedAt:
      content('meta[property="article:published_time"]') ||
      content('meta[name="date"]'),
  };
}
