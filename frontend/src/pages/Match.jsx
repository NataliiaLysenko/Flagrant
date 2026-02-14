import { useState } from "react"
import { Link } from "react-router-dom"
import ResultCard from "../components/ResultCard"
import Disclaimer from "../components/Disclaimer"

export default function Match() {
  const [user, setUser] = useState({
    gender: "",
    age: "",
    role: "",
    mbti: "",
    sign: "",
    interest: "",
    description: ""
  })

  const [crush, setCrush] = useState({
    gender: "",
    age: "",
    role: "",
    mbti: "",
    sign: "",
    interest: "",
    description: ""
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const renderInput = (label, field, state, setState, placeholder="") => (
  <div className="flex flex-col space-y-3">
    <label className="font-semibold text-sm text-gray-200">{label}</label>
    <input
      className="mini-input"
      placeholder={placeholder}
      value={state[field]}
      onChange={e => setState({ ...state, [field]: e.target.value })}
    />
  </div>
)

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
        <Link to="/" className="feature-back-link">Back to Home</Link>
        <h2>👓 Compatibility Check</h2>
        <p className="feature-subtitle">compare vibes, values, and emotional bandwidth</p>

      <div className="profile-grid">

        {/* YOU */}
        <div className="bg-pink-100 p-4 rounded-xl gap-4">
          <h3>🥰 You</h3>

          {renderInput("Gender", "gender", user, setUser, "male, female, non-binary, etc")}
          {renderInput("Age", "age", user, setUser)}
          {renderInput("Occupation / Role", "role", user, setUser, "student, engineer, etc")}
          {renderInput("MBTI", "mbti", user, setUser, "INTJ, ENFP, etc")}
          {renderInput("Zodiac Sign", "sign", user, setUser)}
          {renderInput("Interest", "interest", user, setUser, "music, gym, gaming, etc")}
          {renderInput("Description", "description", user, setUser, "a bit about your personality, values, lifestyle, etc")}
        </div>

        {/* CRUSH */}
        <div className="bg-pink-100 p-4 rounded-xl gap-4">
          <h3>💖 Your Crush</h3>

          {renderInput("Gender", "gender", crush, setCrush, "male, female, non-binary, etc")}
          {renderInput("Age", "age", crush, setCrush)}
          {renderInput("Occupation / Role", "role", crush, setCrush, "student, engineer, etc")}
          {renderInput("MBTI", "mbti", crush, setCrush, "INTJ, ENFP, etc")}
          {renderInput("Zodiac Sign", "sign", crush, setCrush)}
          {renderInput("Interest", "interest", crush, setCrush, "music, gym, gaming, etc")}
          {renderInput("Description", "description", crush, setCrush,"paste from their bio 👀")}
        </div>

      </div>

        <button onClick={handleSubmit} className="feature-button match-button">
          {loading ? "Analyzing..." : "Analyze Match"}
        </button>

        {loading && (
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="w-6 h-6 border-2 border-pink-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-300 animate-pulse">
            Matching wavelengths... almost there ✨
          </p>
        </div>
        )}
      
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
