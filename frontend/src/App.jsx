import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Match from "./pages/Match"
import RedFlag from "./pages/RedFlag"
import Navbar from "./components/Navbar"

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
        <Route path="/redflag" element={<RedFlag />} />
      </Routes>
    </div>
  )
}

export default App
