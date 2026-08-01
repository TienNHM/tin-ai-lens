import type { Locale } from "@tin-ai-lens/types";

import {
  formatHistoryTime,
  type HistoryItem,
} from "~/lib/history";
import { t } from "~/lib/i18n";

export function HistoryPanel({
  locale,
  items,
  onOpen,
  onDelete,
  onClear,
  onBack,
}: {
  locale: Locale;
  items: HistoryItem[];
  onOpen: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onBack: () => void;
}) {
  return (
    <div className="history">
      <div className="history-toolbar">
        <button type="button" className="link-btn" onClick={onBack}>
          {t(locale, "back")}
        </button>
        {items.length > 0 ? (
          <button type="button" className="link-btn danger" onClick={onClear}>
            {t(locale, "clearHistory")}
          </button>
        ) : null}
      </div>

      <h2 className="history-title">{t(locale, "history")}</h2>
      <p className="history-note">{t(locale, "historyPrivacy")}</p>

      {items.length === 0 ? (
        <div className="banner">{t(locale, "historyEmpty")}</div>
      ) : (
        <ul className="history-list">
          {items.map((item) => (
            <li key={item.id} className="history-item">
              <button
                type="button"
                className="history-main"
                onClick={() => onOpen(item)}
              >
                <div className="history-item-title">{item.title}</div>
                <div className="history-item-meta">
                  {formatHistoryTime(item.createdAt, locale)}
                  {item.trustScore !== null
                    ? ` · ${t(locale, "trustScore")} ${item.trustScore}`
                    : ` · ${t(locale, "scoreWithheld")}`}
                </div>
                {item.summary ? (
                  <div className="history-item-summary">{item.summary}</div>
                ) : null}
              </button>
              <button
                type="button"
                className="link-btn danger history-delete"
                onClick={() => onDelete(item.id)}
              >
                {t(locale, "delete")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
