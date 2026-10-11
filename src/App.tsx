import { useEffect, useRef, type WheelEvent } from 'react'
import wuttLogo from './assets/wutt-logo.png'
import './App.css'
import NextSection from './NextSection'

function App() {
  const scrollContainer = useRef<HTMLElement>(null)
  const isTransitioning = useRef(false)
  const transitionTimeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => window.clearTimeout(transitionTimeout.current)
  }, [])

  function handleWheel(event: WheelEvent<HTMLElement>) {
    if (event.deltaY === 0) return

    event.preventDefault()
    if (isTransitioning.current) return

    const container = scrollContainer.current
    if (!container) return

    const currentSection = Math.round(container.scrollTop / container.clientHeight)
    const targetSection = Math.max(
      0,
      Math.min(1, currentSection + Math.sign(event.deltaY)),
    )

    if (targetSection === currentSection) return

    isTransitioning.current = true
    container.scrollTo({
      top: targetSection * container.clientHeight,
      behavior: 'smooth',
    })
    transitionTimeout.current = window.setTimeout(() => {
      isTransitioning.current = false
    }, 1000)
  }

  return (
    <main
      className="page-scroll"
      ref={scrollContainer}
      onWheel={handleWheel}
    >
      <section className="app-background hero-section">
        <div className="wutt-logo">
          <img src={wuttLogo} alt="Wutt" />
        </div>
        <svg className="waterline" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
          <path className="wave wave-back" d="M0,80 C240,40 480,120 720,80 C960,40 1200,120 1440,80 C1680,40 1920,120 2160,80 C2400,40 2640,120 2880,80 L2880,160 L0,160 Z" />
          <path className="wave wave-front" d="M0,100 C240,60 480,140 720,100 C960,60 1200,140 1440,100 C1680,60 1920,140 2160,100 C2400,60 2640,140 2880,100 L2880,160 L0,160 Z" />
        </svg>
      </section>
      <NextSection />
    </main>
  )
}

export default App
