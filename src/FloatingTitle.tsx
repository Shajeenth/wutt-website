import { useEffect, useRef } from 'react'

function FloatingTitle({ id, text }: { id: string; text: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const section = titleRef.current?.closest('section')
    const title = titleRef.current
    if (!section || !title) return

    const letters = Array.from(title.querySelectorAll<HTMLElement>('.about-letter'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let pointer: { x: number; y: number } | null = null
    let frame = 0

    function reset() {
      pointer = null
      cancelAnimationFrame(frame)
      frame = 0
      letters.forEach((letter) => {
        letter.style.transform = 'translate(0, 0)'
      })
    }

    function displaceLetters() {
      if (!pointer) return

      letters.forEach((letter) => {
        // Measure the unmoving slot so displacement never feeds back into itself.
        const bounds = letter.parentElement!.getBoundingClientRect()
        const dx = bounds.left + bounds.width / 2 - pointer!.x
        const dy = bounds.top + bounds.height / 2 - pointer!.y
        const distance = Math.hypot(dx, dy)
        const strength = Math.max(0, 1 - distance / 120)
        const displacement = 12 * strength * strength
        const x = distance > 0 ? (dx / distance) * displacement : 0
        const y = distance > 0 ? (dy / distance) * displacement : -displacement
        letter.style.transform = `translate(${x}px, ${y}px)`
      })

      frame = requestAnimationFrame(displaceLetters)
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch' || reducedMotion.matches) return
      pointer = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(displaceLetters)
    }

    section.addEventListener('pointermove', handlePointerMove)
    section.addEventListener('pointerleave', reset)
    section.addEventListener('pointercancel', reset)
    window.addEventListener('blur', reset)
    window.addEventListener('scroll', reset, true)
    reducedMotion.addEventListener('change', reset)

    return () => {
      reset()
      section.removeEventListener('pointermove', handlePointerMove)
      section.removeEventListener('pointerleave', reset)
      section.removeEventListener('pointercancel', reset)
      window.removeEventListener('blur', reset)
      window.removeEventListener('scroll', reset, true)
      reducedMotion.removeEventListener('change', reset)
    }
  }, [text])

  return (
    <h2 className="about-title" id={id} ref={titleRef} aria-label={text}>
      {Array.from(text).map((letter, index) => (
        <span className="about-letter-slot" key={index} aria-hidden="true">
          {letter === ' ' ? '\u00a0' : <span className="about-letter">{letter}</span>}
        </span>
      ))}
    </h2>
  )
}

export default FloatingTitle
