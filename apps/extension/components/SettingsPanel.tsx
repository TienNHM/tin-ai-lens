import { useEffect, useState } from "react";

import type { Locale } from "@tin-ai-lens/types";

import {
  BYOK_KEY_URLS,
  clearByokSettings,
  defaultByokProvider,
  ensureProviderHostPermission,
  getByokSettings,
  maskApiKey,
  setByokSettings,
  type ByokProvider,
} from "~/lib/byok";
import { t } from "~/lib/i18n";
import type { UiMode } from "~/lib/ui-mode";

export function SettingsPanel({
  locale,
  surface,
  uiMode,
  onUiModeChange,
  onBack,
  onSaved,
}: {
  locale: Locale;
  surface: UiMode;
  uiMode: UiMode;
  onUiModeChange: (mode: UiMode) => void;
  onBack: () => void;
  onSaved: () => void;
}) {
  const [provider, setProvider] = useState<ByokProvider>(defaultByokProvider());
  const [apiKey, setApiKey] = useState("");
  const [savedMasked, setSavedMasked] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void getByokSettings().then((stored) => {
      if (!stored) return;
      setProvider(stored.provider);
      setSavedMasked(maskApiKey(stored.apiKey));
    });
  }, []);

  const onSave = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const keyToSave = apiKey.trim();
      if (!keyToSave && !savedMasked) {
        setStatus(t(locale, "byokKeyRequired"));
        return;
      }

      const granted = await ensureProviderHostPermission(provider);
      if (!granted) {
        setStatus(t(locale, "byokPermissionDenied"));
        return;
      }

      if (keyToSave) {
        await setByokSettings({ provider, apiKey: keyToSave });
        setSavedMasked(maskApiKey(keyToSave));
        setApiKey("");
      } else if (savedMasked) {
        const existing = await getByokSettings();
        if (!existing) {
          setStatus(t(locale, "byokKeyRequired"));
          return;
        }
        await setByokSettings({ provider, apiKey: existing.apiKey });
      }
      setStatus(t(locale, "byokSaved"));
      onSaved();
    } finally {
      setBusy(false);
    }
  };

  const onClear = async () => {
    setBusy(true);
    setStatus(null);
    try {
      await clearByokSettings();
      setApiKey("");
      setSavedMasked(null);
      setProvider(defaultByokProvider());
      setStatus(t(locale, "byokCleared"));
      onSaved();
    } finally {
      setBusy(false);
    }
  };

  const onModeSelect = (mode: UiMode) => {
    if (mode === uiMode && mode === surface) return;
    if (mode === "popup" && surface === "sidepanel") {
      setStatus(t(locale, "uiModeSwitchedPopup"));
    }
    onUiModeChange(mode);
  };

  return (
    <div className="settings">
      <div className="history-toolbar">
        <button type="button" className="link-btn" onClick={onBack}>
          {t(locale, "back")}
        </button>
      </div>

      <h2 className="history-title">{t(locale, "settings")}</h2>
      <p className="history-note">{t(locale, "byokPrivacy")}</p>

      <fieldset className="field field-fieldset">
        <legend className="field-label">{t(locale, "uiModeLabel")}</legend>
        <p className="settings-help">{t(locale, "uiModeHint")}</p>
        <div className="mode-switch" role="group">
          <button
            type="button"
            className={`mode-btn ${uiMode === "sidepanel" ? "active" : ""}`}
            onClick={() => onModeSelect("sidepanel")}
          >
            {t(locale, "uiModeSidepanel")}
          </button>
          <button
            type="button"
            className={`mode-btn ${uiMode === "popup" ? "active" : ""}`}
            onClick={() => onModeSelect("popup")}
          >
            {t(locale, "uiModePopup")}
          </button>
        </div>
      </fieldset>

      <label className="field">
        <span className="field-label">{t(locale, "byokProvider")}</span>
        <select
          className="field-input"
          value={provider}
          onChange={(e) => setProvider(e.target.value as ByokProvider)}
        >
          <option value="google">{t(locale, "byokProviderGoogle")}</option>
          <option value="openai">{t(locale, "byokProviderOpenai")}</option>
        </select>
      </label>

      <label className="field">
        <span className="field-label">{t(locale, "byokApiKey")}</span>
        <input
          className="field-input"
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder={
            savedMasked
              ? t(locale, "byokKeyPlaceholderSaved").replace(
                  "{masked}",
                  savedMasked,
                )
              : t(locale, "byokKeyPlaceholder")
          }
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </label>

      <p className="settings-help">
        <a
          href={BYOK_KEY_URLS[provider]}
          target="_blank"
          rel="noreferrer"
        >
          {provider === "google"
            ? t(locale, "byokGetGeminiKey")
            : t(locale, "byokGetOpenaiKey")}
        </a>
      </p>

      <div className="settings-actions">
        <button
          type="button"
          className="primary"
          disabled={busy}
          onClick={() => void onSave()}
        >
          {t(locale, "byokSave")}
        </button>
        {savedMasked ? (
          <button
            type="button"
            className="link-btn danger"
            disabled={busy}
            onClick={() => void onClear()}
          >
            {t(locale, "byokClear")}
          </button>
        ) : null}
      </div>

      {status ? <div className="banner">{status}</div> : null}
    </div>
  );
}
