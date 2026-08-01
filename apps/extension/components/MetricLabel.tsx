export function MetricLabel({
  label,
  tooltip,
}: {
  label: string;
  tooltip: string;
}) {
  return (
    <div className="metric-label">
      <span className="eyebrow">{label}</span>
      <button
        type="button"
        className="info-tip"
        aria-label={tooltip}
        title={tooltip}
      >
        <span aria-hidden="true">i</span>
        <span className="info-tip-bubble" role="tooltip">
          {tooltip}
        </span>
      </button>
    </div>
  );
}
