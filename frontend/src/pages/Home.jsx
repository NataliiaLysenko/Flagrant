import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
      <h1 className="text-4xl font-bold">💗 Flagrant 💗</h1>
      <p className="text-gray-400">Avoid emotional damage 101</p>

      <Link to="/match" className="px-6 py-3 bg-pink-500 rounded-xl">
        💘 Match Me
      </Link>

      <Link to="/redflag" className="px-6 py-3 bg-red-500 rounded-xl">
        🚩 Detect Red Flags
      </Link>
    </div>
  )
}
