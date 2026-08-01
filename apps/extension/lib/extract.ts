import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";

import { metaFromDocument, type ExtractedPagePayload } from "./markdown";

/**
 * Runs in the page context via chrome.scripting.executeScript.
 * Must be self-contained enough for Plasmo/parcel to bundle when imported from popup.
 */
export function extractCurrentPage(): ExtractedPagePayload {
  const clone = document.cloneNode(true) as Document;
  const parsed = new Readability(clone).parse();
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });

  const contentHtml = parsed?.content ?? "";
  const markdown = contentHtml
    ? turndown.turndown(contentHtml)
    : (document.body?.innerText ?? "").slice(0, 20_000);

  const language =
    document.documentElement.lang?.trim() ||
    document.querySelector("html")?.getAttribute("lang")?.trim() ||
    undefined;

  const meta = metaFromDocument(document);
  const extractedMeta = Object.fromEntries(
    Object.entries(meta).filter(([, v]) => Boolean(v)),
  ) as ExtractedPagePayload["extractedMeta"];

  return {
    url: location.href,
    title: parsed?.title || document.title || "Untitled",
    markdown: markdown.trim(),
    language,
    extractedMeta:
      extractedMeta && Object.keys(extractedMeta).length > 0
        ? extractedMeta
        : undefined,
  };
}
