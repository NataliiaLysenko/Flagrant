import { useState } from "react"
import Disclaimer from "../components/Disclaimer"


export default function Match() {
  const [user, setUser] = useState({})
  const [crush, setCrush] = useState({})
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch("http://localhost:8000/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, crush })
    })
    const data = await res.json()
    setResult(data.result)
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">💘 Compatibility Check</h2>

      <textarea
        placeholder="Describe YOU (name, age, major, hobbies, values)"
        className="w-full p-3 text-black"
        onChange={e => setUser({ profile: e.target.value })}
      />

      <textarea
        placeholder="Describe CRUSH"
        className="w-full p-3 text-black"
        onChange={e => setCrush({ profile: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-pink-600 rounded-xl"
      >
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      {result && (
        <>
            <pre className="bg-black p-4 rounded-xl whitespace-pre-wrap">
            {result}
            </pre>
            <Disclaimer />
        </>
        )}
    </div>
  )
}
