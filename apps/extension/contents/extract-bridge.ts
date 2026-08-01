import type { PlasmoCSConfig } from "plasmo";

import { extractCurrentPage } from "~/lib/extract";
import type { ExtractedPagePayload } from "~/lib/markdown";

export const config: PlasmoCSConfig = {
  matches: ["http://*/*", "https://*/*"],
  run_at: "document_idle",
};

type BridgeRequest =
  | { type: "TINAILENS_PING" }
  | { type: "TINAILENS_EXTRACT" };

type BridgeResponse =
  | { ok: true; pong?: true; data?: ExtractedPagePayload }
  | { ok: false; error: string };

chrome.runtime.onMessage.addListener(
  (
    message: BridgeRequest,
    _sender,
    sendResponse: (response: BridgeResponse) => void,
  ) => {
    if (message?.type === "TINAILENS_PING") {
      sendResponse({ ok: true, pong: true });
      return;
    }

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
  },
);

export {};
