import type { AnalyzeResponse, Locale, TrustReport } from "@tin-ai-lens/types";

const STORAGE_KEY = "tinailens.history";
export const HISTORY_LIMIT = 20;

export interface HistoryItem {
  id: string;
  createdAt: string;
  url: string;
  title: string;
  locale: Locale;
  status: AnalyzeResponse["status"];
  trustScore: number | null;
  confidence: number | null;
  summary: string | null;
  /** Trust report only — never store page markdown */
  report: TrustReport | null;
}

function sortNewest(items: HistoryItem[]): HistoryItem[] {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function listHistory(): Promise<HistoryItem[]> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const raw = result[STORAGE_KEY];
    if (!Array.isArray(raw)) return [];
    return sortNewest(raw as HistoryItem[]).slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
}

export async function addHistoryEntry(input: {
  url: string;
  title: string;
  locale: Locale;
  response: AnalyzeResponse;
}): Promise<HistoryItem | null> {
  // Only persist successful-enough analyses with a report body.
  if (input.response.status === "error" || !input.response.report) {
    return null;
  }

  const entry: HistoryItem = {
    id: input.response.requestId,
    createdAt: new Date().toISOString(),
    url: input.url,
    title: input.title,
    locale: input.locale,
    status: input.response.status,
    trustScore: input.response.report.trustScore,
    confidence: input.response.report.confidence,
    summary: input.response.report.summary,
    report: input.response.report,
  };

  const existing = await listHistory();
  const next = sortNewest([
    entry,
    ...existing.filter((item) => item.id !== entry.id),
  ]).slice(0, HISTORY_LIMIT);

  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  return entry;
}

export async function removeHistoryEntry(id: string): Promise<void> {
  const existing = await listHistory();
  const next = existing.filter((item) => item.id !== id);
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
}

export async function clearHistory(): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: [] });
}

export function formatHistoryTime(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
