import { useCallback, useState } from "react";

import type { AnalyzeResponse } from "@tin-ai-lens/types";

import { TrustReportView } from "~/components/TrustReportView";
import { AnalyzeApiError, newRequestId, postAnalyze } from "~/lib/api";
import { extractActiveTab } from "~/lib/tab-extract";

import "~/style.css";

type UiState = "idle" | "extracting" | "analyzing" | "ready" | "insufficient" | "error";

const EXT_VERSION = "0.1.0";

function IndexPopup() {
  const [state, setState] = useState<UiState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AnalyzeResponse | null>(null);

  const onAnalyze = useCallback(async () => {
    setError(null);
    setResponse(null);
    setState("extracting");

    try {
      const page = await extractActiveTab();
      setState("analyzing");

      const result = await postAnalyze({
        requestId: newRequestId(),
        url: page.url,
        title: page.title,
        markdown: page.markdown,
        language: page.language,
        extensionVersion: EXT_VERSION,
        extractedMeta: page.extractedMeta,
      });

      setResponse(result);
      if (result.status === "ready") setState("ready");
      else if (result.status === "insufficient") setState("insufficient");
      else setState("error");
    } catch (err) {
      setState("error");
      setError(
        err instanceof AnalyzeApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please retry.",
      );
    }
  }, []);

  const busy = state === "extracting" || state === "analyzing";

  return (
    <div className="shell">
      <header className="header">
        <div>
          <div className="brand">TinAiLens</div>
          <div className="tagline">Think Before You Trust.</div>
        </div>
      </header>

      <p className="lede">
        Explainable trust signals for this page — not a true/false or AI verdict.
      </p>

      <button
        type="button"
        className="primary"
        onClick={() => void onAnalyze()}
        disabled={busy}
      >
        {state === "extracting"
          ? "Extracting…"
          : state === "analyzing"
            ? "Analyzing…"
            : "Analyze current page"}
      </button>

      {error ? <div className="banner error">{error}</div> : null}

      {state === "insufficient" ? (
        <div className="banner">
          Insufficient content for a confident report. Try a longer article, or
          refresh and analyze again.
        </div>
      ) : null}

      {state === "error" && response?.error ? (
        <div className="banner error">{response.error.message}</div>
      ) : null}

      {response?.status === "ready" && response.report ? (
        <TrustReportView report={response.report} />
      ) : null}

      <footer className="footer">
        You decide. TinAiLens only helps you see what to verify next.
      </footer>
    </div>
  );
}

export default IndexPopup;
