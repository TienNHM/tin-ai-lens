import type { TrustReport, TrustSignal } from "@tin-ai-lens/types";

function SignalRow({ label, signal }: { label: string; signal: TrustSignal }) {
  return (
    <div className="signal">
      <div className="signal-head">
        <span className="signal-label">{label}</span>
        <span className={`pill ${signal.present ? "pill-warn" : "pill-ok"}`}>
          {signal.present ? signal.severity : "not flagged"}
          {signal.uncertain ? " · uncertain" : ""}
        </span>
      </div>
      <p className="signal-body">{signal.explanation}</p>
      {signal.evidenceSnippet?.text ? (
        <blockquote className="snippet">{signal.evidenceSnippet.text}</blockquote>
      ) : null}
    </div>
  );
}

export function TrustReportView({ report }: { report: TrustReport }) {
  const scoreLabel =
    report.trustScore === null ? "Score withheld" : String(report.trustScore);
  const confidencePct = Math.round(report.confidence * 100);

  return (
    <div className="report">
      <section className="score-block">
        <div className="score-row">
          <div>
            <div className="eyebrow">Trust Score</div>
            <div className="score-value">{scoreLabel}</div>
          </div>
          <div className="confidence">
            <div className="eyebrow">Confidence</div>
            <div className="confidence-value">{confidencePct}%</div>
          </div>
        </div>
        <p className="hint">
          A navigation aid — not a verdict of true or false.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>{report.summary}</p>
      </section>

      {report.reasons.length > 0 ? (
        <section>
          <h2>Reasons</h2>
          <ul className="reasons">
            {report.reasons.map((reason) => (
              <li key={reason.id}>
                <strong>{reason.signalType.replaceAll("_", " ")}</strong>
                <span>{reason.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2>Signals</h2>
        <SignalRow label="AI-era patterns" signal={report.signals.ai} />
        <SignalRow label="Clickbait rhetoric" signal={report.signals.clickbait} />
        <SignalRow label="Missing sources" signal={report.signals.missingSource} />
        <SignalRow label="Missing author" signal={report.signals.missingAuthor} />
      </section>

      {report.claims.length > 0 ? (
        <section>
          <h2>Claims</h2>
          <ul className="claims">
            {report.claims.map((claim) => (
              <li key={claim.id}>
                <div className="claim-text">{claim.text}</div>
                <div className="claim-meta">
                  {claim.type.replaceAll("_", " ")} ·{" "}
                  {Math.round(claim.confidence * 100)}% confidence
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {report.suggestions.length > 0 ? (
        <section>
          <h2>Suggestions</h2>
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
          <h2>Uncertainty</h2>
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
          <h2>Warnings</h2>
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
