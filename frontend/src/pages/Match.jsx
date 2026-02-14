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
      console.log("Match backend returned:", data)

      setResult({
        compatibility: data?.compatibility ?? 0,
        emotional_fit: data?.emotional_fit ?? "N/A",
        lifestyle_fit: data?.lifestyle_fit ?? "N/A",
        chaos_risk: data?.chaos_risk ?? "N/A",
        commentary: data?.commentary ?? "",
        verdict: data?.verdict ?? "⚠️"
      })
    } catch (err) {
      console.error(err)
      setResult({
        compatibility: 0,
        emotional_fit: "N/A",
        lifestyle_fit: "N/A",
        chaos_risk: "N/A",
        commentary: "Error analyzing match",
        verdict: "⚠️"
      })
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-pink-600">💘 Compatibility Check</h2>

      <textarea
        placeholder="Describe YOU (name, age, major, hobbies, values)"
        className="w-full h-32 p-3 text-black rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        value={user}
        onChange={e => setUser(e.target.value)}
      />

      <textarea
        placeholder="Describe CRUSH"
        className="w-full h-32 p-3 text-black rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        value={crush}
        onChange={e => setCrush(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-semibold transition-colors"
      >
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      {result && (
        <div className="mt-6">
          <ResultCard
            title="💘 Match Result"
            score={result.compatibility}
            flags={[]} // not used for match
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
  )
}
