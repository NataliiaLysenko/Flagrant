export default function ResultCard({ title, score, flags = [], analysis = [], advice }) {
  // Determine score color
  let scoreColor = "text-red-400";
  if (score >= 8) scoreColor = "text-green-400";
  else if (score >= 5) scoreColor = "text-yellow-300";

  // Final advice text
  let finalAdvice = advice || "You guys would make a lovely couple! Just need some work on that! 💚";
  if (scoreColor === "text-red-400") {
    finalAdvice = "⚠️ Warning! There are red flags. You better run! 🚩";
  } else if (scoreColor === "text-yellow-300") {
    finalAdvice = "⚠️ Some caution advised. Things may need work. You might want a few more dates to see if the vibes improve! 🟡";
  }

  // GIF helper based on score ranges
  const getGifForScore = () => {
    if (score <= 4) return "/gifs/run-match.gif";       // low score → run!
    if (score <= 7) return "/gifs/norm.gif";            // medium score → normal
    return "/gifs/matching.gif";                        // high score → matching
  };

  return (
    <div className="result-card p-4 bg-gray-50 rounded-lg shadow-md space-y-4">

      {/* HEADER */}
      <div className="header flex flex-col items-center">
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className={`score text-3xl font-extrabold mt-2 ${scoreColor}`}>{score}/10</div>

        {/* GIF */}
        <div className="score-gif-box mt-4">
          <img
            src={getGifForScore()}
            alt="Score reaction GIF"
            className="score-gif-media w-full max-w-xs rounded-md shadow-sm"
          />
        </div>
      </div>

      {/* ANALYSIS GRID */}
      {analysis?.length > 0 && (
        <div className="analysis-grid grid grid-cols-2 gap-4 mt-4">
          <div className="analysis-card emotional p-2 bg-pink-50 rounded">
            <h4 className="font-bold text-pink-600">💖 Emotional Fit 💖</h4>
            <h5>{analysis[0]?.detail || "N/A"}</h5>
          </div>
          <div className="analysis-card lifestyle p-2 bg-purple-50 rounded">
            <h4 className="font-bold text-purple-600">💗 Lifestyle Fit 💗</h4>
            <h5>{analysis[1]?.detail || "N/A"}</h5>
          </div>
          <div className="analysis-card chaos p-2 bg-red-50 rounded">
            <h4 className="font-bold text-red-600">💋 Chaos Risk 💋</h4>
            <h5>{analysis[2]?.detail || "N/A"}</h5>
          </div>
          <div className="analysis-card commentary p-2 bg-blue-50 rounded">
            <h4 className="font-bold text-blue-600">💌 Commentary 💌</h4>
            <h5>{analysis[3]?.detail || "N/A"}</h5>
          </div>
        </div>
      )}

      {/* FINAL VERDICT */}
      {advice && (
        <div className="final-verdict mt-4 p-2 bg-green-50 rounded">
          <h4 className="font-bold text-green-700">✨ Final Verdict ✨</h4>
          <h5>{finalAdvice}</h5>
        </div>
      )}
    </div>
  );
}
