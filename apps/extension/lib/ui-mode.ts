export type UiMode = "popup" | "sidepanel";

const STORAGE_KEY = "tinailens.uiMode";
export const DEFAULT_UI_MODE: UiMode = "sidepanel";

export const APPLY_UI_MODE_MESSAGE = "TINAILENS_APPLY_UI_MODE" as const;

export function isUiMode(value: unknown): value is UiMode {
  return value === "popup" || value === "sidepanel";
}

export async function getUiMode(): Promise<UiMode> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const raw = result[STORAGE_KEY];
    return isUiMode(raw) ? raw : DEFAULT_UI_MODE;
  } catch {
    return DEFAULT_UI_MODE;
  }
}

export async function setUiMode(mode: UiMode): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: mode });
}

/** Ask the service worker to sync action popup vs side-panel-on-click. */
export async function requestApplyUiMode(): Promise<void> {
  try {
    await chrome.runtime.sendMessage({ type: APPLY_UI_MODE_MESSAGE });
  } catch {
    // Service worker may be waking; storage listener will still apply.
  }
}

/**
 * Switch preferred UI and open the target surface when possible.
 * - popup → sidepanel: opens side panel and closes popup
 * - sidepanel → popup: enables popup; tries openPopup() when available
 */
export async function switchUiMode(next: UiMode): Promise<void> {
  await setUiMode(next);
  await requestApplyUiMode();

  if (next === "sidepanel") {
    const win = await chrome.windows.getCurrent();
    if (win.id != null) {
      await chrome.sidePanel.open({ windowId: win.id });
    }
    // Closing the popup (if we were in one) keeps only the sidebar open.
    window.close();
    return;
  }

  // Prefer Chrome's openPopup when present (MV3).
  const openPopup = (
    chrome.action as typeof chrome.action & {
      openPopup?: () => Promise<void>;
    }
  ).openPopup;
  if (typeof openPopup === "function") {
    try {
      await openPopup.call(chrome.action);
    } catch {
      // User may need to click the toolbar icon once.
    }
  }
}
