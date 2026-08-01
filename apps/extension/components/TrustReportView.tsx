import type { TrustReport, TrustSignal } from "@tin-ai-lens/types";

import {
  labelClaimType,
  labelSeverity,
  labelSignalType,
  t,
  type Locale,
} from "~/lib/i18n";

function SignalRow({
  label,
  signal,
  locale,
}: {
  label: string;
  signal: TrustSignal;
  locale: Locale;
}) {
  return (
    <div className="signal">
      <div className="signal-head">
        <span className="signal-label">{label}</span>
        <span className={`pill ${signal.present ? "pill-warn" : "pill-ok"}`}>
          {signal.present ? labelSeverity(locale, signal.severity) : t(locale, "notFlagged")}
          {signal.uncertain ? ` · ${t(locale, "uncertain")}` : ""}
        </span>
      </div>
      <p className="signal-body">{signal.explanation}</p>
      {signal.evidenceSnippet?.text ? (
        <blockquote className="snippet">{signal.evidenceSnippet.text}</blockquote>
      ) : null}
    </div>
  );
}

export function TrustReportView({
  report,
  locale,
}: {
  report: TrustReport;
  locale: Locale;
}) {
  const scoreLabel =
    report.trustScore === null
      ? t(locale, "scoreWithheld")
      : String(report.trustScore);
  const confidencePct = Math.round(report.confidence * 100);

  return (
    <div className="report">
      <section className="score-block">
        <div className="score-row">
          <div>
            <div className="eyebrow">{t(locale, "trustScore")}</div>
            <div className="score-value">{scoreLabel}</div>
          </div>
          <div className="confidence">
            <div className="eyebrow">{t(locale, "confidence")}</div>
            <div className="confidence-value">{confidencePct}%</div>
          </div>
        </div>
        <p className="hint">{t(locale, "scoreHint")}</p>
      </section>

      <section>
        <h2>{t(locale, "summary")}</h2>
        <p>{report.summary}</p>
      </section>

      {report.reasons.length > 0 ? (
        <section>
          <h2>{t(locale, "reasons")}</h2>
          <ul className="reasons">
            {report.reasons.map((reason) => (
              <li key={reason.id}>
                <strong>{labelSignalType(locale, reason.signalType)}</strong>
                <span>{reason.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2>{t(locale, "signals")}</h2>
        <SignalRow
          label={t(locale, "signalAi")}
          signal={report.signals.ai}
          locale={locale}
        />
        <SignalRow
          label={t(locale, "signalClickbait")}
          signal={report.signals.clickbait}
          locale={locale}
        />
        <SignalRow
          label={t(locale, "signalMissingSource")}
          signal={report.signals.missingSource}
          locale={locale}
        />
        <SignalRow
          label={t(locale, "signalMissingAuthor")}
          signal={report.signals.missingAuthor}
          locale={locale}
        />
      </section>

      {report.claims.length > 0 ? (
        <section>
          <h2>{t(locale, "claims")}</h2>
          <ul className="claims">
            {report.claims.map((claim) => (
              <li key={claim.id}>
                <div className="claim-text">{claim.text}</div>
                <div className="claim-meta">
                  {labelClaimType(locale, claim.type)} ·{" "}
                  {Math.round(claim.confidence * 100)}% {t(locale, "confidence").toLowerCase()}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {report.suggestions.length > 0 ? (
        <section>
          <h2>{t(locale, "suggestions")}</h2>
          <ul className="suggestions">
            {report.suggestions.map((s) => (
              <li key={s.id}>
                <strong>{s.action}</strong>
                <span>{s.rationale}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {report.uncertainty?.summary ? (
        <section>
          <h2>{t(locale, "uncertainty")}</h2>
          <p>{report.uncertainty.summary}</p>
          {report.uncertainty.factors.length > 0 ? (
            <ul className="factors">
              {report.uncertainty.factors.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {report.warnings.length > 0 ? (
        <section>
          <h2>{t(locale, "warnings")}</h2>
          <ul className="factors">
            {report.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
