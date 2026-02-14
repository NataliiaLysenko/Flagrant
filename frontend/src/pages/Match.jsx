import { useState } from "react"
import ResultCard from "../components/ResultCard"
import Disclaimer from "../components/Disclaimer"

export default function Match() {
  const [user, setUser] = useState("")
  const [crush, setCrush] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!user || !crush) return alert("Please fill both profiles")
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { profile: user },
          crush: { profile: crush }
        })
      })
      const data = await res.json()

      setResult({
        compatibility: data?.compatibility ?? 0,
        emotional_fit: data?.emotional_fit ?? "N/A",
        lifestyle_fit: data?.lifestyle_fit ?? "N/A",
        chaos_risk: data?.chaos_risk ?? "N/A",
        commentary: data?.commentary ?? "",
        verdict: data?.verdict ?? "warning"
      })
    } catch (err) {
      console.error(err)
      setResult({
        compatibility: 0,
        emotional_fit: "N/A",
        lifestyle_fit: "N/A",
        chaos_risk: "N/A",
        commentary: "Error analyzing match",
        verdict: "warning"
      })
    }
    setLoading(false)
  }

  return (
    <section className="feature-page match-page">
      <div className="feature-panel">
        <h2>Compatibility Check</h2>
        <p className="feature-subtitle">compare vibes, values, and emotional bandwidth</p>

        <textarea
          placeholder="Describe YOU (name, age, major, hobbies, values)"
          className="feature-input"
          value={user}
          onChange={e => setUser(e.target.value)}
        />

        <textarea
          placeholder="Describe CRUSH"
          className="feature-input"
          value={crush}
          onChange={e => setCrush(e.target.value)}
        />

        <button onClick={handleSubmit} className="feature-button match-button">
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>

        {result && (
          <div className="feature-result">
            <ResultCard
              title="Match Result"
              score={result.compatibility}
              flags={[]}
              analysis={[
                { flag: "Emotional Fit", detail: result.emotional_fit },
                { flag: "Lifestyle Fit", detail: result.lifestyle_fit },
                { flag: "Chaos Risk", detail: result.chaos_risk },
                { flag: "Funny Commentary", detail: result.commentary },
              ]}
              advice={result.verdict}
            />
            <Disclaimer />
          </div>
        )}
      </div>
    </section>
  )
}
