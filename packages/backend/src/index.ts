/**
 * Local Bun development server entry point
 * For Vercel deployment, see api/index.ts
 */

import app from './app'

const port = parseInt(process.env.PORT || '3000', 10)

console.log(`Starting server on port ${port}...`)

export default {
  port,
  fetch: app.fetch,
}
