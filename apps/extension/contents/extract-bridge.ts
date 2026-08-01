import type { PlasmoCSConfig } from "plasmo";

import { extractCurrentPage } from "~/lib/extract";
import type { ExtractedPagePayload } from "~/lib/markdown";

export const config: PlasmoCSConfig = {
  matches: ["http://*/*", "https://*/*"],
  run_at: "document_idle",
};

type ExtractRequest = { type: "TINAILENS_EXTRACT" };
type ExtractResponse =
  | { ok: true; data: ExtractedPagePayload }
  | { ok: false; error: string };

chrome.runtime.onMessage.addListener(
  (
    message: ExtractRequest,
    _sender,
    sendResponse: (response: ExtractResponse) => void,
  ) => {
    if (message?.type !== "TINAILENS_EXTRACT") {
      return;
    }

    try {
      const data = extractCurrentPage();
      if (!data.markdown.trim()) {
        sendResponse({
          ok: false,
          error:
            "Could not extract readable content. Try a text-heavy article page.",
        });
        return;
      }
      sendResponse({ ok: true, data });
    } catch (err) {
      sendResponse({
        ok: false,
        error: err instanceof Error ? err.message : "Extraction failed",
      });
    }

    return true;
  },
);

export {};
