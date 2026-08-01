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
    url.startsWith("devtools://") ||
    url.startsWith("https://chrome.google.com/webstore") ||
    url.startsWith("https://chromewebstore.google.com/")
  );
}

function isAnalyzableUrl(url: string | undefined): url is string {
  if (!url) return false;
  if (isRestrictedUrl(url)) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Resolve the article tab beside the popup/side panel.
 * Side Panel clicks do not grant activeTab, so we need the `tabs` permission
 * to read URLs, and lastFocusedWindow for a reliable active tab.
 */
async function getTargetTab(): Promise<chrome.tabs.Tab> {
  const queries: chrome.tabs.QueryInfo[] = [
    { active: true, lastFocusedWindow: true },
    { active: true, currentWindow: true },
  ];

  for (const query of queries) {
    const [tab] = await chrome.tabs.query(query);
    if (tab?.id != null && isAnalyzableUrl(tab.url)) {
      return tab;
    }
  }

  // Fallback: any active http(s) tab
  const tabs = await chrome.tabs.query({ active: true });
  const withUrl = tabs.find((tab) => tab.id != null && isAnalyzableUrl(tab.url));
  if (withUrl) return withUrl;

  const [anyActive] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (anyActive?.id != null) {
    if (!anyActive.url) {
      throw new Error(
        "Cannot read this tab yet. Reload the extension, open an article, then try Analyze again.",
      );
    }
    throw new Error(
      "This page cannot be analyzed. Open an article tab and try again.",
    );
  }

  throw new Error("No active tab found.");
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
 * opened before install). From the Side Panel this may fail without host
 * access — caller should ask the user to refresh the tab.
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
  const tab = await getTargetTab();
  const tabId = tab.id!;

  try {
    if (!(await pingBridge(tabId))) {
      try {
        await injectContentScripts(tabId);
      } catch {
        throw new Error(
          "Could not reach the page script. Refresh the article tab and try Analyze again.",
        );
      }
    }

    const response = await sendExtract(tabId);
    if (!response.ok) {
      throw new Error(response.error);
    }
    return response.data;
  } catch (err) {
    if (
      err instanceof Error &&
      /cannot be analyzed|No active tab|readable content|content script is missing|Refresh the article|Cannot read this tab/i.test(
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
