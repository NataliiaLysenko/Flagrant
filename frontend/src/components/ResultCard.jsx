export default function ResultCard({ title, score, flags = [], analysis = [], advice }) {
  let scoreColor = "text-green-500"
  if (score >= 7) scoreColor = "text-red-500"
  else if (score >= 4) scoreColor = "text-yellow-400"

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        <span className={`font-bold ${scoreColor}`}>{score}/10</span>
      </div>

      {flags?.length > 0 && (
        <div className="space-y-1">
          <h4 className="font-semibold underline">Detected Red Flags:</h4>
          <ul className="list-disc list-inside">
            {flags.map((f, i) => (
              <li key={i}>
                <span className="font-bold">{f.name}:</span> {f.detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis?.length > 0 && (
        <div className="space-y-1">
          <h4 className="font-semibold underline">Short Analysis:</h4>
          <ul className="list-disc list-inside">
            {analysis.map((a, i) => (
              <li key={i}>
                <span className="font-bold">{a.flag}:</span> {a.detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      {advice && (
        <div className="space-y-1">
          <h4 className="font-semibold underline">Advice:</h4>
          <p>{advice}</p>
        </div>
      )}

    </div>
  )
}
