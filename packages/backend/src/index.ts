/**
 * Backend API Server
 * Hono-based REST API for Handy Man
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// Routes
import signupEmailRoute from './api/auth/signup-email.route'
import signupPhoneRoute from './api/auth/signup-phone.route'
import verifyEmailRoute from './api/auth/verify-email.route'
import verifySmsRoute from './api/auth/verify-sms.route'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: [
      process.env.WEB_URL || 'http://localhost:3001',
      process.env.MOBILE_URL || 'exp://localhost:8081',
    ],
    credentials: true,
  })
)

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth routes
app.route('/auth/signup/email', signupEmailRoute)
app.route('/auth/signup/phone', signupPhoneRoute)
app.route('/auth/verify/email', verifyEmailRoute)
app.route('/auth/verify/sms', verifySmsRoute)

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: 'Not found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ success: false, error: 'Internal server error' }, 500)
})

const port = parseInt(process.env.PORT || '3000', 10)

console.log(`Starting server on port ${port}...`)

export default {
  port,
  fetch: app.fetch,
}
