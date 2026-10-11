const dots = [
  [6, 12, 4],
  [14, 78, 2],
  [19, 34, 5],
  [27, 91, 3],
  [33, 19, 6],
  [39, 62, 4],
  [45, 8, 3],
  [51, 43, 2],
  [57, 83, 5],
  [63, 27, 3],
  [69, 69, 4],
  [75, 13, 3],
  [81, 51, 6],
  [87, 94, 1],
  [93, 36, 6],
  [10, 53, 3],
  [22, 66, 2],
  [30, 46, 4],
  [42, 96, 6],
  [48, 24, 4],
  [60, 56, 5],
  [72, 88, 2],
  [78, 39, 1],
  [90, 72, 4],
  [96, 7, 3],
] as const

function NextSection() {
  return (
    <section className="next-section" aria-label="Next section">
      <span className="next-section__dots" aria-hidden="true">
        {dots.map(([left, top, size], index) => (
          <span
            className={`next-section__dot ${
              index < Math.ceil(dots.length / 2)
                ? "next-section__dot--left"
                : "next-section__dot--right"
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
