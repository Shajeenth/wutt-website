import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './HologramPanel.css'

type HologramPanelProps = {
  children: ReactNode
  /** Center coordinates within the nearest positioned parent; numbers are pixels. */
  position?: { x: CSSProperties['left']; y: CSSProperties['top'] }
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  className?: string
}

function HologramPanel({
  children,
  position,
  width = 'min(720px, calc(100% - 48px))',
  height = 'auto',
  className = '',
}: HologramPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    // Watch the section, not the animated surface, so the thin line cannot
    // affect visibility measurements. Replay after leaving the section.
    const section = panel.closest('section')
    const threshold = section ? 0.55 : 0.25
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= threshold) setVisible(true)
      else if (!entry.isIntersecting) setVisible(false)
    }, { threshold: [0, threshold] })

    observer.observe(section ?? panel)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={panelRef}
      className={`hologram-panel ${className}`}
      data-visible={visible}
      style={{
        width,
        height,
        ...(position && {
          position: 'absolute',
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }),
      }}
    >
      <div className="hologram-panel__surface">
        <div
          className="hologram-panel__content"
          onWheel={(event) => {
            // Let long panel content scroll without changing page sections.
            if (event.currentTarget.scrollHeight > event.currentTarget.clientHeight) {
              event.stopPropagation()
            }
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default HologramPanel
