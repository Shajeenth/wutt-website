import sectionDots from './sectionDots'
import FloatingTitle from './FloatingTitle'

function DarkerSection() {
  return (
    <section className="darker-section" id="our-team" aria-labelledby="our-team-title">
      <div className="about-container">
        <FloatingTitle id="our-team-title" text="our team" />
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

export default DarkerSection
