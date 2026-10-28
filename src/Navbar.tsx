import { useEffect, useRef, useState } from 'react'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about-us', label: 'About Us' },
  { id: 'our-team', label: 'Our Team' },
  { id: 'sponsors', label: 'Sponsors' },
  { id: 'depths', label: 'Socials' },
]

function Navbar() {
  const [activeSection, setActiveSection] = useState('home')
  const clickedSection = useRef<string | null>(null)

  useEffect(() => {
    const container = document.querySelector<HTMLElement>('.page-scroll')
    if (!container) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio < 0.6) return
        // Keep the clicked destination highlighted while passing other sections.
        if (clickedSection.current && clickedSection.current !== entry.target.id) return
        clickedSection.current = null
        setActiveSection(entry.target.id)
      })
    }, { root: container, threshold: 0.6 })

    function handleScrollEnd() {
      clickedSection.current = null
      const index = Math.round(container!.scrollTop / container!.clientHeight)
      const link = links[index]
      if (link) setActiveSection(link.id)
    }

    container.addEventListener('scrollend', handleScrollEnd)

    links.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => {
      observer.disconnect()
      container.removeEventListener('scrollend', handleScrollEnd)
    }
  }, [])

  return (
    <nav className="navbar" aria-label="Main navigation">
      <ul className="navbar__links">
        {links.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={activeSection === id ? 'location' : undefined}
              onClick={(event) => {
                if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
                const container = document.querySelector<HTMLElement>('.page-scroll')
                const section = document.getElementById(id)
                if (!container || !section) return
                clickedSection.current = Math.abs(container.scrollTop - section.offsetTop) > 1
                  ? id
                  : null
                setActiveSection(id)
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
