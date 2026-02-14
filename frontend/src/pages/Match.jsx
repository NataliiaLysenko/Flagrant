import { useState } from "react"
import ResultCard from "../components/ResultCard"
import Disclaimer from "../components/Disclaimer"

export default function Match() {
  const [user, setUser] = useState({
    gender: "",
    age: "",
    role: "",
    mbti: "",
    sign: "",
    hobbies: "",
    appearance: ""
  })

  const [crush, setCrush] = useState({
    gender: "",
    age: "",
    role: "",
    mbti: "",
    sign: "",
    hobbies: "",
    appearance: ""
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const renderInput = (label, field, state, setState, placeholder="") => (
  <div className="space-y-1">
    <label className="font-semibold text-sm text-gray-200">{label}</label>
    <input
      className="w-full p-2 text-black rounded-md border"
      placeholder={placeholder}
      value={state[field]}
      onChange={e => setState({ ...state, [field]: e.target.value })}
    />
  </div>
)

  const handleSubmit = async () => {
    if (!user.gender || !crush.gender) return alert("Fill both profiles 😤")
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

      <div className="grid md:grid-cols-2 gap-6">

        {/* YOU */}
        <div className="bg-pink-100 p-4 rounded-xl space-y-3 text-black">
          <h3 className="text-xl font-bold text-pink-600">🧍 You</h3>

          {renderInput("Gender", "gender", user, setUser)}
          {renderInput("Age", "age", user, setUser)}
          {renderInput("Occupation / Role", "role", user, setUser, "student, engineer, etc")}
          {renderInput("MBTI", "mbti", user, setUser, "INTJ, ENFP, etc")}
          {renderInput("Zodiac Sign", "sign", user, setUser)}
          {renderInput("Hobbies", "hobbies", user, setUser, "music, gym, gaming, etc")}
          {renderInput("Appearance", "appearance", user, setUser, "gorgeous / pretty / average")}
        </div>

        {/* CRUSH */}
        <div className="bg-purple-100 p-4 rounded-xl space-y-3 text-black">
          <h3 className="text-xl font-bold text-purple-600">💖 Your Crush</h3>

          {renderInput("Gender", "gender", crush, setCrush)}
          {renderInput("Age", "age", crush, setCrush)}
          {renderInput("Occupation / Role", "role", crush, setCrush)}
          {renderInput("MBTI", "mbti", crush, setCrush)}
          {renderInput("Zodiac Sign", "sign", crush, setCrush)}
          {renderInput("Hobbies", "hobbies", crush, setCrush)}
          {renderInput("Appearance", "appearance", crush, setCrush)}
        </div>

      </div>

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
