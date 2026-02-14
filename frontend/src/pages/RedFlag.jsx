import { useState } from "react"
<<<<<<< Updated upstream
=======
import ResultCard from "../components/ResultCardRedFlag"
>>>>>>> Stashed changes
import Disclaimer from "../components/Disclaimer"


export default function RedFlag() {
  const [messages, setMessages] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    setLoading(true)
<<<<<<< Updated upstream
    const res = await fetch("http://localhost:8000/redflag/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    })
    const data = await res.json()
    setResult(data.analysis)
=======
    try {
      const res = await fetch("http://localhost:8000/redflag/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, mode })
      })
      const data = await res.json()
      console.log("Backend returned:", data)

      // Ensure safe defaults
      setResult({
        score: data?.score ?? 0,
        vibeSummary: data?.vibe_summary ?? "",
        redFlags: Array.isArray(data?.red_flags) ? data.red_flags : [],
        translations: Array.isArray(data?.translations) ? data.translations : [],
        nextMoves: data?.next_moves ?? null
      })
    } catch (err) {
      console.error(err)
      setResult({
        score: 0,
        flags: [],
        analysis: [],
        advice: "Error analyzing the messages"
      })
    }
>>>>>>> Stashed changes
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">🚩 Red Flag Detector</h2>

      <textarea
        placeholder="Paste chat logs here..."
        className="w-full h-40 p-3 text-black"
        onChange={e => setMessages(e.target.value)}
      />

      <button
        onClick={analyze}
        className="px-6 py-3 bg-red-600 rounded-xl"
      >
        {loading ? "Analyzing..." : "Detect Red Flags"}
      </button>

      {result && (
<<<<<<< Updated upstream
        <>
            <pre className="bg-black p-4 rounded-xl whitespace-pre-wrap">
            {result}
            </pre>
            <Disclaimer />
        </>
        )}
=======
        <div className="mt-6">
          <ResultCard
            title="🚩 Red Flag Analysis"
            score={result.score}
            vibeSummary={result.vibeSummary}
            redFlags={result.redFlags}
            translations={result.translations}
            nextMoves={result.nextMoves}
          />
          <Disclaimer />
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  )
}
