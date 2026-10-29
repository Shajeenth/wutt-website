import wuttLogo from './assets/wutt-logo.png'
import './App.css'
import NextSection from './NextSection'
import DarkerSection from './DarkerSection'
import SponsorsSection from './SponsorsSection'
import Footer from './Footer'
import Navbar from './Navbar'

function App() {
  return (
    <>
    <Navbar />
    <main className="page-scroll">
      <section className="app-background hero-section" id="home">
        <div className="wutt-logo">
          <img src={wuttLogo} alt="Wutt" />
        </div>
        <svg className="waterline" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="water-surface-gradient" x1="0" y1="60" x2="0" y2="160" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--water-surface)" />
              <stop offset="100%" stopColor="var(--deep-water)" />
            </linearGradient>
          </defs>
          <path className="wave wave-back" d="M0,80 C240,40 480,120 720,80 C960,40 1200,120 1440,80 C1680,40 1920,120 2160,80 C2400,40 2640,120 2880,80 L2880,160 L0,160 Z" />
          <path className="wave wave-front" d="M0,100 C240,60 480,140 720,100 C960,60 1200,140 1440,100 C1680,60 1920,140 2160,100 C2400,60 2640,140 2880,100 L2880,160 L0,160 Z" />
        </svg>
      </section>
      <div className="water-sections">
        <NextSection />
        <DarkerSection />
        <SponsorsSection />
        <Footer />
      </div>
    </main>
    </>
  )
}

export default App
