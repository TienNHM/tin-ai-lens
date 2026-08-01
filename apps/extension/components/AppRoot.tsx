import { useCallback, useEffect, useState } from "react";

import type { AnalyzeResponse, Locale, TrustReport } from "@tin-ai-lens/types";

import { HistoryPanel } from "~/components/HistoryPanel";
import { SettingsPanel } from "~/components/SettingsPanel";
import { TrustReportView } from "~/components/TrustReportView";
import {
  analyzeLocal,
  ByokHostPermissionError,
  ByokMissingError,
  newRequestId,
} from "~/lib/analyze-local";
import { getByokSettings, type ByokSettings } from "~/lib/byok";
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
import {
  getUiMode,
  switchUiMode,
  type UiMode,
} from "~/lib/ui-mode";

type UiState =
  | "idle"
  | "extracting"
  | "analyzing"
  | "ready"
  | "insufficient"
  | "error";

type View = "main" | "history" | "settings";

const EXT_VERSION = "0.1.2";

export function AppRoot({ surface }: { surface: UiMode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [view, setView] = useState<View>("main");
  const [state, setState] = useState<UiState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AnalyzeResponse | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [fromHistory, setFromHistory] = useState(false);
  const [activeReport, setActiveReport] = useState<TrustReport | null>(null);
  const [byok, setByok] = useState<ByokSettings | null>(null);
  const [uiMode, setUiModeState] = useState<UiMode>(surface);

  const refreshHistory = useCallback(async () => {
    setHistoryItems(await listHistory());
  }, []);

  const refreshByok = useCallback(async () => {
    setByok(await getByokSettings());
  }, []);

  useEffect(() => {
    void getStoredLocale().then((stored) => {
      setLocale(stored);
    });
    void getUiMode().then(setUiModeState);
    void refreshHistory();
    void refreshByok();
  }, [refreshHistory, refreshByok]);

  const onLocaleChange = useCallback(async (next: Locale) => {
    setLocale(next);
    await setStoredLocale(next);
    setResponse(null);
    setActiveReport(null);
    setFromHistory(false);
    setError(null);
    setState("idle");
  }, []);

  const onUiModeChange = useCallback(async (next: UiMode) => {
    setUiModeState(next);
    await switchUiMode(next);
  }, []);

  const onAnalyze = useCallback(async () => {
    setError(null);
    setResponse(null);
    setActiveReport(null);
    setFromHistory(false);
    setView("main");

    const settings = await getByokSettings();
    if (!settings) {
      setState("error");
      setError(t(locale, "byokMissing"));
      setView("settings");
      return;
    }

    setState("extracting");

    try {
      const page = await extractActiveTab();
      setState("analyzing");

      const result = await analyzeLocal({
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
        if (result.error?.message) {
          setError(result.error.message);
        }
      }
    } catch (err) {
      setState("error");
      if (err instanceof ByokMissingError) {
        setError(t(locale, "byokMissing"));
        setView("settings");
        return;
      }
      if (err instanceof ByokHostPermissionError) {
        setError(t(locale, "byokPermissionDenied"));
        setView("settings");
        return;
      }
      setError(
        err instanceof Error ? err.message : t(locale, "genericError"),
      );
    }
  }, [locale, refreshHistory]);

  const busy = state === "extracting" || state === "analyzing";
  const shellClass =
    surface === "sidepanel" ? "shell shell-sidepanel" : "shell shell-popup";

  if (view === "history") {
    return (
      <div className={shellClass}>
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

  if (view === "settings") {
    return (
      <div className={shellClass}>
        <SettingsPanel
          locale={locale}
          surface={surface}
          uiMode={uiMode}
          onUiModeChange={(mode) => {
            void onUiModeChange(mode);
          }}
          onBack={() => setView("main")}
          onSaved={() => {
            void refreshByok();
          }}
        />
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <header className="header">
        <div>
          <div className="brand">TinAiLens</div>
          <div className="tagline">{t(locale, "tagline")}</div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setView("settings")}
          >
            {byok
              ? `${t(locale, "settings")} · ${t(locale, "byokConnected")}`
              : t(locale, "byokSetup")}
          </button>
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
          <button
            type="button"
            className="ghost-btn"
            onClick={() =>
              void onUiModeChange(
                surface === "sidepanel" ? "popup" : "sidepanel",
              )
            }
          >
            {surface === "sidepanel"
              ? t(locale, "uiModeSwitchPopup")
              : t(locale, "uiModeSwitchSidepanel")}
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

      {!byok ? (
        <div className="banner">
          {t(locale, "byokMissing")}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => setView("settings")}
          >
            {t(locale, "settings")}
          </button>
        </div>
      ) : null}

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

      {state === "error" && response?.error && !error ? (
        <div className="banner error">{response.error.message}</div>
      ) : null}

      {activeReport ? (
        <TrustReportView report={activeReport} locale={locale} />
      ) : null}

      <footer className="footer">{t(locale, "footer")}</footer>
    </div>
  );
}
