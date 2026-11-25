import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContactHandler } from './contact.ts'

const root = fileURLToPath(new URL('../dist/', import.meta.url))
const contact = createContactHandler(process.env)
const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
    if (pathname === '/api/contact') {
      await contact(request, response)
      return
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end()
      return
    }
    const decoded = decodeURIComponent(pathname)
    const path = resolve(root, `.${decoded === '/' ? '/index.html' : decoded}`)
    if (!path.startsWith(resolve(root) + sep) || decoded.split(/[\\/]/).some(part => part.startsWith('.'))) {
      response.writeHead(404).end('Not found')
      return
    }
    const body = await readFile(path)
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(path)] ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(request.method === 'HEAD' ? undefined : body)
  } catch {
    if (!response.headersSent) response.writeHead(404)
    response.end('Not found')
  }
})

server.requestTimeout = 30_000
server.headersTimeout = 15_000
server.listen(Number(process.env.PORT ?? 3000), process.env.HOST ?? '127.0.0.1', () => {
  console.log(`WUTT server listening on port ${process.env.PORT ?? 3000}`)
})
