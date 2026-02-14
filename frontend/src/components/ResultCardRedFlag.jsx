export default function ResultCard({
  score = 0,
  vibeSummary,
  redFlags = [],
  translations = [],
  nextMoves = {}
}) {
  // Theme logic for score
  const getTheme = () => {
    if (score >= 7)
      return {
        color: "text-red-400",
        bg: "bg-red-500/20",
        label: "Run for the Hills",
        pulse: "animate-pulse",
      };
    if (score >= 4)
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-400/20",
        label: "Proceed with Caution",
        pulse: "",
      };
    return {
      color: "text-green-400",
      bg: "bg-green-400/20",
      label: "Green Flags Only",
      pulse: "",
    };
  };

  const theme = getTheme();
  const rotation = (score / 10) * 180 - 180;

  // Hardcoded Tailwind classes for Next Moves
  const borderClasses = {
    pivot: "border-l-4 border-blue-500",
    slow_down: "border-l-4 border-yellow-500",
    eject: "border-l-4 border-red-500",
  };
  const textClasses = {
    pivot: "text-blue-500",
    slow_down: "text-yellow-500",
    eject: "text-red-500",
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-[#2a0d1a9c] via-[#ffcfda45]/20 to-[#ffffff08] shadow-xl">

      {/* --- Hero Meter --- */}
      <div className="flex flex-col items-center mb-12 relative">
        <div className="relative w-80 h-80 overflow-visible">
          {/* Background semi-circle */}
          <div className="absolute w-80 h-80 border-[16px] border-gray-800/40 rounded-full" />
          
          {/* Score Gauge */}
          <div
            className={`absolute w-80 h-80 border-[16px] border-transparent rounded-full ${theme.color} transition-transform duration-1000 ease-out`}
            style={{ borderTopColor: "currentColor", transform: `rotate(${rotation}deg)` }}
          />

          {/* Score Number */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
            <span className={`text-6xl font-black ${theme.color} ${theme.pulse}`}>
              {score}<span className="text-2xl text-gray-300">/10</span>
            </span>
          </div>
        </div>

        {/* Vibe Summary */}
        {vibeSummary && (
          <p className="mt-4 text-center text-pink-100 italic text-lg max-w-xl">
            "{vibeSummary}"
          </p>
        )}
      </div>

      {/* --- Two-column layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* --- Left Column: Red Flags --- */}
        <div className="space-y-6 w-full">
          <h4 className="text-xl font-bold text-pink-200 flex items-center gap-2">
            <span className="text-2xl">🚩</span> RED FLAG BREAKDOWN
          </h4>
          {redFlags.length > 0 ? redFlags.map((rf, i) => (
            <div key={i} className="bg-pink-900/30 border border-pink-600/30 p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">
                  {rf.category}
                </span>
                <span className="text-lg">{"🚩".repeat(rf.severity)}</span>
              </div>
              <h5 className="font-bold text-pink-100 mb-1">{rf.indicator}</h5>
              <p className="text-sm text-pink-200 italic mb-2">"{rf.evidence}"</p>
              <div className="text-sm text-red-300 bg-red-900/20 p-3 rounded-lg border border-red-900/30">
                <strong>Insight:</strong> {rf.interpretation}
              </div>
            </div>
          )) : <p className="text-pink-300 italic">Analysis clear. No immediate flags.</p>}
        </div>

        {/* --- Right Column: Translations + Next Moves --- */}
        <div className="space-y-10 w-full">

          {/* --- Translations --- */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-pink-200 flex items-center gap-2">
              <span className="text-2xl">🕵️</span> READ BETWEEN THE LINES
            </h4>
            {translations.map((t, i) => (
              <div key={i} className="bg-pink-900/10 border border-pink-500/20 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-pink-400 uppercase">They Said:</p>
                <p className="text-pink-100 italic">"{t.user_text}"</p>
                <p className="text-[10px] font-bold text-pink-300 uppercase mt-2">AI Translation:</p>
                <p className="text-pink-50 font-medium">{t.ai_translation}</p>
              </div>
            ))}
          </div>

          {/* --- Next Moves --- */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-pink-200 flex items-center gap-2">
              <span className="text-2xl">🎯</span> YOUR NEXT MOVE
            </h4>
            {Object.entries(nextMoves).map(([key, val], i) => (
              <div key={i} className={`flex items-start gap-4 p-4 bg-pink-900/20 rounded-xl ${borderClasses[key]}`}>
                <div className={`min-w-[80px] text-[10px] font-black uppercase pt-1 ${textClasses[key]}`}>
                  {key.replace("_", " ").toUpperCase()}
                </div>
                <p className="text-sm text-pink-100">{val}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
