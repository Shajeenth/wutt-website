import FloatingTitle from './FloatingTitle'
import sectionDots from './sectionDots'
import HologramPanel from './HologramPanel'

function NextSection() {
  return (
    <section className="next-section" id="about-us" aria-labelledby="about-us-title">
      <FloatingTitle id="about-us-title" text="about us" />
      <div className="about-holograms">
        <HologramPanel className="about-hologram" width="100%">
          <h3>our mission</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </HologramPanel>
        <HologramPanel
          className="about-hologram about-hologram--right"
          width="100%"
          height="100%"
        >
          <h3>our vision</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
        </HologramPanel>
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

export default NextSection
