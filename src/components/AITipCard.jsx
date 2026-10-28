export default function AITipCard({ children, compact = false }) {
  return (
    <div className={`ai-tip-card${compact ? ' compact' : ''}`}>
      <div className="ai-orb"><i className="bi bi-stars" /></div>
      <div><div className="ai-label">A NOTE FOR YOU</div><p>{children}</p></div>
      <i className="bi bi-arrow-up-right ai-arrow" />
    </div>
  );
}
