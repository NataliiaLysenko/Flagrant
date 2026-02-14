export default function RedFlagResult({
  score = 0,
  vibeSummary = "No summary available",
  redFlags = [],
  translations = [],
  nextMoves = {}
}) {
  // Safe defaults
  const safeFlags = Array.isArray(redFlags) ? redFlags : [];
  const safeTranslations = Array.isArray(translations) ? translations : [];
  const safeNextMoves = (nextMoves && typeof nextMoves === "object") ? nextMoves : {};

  // Dynamic GIF based on score
  const getGifForScore = () => {
    if (score === 10 || score < 0) return "/gifs/tenred.gif";
    if (score >= 7 && score<10) return "/gifs/run-red.gif";
    if (score >= 4 && score<10) return "/gifs/sus.gif";
    return "/gifs/green-flags.gif";
  };

  // Dynamic score color
  let scoreColor = "text-green-600"; // default: low-risk
  if (score >= 7) scoreColor = "text-red-600";     // high-risk → red
  else if (score >= 4) scoreColor = "text-yellow-500"; // medium-risk → yellow

  return (
    <div className="redflag-result space-y-6">
      {/* CARD 1 — MAIN SCORE */}
      <div className="rf-card rf-main p-4 bg-gray-50 rounded-lg shadow-sm">
        <div className="score-container text-center">
          <div className={`rf-score text-4xl font-extrabold ${scoreColor}`}>{score}/10</div>
          <p className="rf-summary text-lg mt-2">{vibeSummary}</p>

          {/* GIF */}
          <div className="score-gif-box mt-4">
            <img
              src={getGifForScore()}
              alt="Score reaction GIF"
              className="score-gif-media w-full max-w-sm mx-auto rounded-md shadow-md"
            />
          </div>
        </div>
      </div>

      <div className="rf-card rf-flags">
        <h4 className="result-header">🚩 Red Flag Breakdown</h4>
        {safeFlags.length > 0 ? (
          <div className="flags-container">
            {safeFlags.map((flag, i) => (
              <div key={i} className={`flag-item severity-${flag.severity || 'low'}`}>
                <div className="flag-header">
                  <span className="flag-category">{flag.category || "General Warning"}</span>
                  {flag.severity && <span className="severity-badge">{flag.severity}</span>}
                </div>
                
                <p className="flag-indicator">{flag.indicator}</p>
                
                {flag.interpretation && (
                  <div className="flag-detail interpretation">
                    <strong>Analysis:</strong> {flag.interpretation}
                  </div>
                )}
                
                {flag.evidence && (
                  <div className="flag-detail evidence">
                    <strong>Evidence:</strong> “{flag.evidence}”
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-flags">Green flags only. You're safe (for now). 🌿</p>
        )}
      </div>

      <div className="rf-right flex flex-col gap-6">
          {/* CARD 3 — TRANSLATIONS */}
          <div className="rf-card rf-translate">
            <h4 className="result-header">🗣 Translation</h4>
            {safeTranslations.length > 0 ? (
              <table className="analysis-table">
                <thead>
                  <tr>
                    <th>User Text</th>
                    <th>AI Translation</th>
                  </tr>
                </thead>
                <tbody>
                  {safeTranslations.map((t, i) => (
                    <tr key={i}>
                      <td className="user-text-cell">“{t.user_text}”</td>
                      <td className="ai-result-cell">{t.ai_translation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No translations available.</p>
            )}
          </div>

          {/* CARD 4 — NEXT MOVES */}
          <div className="rf-card rf-next">
            <h4 className="result-header">🧠 Next Moves</h4>
            {Object.keys(safeNextMoves).length > 0 ? (
              <div className="next-moves-container">
                {Object.entries(safeNextMoves).map(([key, value]) => (
                  <div key={key} className="next-move-item">
                    <span className="move-label">{key.replace(/_/g, " ")}</span>
                    <p className="move-content">{value || "No specific advice."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">Stay the course.</p>
            )}
          </div>
      </div>
    </div>
  );
}
