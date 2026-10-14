import sectionDots from './sectionDots'
import FloatingTitle from './FloatingTitle'

function FinalSection() {
  return (
    <section className="final-section" id="depths" aria-labelledby="contact-us-title">
      <div className="contact-title">
        <div className="contact-content">
          <FloatingTitle id="contact-us-title" text="contact us" />
          <a
            className="contact-button"
            href="https://linktr.ee/wutt26"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow our Socials
          </a>
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
      <svg
        className="rocky-bottom"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M0 70 L38 58 L65 79 L96 61 L130 66 L154 91 L196 102 L226 85 L260 110 L298 118 L332 99 L354 91 L388 107 L415 127 L452 132 L484 116 L524 139 L566 146 L596 128 L632 139 L662 151 L704 141 L742 133 L774 144 L799 153 L836 144 L878 129 L912 138 L944 118 L974 106 L1004 117 L1030 134 L1070 122 L1102 103 L1136 112 L1168 121 L1208 99 L1246 79 L1284 88 L1310 102 L1346 78 L1382 86 L1412 58 L1440 68 L1440 220 L0 220 Z"
        />
      </svg>
    </section>
  )
}

export default FinalSection
