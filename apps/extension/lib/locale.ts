import type { Locale } from "@tin-ai-lens/types";

const STORAGE_KEY = "tinailens.locale";

export const DEFAULT_LOCALE: Locale = "vi";

function isLocale(value: unknown): value is Locale {
  return value === "vi" || value === "en";
}

export async function getStoredLocale(): Promise<Locale> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const value = result[STORAGE_KEY];
    return isLocale(value) ? value : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export async function setStoredLocale(locale: Locale): Promise<void> {
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: locale });
  } catch {
    // Ignore persistence failures; in-memory locale still works.
  }
}
