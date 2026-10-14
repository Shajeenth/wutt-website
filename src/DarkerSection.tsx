import sectionDots from './sectionDots'
import HologramPanel from './HologramPanel'
import FloatingTitle from './FloatingTitle'

function DarkerSection() {
  return (
    <section className="darker-section" id="our-team" aria-labelledby="our-team-title">
      <FloatingTitle id="our-team-title" text="our team" />
      <HologramPanel
        position={{ x: '50%', y: '50%' }}
        width="calc(100% - 2 * clamp(24px, 4vw, 64px))"
        height="40%"
      >
        <h3>our team</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
      </HologramPanel>
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
