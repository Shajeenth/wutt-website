import FloatingTitle from './FloatingTitle'
import sectionDots from './sectionDots'
import wuttLogo from './assets/wutt-logo.png'

const sponsors = [
  { name: 'Wutt', image: wuttLogo },
]

function SponsorsSection() {
  return (
    <section className="sponsors-section" id="sponsors" aria-labelledby="our-sponsors-title">
      <div className="about-container">
        <FloatingTitle id="our-sponsors-title" text="our sponsors" />
        <div className="about-panels">
          <div className="about-panel">
            <h3>Our supporters</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="about-panel">
            <h3>Partner with us</h3>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>
        </div>
        <div className="sponsors-strip">
          <div className="sponsors-strip__track">
            {[0, 1].map((group) => (
              <div className="sponsors-strip__group" key={group} aria-hidden={group === 1 ? true : undefined}>
                {Array.from({ length: 8 }, (_, repeat) => (
                  sponsors.map((sponsor, index) => (
                    <img
                      className="sponsors-strip__logo"
                      key={`${repeat}-${index}`}
                      src={sponsor.image}
                      alt={group === 0 && repeat === 0 ? sponsor.name : ''}
                      data-repeat={repeat}
                    />
                  ))
                ))}
              </div>
            ))}
          </div>
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
