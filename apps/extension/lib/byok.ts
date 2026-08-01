const STORAGE_KEY = "tinailens.byok";

export type ByokProvider = "google" | "openai";

export interface ByokSettings {
  provider: ByokProvider;
  apiKey: string;
}

const DEFAULT_PROVIDER: ByokProvider = "google";

function isProvider(value: unknown): value is ByokProvider {
  return value === "google" || value === "openai";
}

export async function getByokSettings(): Promise<ByokSettings | null> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const raw = result[STORAGE_KEY] as Partial<ByokSettings> | undefined;
    if (!raw || !isProvider(raw.provider) || typeof raw.apiKey !== "string") {
      return null;
    }
    const apiKey = raw.apiKey.trim();
    if (!apiKey) return null;
    return { provider: raw.provider, apiKey };
  } catch {
    return null;
  }
}

export async function setByokSettings(settings: ByokSettings): Promise<void> {
  const apiKey = settings.apiKey.trim();
  if (!apiKey) {
    await clearByokSettings();
    return;
  }
  await chrome.storage.local.set({
    [STORAGE_KEY]: {
      provider: settings.provider,
      apiKey,
    } satisfies ByokSettings,
  });
}

export async function clearByokSettings(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY);
}

export function defaultByokProvider(): ByokProvider {
  return DEFAULT_PROVIDER;
}

export function maskApiKey(apiKey: string): string {
  const trimmed = apiKey.trim();
  if (trimmed.length <= 8) return "••••••••";
  return `${trimmed.slice(0, 4)}…${trimmed.slice(-4)}`;
}

export const BYOK_KEY_URLS: Record<ByokProvider, string> = {
  google: "https://aistudio.google.com/apikey",
  openai: "https://platform.openai.com/api-keys",
};
