import { useCallback, useEffect, useState } from "react";

import type { AnalyzeResponse, Locale } from "@tin-ai-lens/types";

import { TrustReportView } from "~/components/TrustReportView";
import { AnalyzeApiError, newRequestId, postAnalyze } from "~/lib/api";
import { t } from "~/lib/i18n";
import { DEFAULT_LOCALE, getStoredLocale, setStoredLocale } from "~/lib/locale";
import { extractActiveTab } from "~/lib/tab-extract";

import "~/style.css";

type UiState =
  | "idle"
  | "extracting"
  | "analyzing"
  | "ready"
  | "insufficient"
  | "error";

const EXT_VERSION = "0.1.0";

function IndexPopup() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [state, setState] = useState<UiState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AnalyzeResponse | null>(null);

  useEffect(() => {
    void getStoredLocale().then((stored) => {
      setLocale(stored);
    });
  }, []);

  const onLocaleChange = useCallback(async (next: Locale) => {
    setLocale(next);
    await setStoredLocale(next);
    // Report prose is locale-specific — clear stale results after switch.
    setResponse(null);
    setError(null);
    setState("idle");
  }, []);

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
        locale,
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
            : t(locale, "genericError"),
      );
    }
  }, [locale]);

  const busy = state === "extracting" || state === "analyzing";

  return (
    <div className="shell">
      <header className="header">
        <div>
          <div className="brand">TinAiLens</div>
          <div className="tagline">{t(locale, "tagline")}</div>
        </div>
        <div className="lang-switch" role="group" aria-label={t(locale, "language")}>
          <button
            type="button"
            className={`lang-btn ${locale === "vi" ? "active" : ""}`}
            onClick={() => void onLocaleChange("vi")}
          >
            {t(locale, "langVi")}
          </button>
          <button
            type="button"
            className={`lang-btn ${locale === "en" ? "active" : ""}`}
            onClick={() => void onLocaleChange("en")}
          >
            {t(locale, "langEn")}
          </button>
        </div>
      </header>

      <p className="lede">{t(locale, "lede")}</p>

      <button
        type="button"
        className="primary"
        onClick={() => void onAnalyze()}
        disabled={busy}
      >
        {state === "extracting"
          ? t(locale, "extracting")
          : state === "analyzing"
            ? t(locale, "analyzing")
            : t(locale, "analyze")}
      </button>

      {error ? <div className="banner error">{error}</div> : null}

      {state === "insufficient" ? (
        <div className="banner">{t(locale, "insufficient")}</div>
      ) : null}

      {state === "error" && response?.error ? (
        <div className="banner error">{response.error.message}</div>
      ) : null}

      {response?.status === "ready" && response.report ? (
        <TrustReportView report={response.report} locale={locale} />
      ) : null}

      <footer className="footer">{t(locale, "footer")}</footer>
    </div>
  );
}

export default IndexPopup;
