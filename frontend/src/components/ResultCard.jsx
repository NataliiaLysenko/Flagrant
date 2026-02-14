export default function ResultCard({ title, score, flags = [], analysis = [], advice }) {
  let scoreColor = "text-red-400"
  if (score >= 7) scoreColor = "text-green-400"
  else if (score >= 4) scoreColor = "text-yellow-300"

  let finalAdvice = advice || "You guys would make a lovely couple! Just need some work on that! 💚"
  if (scoreColor === "text-red-400") {
    finalAdvice = "⚠️ Warning! There are red flags. You better run! 🚩"
  } else if (scoreColor === "text-yellow-300") {
    finalAdvice = "⚠️ Some caution advised. Things may need work. You might want to have a few more dates to see if the vibes improve! 🟡"
  }

  return (
   <div className="result-card">

    {/* HEADER */}
    <div className="header">
      <h3>{title}</h3>
      <div className={`score ${scoreColor}`}>
        {score}/10
      </div>
    </div>

    {/* ANALYSIS GRID */}
    {analysis?.length > 0 && (
      <div className="analysis-grid">
        <div className="analysis-card emotional">
          <h4>💖 Emotional Fit 💖</h4>
          <h5>{analysis[0]?.detail || "N/A"}</h5>
        </div>
        <div className="analysis-card lifestyle">
          <h4>💗 Lifestyle Fit 💗</h4>
          <h5>{analysis[1]?.detail || "N/A"}</h5>
        </div>
        <div className="analysis-card chaos">
          <h4>💋 Chaos Risk 💋</h4>
          <h5>{analysis[2]?.detail || "N/A"}</h5>
        </div>
        <div className="analysis-card commentary">
          <h4>💌 Commentary 💌</h4>
          <h5>{analysis[3]?.detail || "N/A"}</h5>
        </div>
      </div>
    )}

    {/* FINAL VERDICT */}
    {advice && (
      <div className="final-verdict">
        <h4>✨ Final Verdict ✨</h4>
        <h5>{finalAdvice}</h5>
      </div>
    )}

  </div>

  )
}
