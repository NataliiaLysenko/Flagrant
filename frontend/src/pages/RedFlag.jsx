import { useState } from "react"
import ResultCard from "../components/ResultCard"
import Disclaimer from "../components/Disclaimer"

export default function RedFlag() {
  const [messages, setMessages] = useState("")
  const [mode, setMode] = useState("honest")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    setLoading(true)
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
        flags: Array.isArray(data?.flags) ? data.flags : [],
        analysis: Array.isArray(data?.analysis) ? data.analysis : [],
        advice: data?.advice ?? "No advice available"
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
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-red-600">🚩 Red Flag Detector</h2>

      <textarea
        placeholder="Paste chat logs here..."
        className="w-full h-48 p-3 text-black rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        value={messages}
        onChange={e => setMessages(e.target.value)}
      />

      <div className="flex gap-4 items-center">
        <span className="font-semibold">Mode:</span>
        {["honest", "delulu"].map((m) => (
          <label key={m} className="flex items-center gap-1">
            <input
              type="radio"
              name="mode"
              value={m}
              checked={mode === m}
              onChange={e => setMode(e.target.value)}
              className="accent-red-500"
            />
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </label>
        ))}
      </div>

      <button
        onClick={analyze}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-colors"
      >
        {loading ? "Analyzing..." : "Detect Red Flags"}
      </button>

      {result && (
        <div className="mt-6">
          <ResultCard
            title="🚩 Red Flag Analysis"
            score={result.score}
            flags={result.flags}
            analysis={result.analysis}
            advice={result.advice}
          />
          <Disclaimer />
        </div>
      )}
    </div>
  )
}
