import { useState } from 'react'
import sectionDots from './sectionDots'
import FloatingTitle from './FloatingTitle'

const teams = ['Mechanical', 'Electrical', 'Software', 'Business']

function TeamsSection() {
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  return (
    <section className="darker-section" id="our-team" aria-labelledby="our-team-title">
      <div className="about-container">
        <FloatingTitle id="our-team-title" text="our teams" />
        <div className="about-panels">
          <div className="about-panel">
            <h3>Meet the team</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
          <div
            className={`about-panel teams-grid${expandedTeam ? ' teams-grid--expanded' : ''}`}
            style={{
              gridTemplateRows: teams.map((team) =>
                `minmax(0, ${expandedTeam === null || expandedTeam === team ? 1 : 0}fr)`
              ).join(' '),
            }}
          >
            {teams.map((team) => {
              const hidden = expandedTeam !== null && expandedTeam !== team
              return (
                <button
                  key={team}
                  type="button"
                  className={`teams-grid__card${hidden ? ' teams-grid__card--hidden' : ''}`}
                  aria-expanded={expandedTeam === team}
                  aria-label={team}
                  aria-hidden={hidden || undefined}
                  disabled={hidden}
                  onClick={() => setExpandedTeam((current) => current === team ? null : team)}
                >
                  <span className="teams-grid__content">
                    <span>{team}</span>
                    <span
                      className="teams-grid__description"
                      aria-hidden={expandedTeam !== team}
                    >
                      <span>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
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

export default TeamsSection
