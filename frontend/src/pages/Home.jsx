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
          <p>find your match. expose the red flags.</p>
        </div>

        <div className="home-actions">
          <Link to="/match" className="cta-link">match me</Link>
          <Link to="/redflag" className="cta-link cta-link-alert">detect red flags</Link>
        </div>

        <p className="hint">the lab for pairing people and auditing their chat drama</p>
      </div>

      <aside className="chaos-preview" aria-label="chaos score preview">
        <p className="chaos-quote">"It&apos;s fine. Do whatever you want."</p>
        <div className="chaos-bar" role="img" aria-label="Chaos risk seven out of ten">
          <div className="chaos-fill" />
        </div>
        <p className="chaos-result">
          Passive aggression detected. <span className="chaos-meter-inline">Red-o-Meter:&nbsp;7/10.</span>
        </p>
      </aside>

      <div className="footer-marquee" aria-label="entertainment disclaimer">
        <div className="marquee-track">
          <span>
            This app was built purely for entertainment purposes. Please take all results with a pinch - or maybe two - of salt. Happy Saint Valentine&apos;s Day.
          </span>
          <span aria-hidden="true">
            This app was built purely for entertainment purposes. Please take all results with a pinch - or maybe two - of salt. Happy Saint Valentine&apos;s Day.
          </span>
        </div>
      </div>
    </section>
  )
}
