/**
 * Sync toolbar click: popup vs Chrome Side Panel.
 */
import {
  APPLY_UI_MODE_MESSAGE,
  getUiMode,
  type UiMode,
} from "~/lib/ui-mode";

const POPUP_PATH = "popup.html";

async function applyUiMode(mode?: UiMode): Promise<void> {
  const resolved = mode ?? (await getUiMode());

  if (resolved === "sidepanel") {
    await chrome.action.setPopup({ popup: "" });
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    return;
  }

  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
  await chrome.action.setPopup({ popup: POPUP_PATH });
}

void applyUiMode();

chrome.runtime.onInstalled.addListener(() => {
  void applyUiMode();
});

chrome.runtime.onStartup.addListener(() => {
  void applyUiMode();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes["tinailens.uiMode"]) return;
  void applyUiMode();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== APPLY_UI_MODE_MESSAGE) return;
  void applyUiMode()
    .then(() => sendResponse({ ok: true }))
    .catch((error: unknown) =>
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "apply failed",
      }),
    );
  return true;
});

export {};
