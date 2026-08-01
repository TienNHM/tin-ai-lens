import type { ExtractedPagePayload } from "./markdown";

/**
 * User-gesture extraction from the active tab via content-script bridge.
 */
export async function extractActiveTab(): Promise<ExtractedPagePayload> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("No active tab found.");
  }
  if (
    !tab.url ||
    tab.url.startsWith("chrome://") ||
    tab.url.startsWith("chrome-extension://") ||
    tab.url.startsWith("edge://") ||
    tab.url.startsWith("about:")
  ) {
    throw new Error(
      "This page cannot be analyzed. Open an article tab and try again.",
    );
  }

  try {
    const response = (await chrome.tabs.sendMessage(tab.id, {
      type: "TINAILENS_EXTRACT",
    })) as
      | { ok: true; data: ExtractedPagePayload }
      | { ok: false; error: string }
      | undefined;

    if (!response) {
      throw new Error("No response from page. Refresh the tab and try again.");
    }
    if (!response.ok) {
      throw new Error(response.error);
    }
    return response.data;
  } catch (err) {
    if (err instanceof Error && /cannot be analyzed|No active tab/i.test(err.message)) {
      throw err;
    }
    throw new Error(
      "Could not reach the page script. Refresh the tab and try Analyze again.",
    );
  }
}
