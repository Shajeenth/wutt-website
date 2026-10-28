import FloatingTitle from './FloatingTitle'
import sectionDots from './sectionDots'

function SponsorsSection() {
  return (
    <section className="sponsors-section" id="sponsors" aria-labelledby="our-sponsors-title">
      <div className="about-container">
        <FloatingTitle id="our-sponsors-title" text="our sponsors" />
        <div className="about-panels">
          <div className="about-panel" />
          <div className="about-panel" />
        </div>
      </div>
      <span className="section-dots" aria-hidden="true">
        {sectionDots.map(([left, top, size], index) => (
          <span
            className={`section-dot ${
              index < Math.ceil(sectionDots.length / 2)
                ? 'section-dot--left'
                : 'section-dot--right'
            }`}
            key={index}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDuration: `${120 + index * 12}s`,
            }}
          />
        ))}
      </span>
    </section>
  )
}

export default SponsorsSection
