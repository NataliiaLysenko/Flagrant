import { useState } from "react"
import { Link } from "react-router-dom"
import RedFlagResult from "../components/ResultCardRedFlag"
import Disclaimer from "../components/Disclaimer"

export default function RedFlag() {
  const [messages, setMessages] = useState("")
  const [mode, setMode] = useState("honest")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!messages) return alert("Paste some messages first 😤")
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/redflag/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, mode })
      })
      const data = await res.json()
      console.log("Redflag API response:", data)  // 🔍 check backend response

      setResult({
        score: typeof data?.score === "number" ? data.score : 0,
        vibeSummary: data?.vibe_summary ?? "",
        redFlags: Array.isArray(data?.red_flags)
          ? data.red_flags
          : [],
        translations: Array.isArray(data?.translations)
          ? data.translations
          : [],
        nextMoves: data?.next_moves && typeof data.next_moves === "object"
          ? data.next_moves
          : { pivot: "", slow_down: "", eject: "" }  // safe default
      })
    } catch (err) {
      console.error("Error analyzing messages:", err)
      setResult({
        score: 0,
        redFlags: [],
        translations: [],
        vibeSummary: "",
        nextMoves: { pivot: "Error", slow_down: "Error", eject: "Error" }
      })
    }
    setLoading(false)
  }

  return (
    <section className="feature-page redflag-page">
      <div className="feature-panel">
        <Link to="/" className="feature-back-link">Back to Home</Link>
        <h2>🚩 Red Flag Detector</h2>
        <p className="feature-subtitle">Paste a conversation. We’ll read between the lines.</p>

        {/* Chat Log */}
        <textarea
          placeholder="Paste chat logs here..."
          className="feature-input min-h-[350px] text-lg"
          value={messages}
          onChange={e => setMessages(e.target.value)}
        />

        {/* Tone / Mode */}
        <div className="mode-row">
          <p className="mode-label">Tone:</p>
          <div className="mode-toggle-group">
            {["honest", "delulu"].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`mode-toggle ${mode === m ? "is-active" : ""}`}
              >
                {m === "honest" ? "Brutally Honest" : "Delulu Mode"}
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={analyze}
            disabled={loading || !messages}
            className="feature-button redflag-button px-12 py-4"
          >
            {loading ? "Analyzing..." : "Detect Red Flags 🚩"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="feature-result">
            <RedFlagResult
              title="🚨 Analysis Result"
              score={result.score}
              vibeSummary={result.vibeSummary}
              redFlags={result.redFlags}
              translations={result.translations}
              nextMoves={result.nextMoves}
            />
            <Disclaimer />
          </div>
        )}
      </div>
    </section>
  )
}
