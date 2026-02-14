export default function ResultCard({
  title,
  score,
  vibeSummary,
  redFlags = [],
  translations = [],
  nextMoves
}) {
  let scoreColor = "text-green-400"
  if (score >= 7) scoreColor = "text-red-500"
  else if (score >= 4) scoreColor = "text-yellow-400"

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6 border border-gray-700">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        <span className={`font-bold text-lg ${scoreColor}`}>
          {score}/10
        </span>
      </div>

      {/* Vibe Summary */}
      {vibeSummary && (
        <div className="bg-gray-700 p-3 rounded-lg italic text-gray-200">
          🧠 <span className="font-semibold">Vibe:</span> {vibeSummary}
        </div>
      )}

      {/* Red Flag Breakdown */}
      {redFlags.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold underline">🚩 Red Flag Breakdown</h4>
          {redFlags.map((rf, i) => (
            <div
              key={i}
              className="bg-gray-900 p-3 rounded-lg border border-gray-700"
            >
              <div className="flex justify-between">
                <span className="font-bold">{rf.category}</span>
                <span>{"🚩".repeat(rf.severity)}</span>
              </div>
              <p className="text-sm text-gray-300 mt-1">
                <strong>What happened:</strong> {rf.indicator}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Evidence:</strong> “{rf.evidence}”
              </p>
              <p className="text-sm text-red-300 mt-1">
                <strong>Interpretation:</strong> {rf.interpretation}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Read Between The Lines */}
      {translations.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold underline">🕵️ Read Between the Lines</h4>
          {translations.map((t, i) => (
            <div key={i} className="bg-gray-900 p-3 rounded-lg">
              <p className="text-gray-300">
                <strong>User text:</strong> “{t.user_text}”
              </p>
              <p className="text-yellow-300 mt-1">
                <strong>AI translation:</strong> {t.ai_translation}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Next Moves */}
      {nextMoves && (
        <div className="space-y-2">
          <h4 className="font-semibold underline">🎯 Your Next Move</h4>
          <div className="space-y-1 text-sm">
            <p><strong>The Pivot:</strong> {nextMoves.pivot}</p>
            <p><strong>Slow Down:</strong> {nextMoves.slow_down}</p>
            <p className="text-red-400">
              <strong>Eject Button:</strong> {nextMoves.eject}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
