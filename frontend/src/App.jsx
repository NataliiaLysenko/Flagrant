import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Match from "./pages/Match"
import RedFlag from "./pages/RedFlag"
import "./App.css"

function App() {
  return (
    <div className="app-frame">
      <main className="page-slot">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<Match />} />
          <Route path="/redflag" element={<RedFlag />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
