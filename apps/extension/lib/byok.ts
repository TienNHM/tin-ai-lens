const STORAGE_KEY = "tinailens.byok";

export type ByokProvider = "google" | "openai";

export interface ByokSettings {
  provider: ByokProvider;
  apiKey: string;
}

const DEFAULT_PROVIDER: ByokProvider = "google";

/** Origins requested at save/analyze time (optional_host_permissions). */
export const PROVIDER_HOST_ORIGINS: Record<ByokProvider, string> = {
  google: "https://generativelanguage.googleapis.com/*",
  openai: "https://api.openai.com/*",
};

export class ByokHostPermissionError extends Error {
  constructor(message = "Host permission denied") {
    super(message);
    this.name = "ByokHostPermissionError";
  }
}

function isProvider(value: unknown): value is ByokProvider {
  return value === "google" || value === "openai";
}

/** Ask Chrome for the provider API host (must run from a user gesture). */
export async function ensureProviderHostPermission(
  provider: ByokProvider,
): Promise<boolean> {
  const origins = [PROVIDER_HOST_ORIGINS[provider]];
  try {
    const already = await chrome.permissions.contains({ origins });
    if (already) return true;
    return await chrome.permissions.request({ origins });
  } catch {
    return false;
  }
}

export async function revokeProviderHostPermissions(): Promise<void> {
  const origins = Object.values(PROVIDER_HOST_ORIGINS);
  try {
    await chrome.permissions.remove({ origins });
  } catch {
    // Ignore — permission may already be absent.
  }
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
  await revokeProviderHostPermissions();
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
