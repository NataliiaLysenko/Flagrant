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
    <section className="feature-page redflag-page">
      <div className="feature-panel">
        <h2>Red Flag Detector</h2>
        <p className="feature-subtitle">drop chat logs and scan for warning patterns</p>

        <textarea
          placeholder="Paste chat logs here..."
          className="feature-input"
          value={messages}
          onChange={e => setMessages(e.target.value)}
        />

        <div className="mode-row">
          <span>Mode:</span>
          {["honest", "delulu"].map((m) => (
            <label key={m} className="mode-option">
              <input
                type="radio"
                name="mode"
                value={m}
                checked={mode === m}
                onChange={e => setMode(e.target.value)}
              />
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </label>
          ))}
        </div>

        <button onClick={analyze} className="feature-button redflag-button">
          {loading ? "Analyzing..." : "Detect Red Flags"}
        </button>

        {result && (
          <div className="feature-result">
            <ResultCard
              title="Red Flag Analysis"
              score={result.score}
              flags={result.flags}
              analysis={result.analysis}
              advice={result.advice}
            />
            <Disclaimer />
          </div>
        )}
      </div>
    </section>
  )
}
