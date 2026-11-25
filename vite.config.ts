import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createContactHandler } from './server/contact.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  const contact = createContactHandler(env)
  return {
    optimizeDeps: {
      include: ['pdfjs-dist'],
    },
    plugins: [react(), {
      name: 'contact-api',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url?.split('?')[0] !== '/api/contact') return next()
          void contact(request, response).catch(next)
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url?.split('?')[0] !== '/api/contact') return next()
          void contact(request, response).catch(next)
        })
      },
    }],
  }
})
