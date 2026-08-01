import { useCallback, useEffect, useState } from "react";

import type { AnalyzeResponse, Locale, TrustReport } from "@tin-ai-lens/types";

import { HistoryPanel } from "~/components/HistoryPanel";
import { TrustReportView } from "~/components/TrustReportView";
import { AnalyzeApiError, newRequestId, postAnalyze } from "~/lib/api";
import {
  addHistoryEntry,
  clearHistory,
  listHistory,
  removeHistoryEntry,
  type HistoryItem,
} from "~/lib/history";
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

type View = "main" | "history";

const EXT_VERSION = "0.1.0";

function IndexPopup() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [view, setView] = useState<View>("main");
  const [state, setState] = useState<UiState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AnalyzeResponse | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [fromHistory, setFromHistory] = useState(false);
  const [activeReport, setActiveReport] = useState<TrustReport | null>(null);

  const refreshHistory = useCallback(async () => {
    setHistoryItems(await listHistory());
  }, []);

  useEffect(() => {
    void getStoredLocale().then((stored) => {
      setLocale(stored);
    });
    void refreshHistory();
  }, [refreshHistory]);

  const onLocaleChange = useCallback(async (next: Locale) => {
    setLocale(next);
    await setStoredLocale(next);
    setResponse(null);
    setActiveReport(null);
    setFromHistory(false);
    setError(null);
    setState("idle");
  }, []);

  const onAnalyze = useCallback(async () => {
    setError(null);
    setResponse(null);
    setActiveReport(null);
    setFromHistory(false);
    setState("extracting");
    setView("main");

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
      if (result.status === "ready" && result.report) {
        setActiveReport(result.report);
        setState("ready");
        await addHistoryEntry({
          url: page.url,
          title: page.title,
          locale,
          response: result,
        });
        await refreshHistory();
      } else if (result.status === "insufficient") {
        setState("insufficient");
        if (result.report) {
          setActiveReport(result.report);
          await addHistoryEntry({
            url: page.url,
            title: page.title,
            locale,
            response: result,
          });
          await refreshHistory();
        }
      } else {
        setState("error");
      }
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
  }, [locale, refreshHistory]);

  const busy = state === "extracting" || state === "analyzing";

  if (view === "history") {
    return (
      <div className="shell">
        <HistoryPanel
          locale={locale}
          items={historyItems}
          onBack={() => setView("main")}
          onOpen={(item) => {
            if (!item.report) return;
            setActiveReport(item.report);
            setFromHistory(true);
            setResponse(null);
            setError(null);
            setState("ready");
            setView("main");
          }}
          onDelete={(id) => {
            void removeHistoryEntry(id).then(refreshHistory);
          }}
          onClear={() => {
            void clearHistory().then(refreshHistory);
          }}
        />
      </div>
    );
  }

  return (
    <div className="shell">
      <header className="header">
        <div>
          <div className="brand">TinAiLens</div>
          <div className="tagline">{t(locale, "tagline")}</div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              void refreshHistory().then(() => setView("history"));
            }}
          >
            {t(locale, "history")}
            {historyItems.length > 0 ? ` (${historyItems.length})` : ""}
          </button>
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

      {fromHistory ? (
        <div className="banner">{t(locale, "viewingHistory")}</div>
      ) : null}

      {error ? <div className="banner error">{error}</div> : null}

      {state === "insufficient" ? (
        <div className="banner">{t(locale, "insufficient")}</div>
      ) : null}

      {state === "error" && response?.error ? (
        <div className="banner error">{response.error.message}</div>
      ) : null}

      {activeReport ? (
        <TrustReportView report={activeReport} locale={locale} />
      ) : null}

      <footer className="footer">{t(locale, "footer")}</footer>
    </div>
  );
}

export default IndexPopup;
