import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentLoadingTask, PDFPageProxy, RenderTask } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

function PdfPage({ page }: { page: PDFPageProxy }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const viewer = container?.parentElement
    if (!container || !viewer) return
    let active = true
    let task: RenderTask | undefined
    let lastWidth = 0

    function render() {
      if (!container || !viewer || !active) return
      const pageSize = page.getViewport({ scale: 1 })
      const width = Math.floor(Math.min(
        viewer.clientWidth,
        viewer.clientHeight * pageSize.width / pageSize.height,
      ))
      if (!width || width === lastWidth) return
      lastWidth = width
      task?.cancel()
      const canvas = document.createElement('canvas')
      const viewport = page.getViewport({ scale: width / pageSize.width })
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.ceil(viewport.width * pixelRatio)
      canvas.height = Math.ceil(viewport.height * pixelRatio)
      canvas.style.width = '100%'
      canvas.style.height = `${viewport.height}px`
      canvas.setAttribute('role', 'img')
      canvas.setAttribute('aria-label', `Sponsorship package page ${page.pageNumber}`)
      container.style.aspectRatio = `${viewport.width} / ${viewport.height}`
      container.style.width = `${width}px`
      const currentTask = page.render({
        canvas,
        viewport,
        transform: [pixelRatio, 0, 0, pixelRatio, 0, 0],
      })
      task = currentTask
      void currentTask.promise.then(() => {
        if (active && task === currentTask) container.replaceChildren(canvas)
      }).catch((error: unknown) => {
        if (active && task === currentTask && !(error instanceof Error && error.name === 'RenderingCancelledException')) {
          setFailed(true)
        }
      })
    }

    const observer = new ResizeObserver(render)
    observer.observe(viewer)
    render()
    return () => {
      active = false
      observer.disconnect()
      task?.cancel()
    }
  }, [page])

  return failed
    ? <p role="alert">This page could not be displayed.</p>
    : <div className="sponsor-package__page" ref={containerRef} />
}

function PdfPages({ src }: { src: string }) {
  const [pages, setPages] = useState<PDFPageProxy[]>([])
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    let loadingTask: PDFDocumentLoadingTask | undefined

    async function load() {
      try {
        const pdfjs = await import('pdfjs-dist')
        if (!active) return
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
        loadingTask = pdfjs.getDocument({ url: src })
        const document = await loadingTask.promise
        const loadedPages = await Promise.all(
          Array.from({ length: document.numPages }, (_, index) => document.getPage(index + 1)),
        )
        if (active) setPages(loadedPages)
      } catch {
        if (active) setFailed(true)
      }
    }

    void load()
    return () => {
      active = false
      void loadingTask?.destroy()
    }
  }, [src])

  const firstPageSize = pages[0]?.getViewport({ scale: 1 })

  return (
    <div
      className="sponsor-package__viewer"
      style={firstPageSize ? { aspectRatio: `${firstPageSize.width} / ${firstPageSize.height}` } : undefined}
      role="region"
      aria-label="Sponsorship package"
      tabIndex={0}
      aria-busy={!failed && pages.length === 0}
    >
      {failed ? <p role="alert">The sponsorship package could not be loaded. Please refresh to try again.</p>
        : pages.map(page => <PdfPage key={page.pageNumber} page={page} />)}
    </div>
  )
}

export default PdfPages
