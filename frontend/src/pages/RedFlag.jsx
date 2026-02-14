import { useState } from "react"
import Disclaimer from "../components/Disclaimer"


export default function RedFlag() {
  const [messages, setMessages] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    setLoading(true)
    const res = await fetch("http://localhost:8000/redflag/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    })
    const data = await res.json()
    setResult(data.analysis)
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
