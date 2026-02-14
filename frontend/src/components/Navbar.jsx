import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="p-4 flex gap-6 bg-black border-b border-gray-800">
      <Link to="/" className="font-bold text-pink-400">💗 Flagrant 💗</Link>
      <Link to="/match">Match</Link>
      <Link to="/redflag">Red Flags</Link>
    </nav>
  )
}
