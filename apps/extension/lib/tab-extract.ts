import type { ExtractedPagePayload } from "./markdown";

type ExtractResponse =
  | { ok: true; data: ExtractedPagePayload }
  | { ok: false; error: string };

function isRestrictedUrl(url: string): boolean {
  return (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("edge://") ||
    url.startsWith("about:") ||
    url.startsWith("https://chrome.google.com/webstore") ||
    url.startsWith("https://chromewebstore.google.com/")
  );
}

/** True if the content-script bridge is already listening on the tab. */
function pingBridge(tabId: number): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { type: "TINAILENS_PING" }, () => {
      resolve(!chrome.runtime.lastError);
    });
  });
}

/**
 * Re-inject declared content scripts (needed after extension reload / tab
 * opened before install). Relies on activeTab + scripting from the Analyze click.
 */
async function injectContentScripts(tabId: number): Promise<void> {
  const files =
    chrome.runtime
      .getManifest()
      .content_scripts?.flatMap((entry) => entry.js ?? []) ?? [];

  if (files.length === 0) {
    throw new Error(
      "Extension content script is missing. Reinstall or reload the extension.",
    );
  }

  await chrome.scripting.executeScript({
    target: { tabId },
    files,
  });
}

function sendExtract(tabId: number): Promise<ExtractResponse> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: "TINAILENS_EXTRACT" },
      (response: ExtractResponse | undefined) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (!response) {
          reject(new Error("No response from page."));
          return;
        }
        resolve(response);
      },
    );
  });
}

/**
 * User-gesture extraction from the active tab via content-script bridge.
 * Injects the bridge if the tab was open before the extension loaded/reloaded.
 */
export async function extractActiveTab(): Promise<ExtractedPagePayload> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("No active tab found.");
  }
  if (!tab.url || isRestrictedUrl(tab.url)) {
    throw new Error(
      "This page cannot be analyzed. Open an article tab and try again.",
    );
  }

  const tabId = tab.id;

  try {
    if (!(await pingBridge(tabId))) {
      await injectContentScripts(tabId);
    }

    const response = await sendExtract(tabId);
    if (!response.ok) {
      throw new Error(response.error);
    }
    return response.data;
  } catch (err) {
    if (
      err instanceof Error &&
      /cannot be analyzed|No active tab|readable content|content script is missing/i.test(
        err.message,
      )
    ) {
      throw err;
    }
    throw new Error(
      "Could not reach the page script. Refresh the tab and try Analyze again.",
    );
  }
}
