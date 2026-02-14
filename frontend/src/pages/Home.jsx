import { Link } from "react-router-dom"

export default function Home() {
  return (
    <section className="home-page">
      <div className="spark spark-a" />
      <div className="spark spark-b" />
      <div className="spark spark-c" />
      <div className="ring ring-a" />
      <div className="ring ring-b" />
      <div className="ring ring-c" />

      <div className="app-panel">
        <p className="tagline">match signals, catch red flags</p>
        <div className="hero-card">
          <span className="moon" />
          <h1>Flagrant</h1>
          <p>match your vibes and expose suspicious texting behavior</p>
        </div>

        <div className="home-actions">
          <Link to="/match" className="cta-link">match me</Link>
          <Link to="/redflag" className="cta-link cta-link-alert">detect red flags</Link>
        </div>

        <p className="hint">the lab for pairing people and auditing their chat drama</p>
      </div>
    </section>
  )
}
