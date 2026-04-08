/**
 * Backend API Server
 * Hono-based REST API for Handy Man
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// Auth routes
import signupEmailRoute from './api/auth/signup-email.route'
import signupPhoneRoute from './api/auth/signup-phone.route'
import verifyEmailRoute from './api/auth/verify-email.route'
import verifySmsRoute from './api/auth/verify-sms.route'
import loginRoute from './api/auth/login.route'
import refreshRoute from './api/auth/refresh.route'
import logoutRoute from './api/auth/logout.route'
import forgotPasswordRoute from './api/auth/forgot-password.route'
import resetPasswordRoute from './api/auth/reset-password.route'
import resendVerificationRoute from './api/auth/resend-verification.route'
import meRoute from './api/auth/me.route'

// Service categories
import serviceCategoriesRoute from './api/service-categories/service-categories.route'

// Professionals
import professionalsRoute from './api/professionals/professionals.route'

// Bookings
import bookingsRoute from './api/bookings/bookings.route'

// Reviews
import reviewsRoute from './api/reviews/reviews.route'

// Admin
import adminRoute from './api/admin/admin.route'

// Test helpers (non-production only)
import testRoute from './api/test/test.route'

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
app.route('/auth/login', loginRoute)
app.route('/auth/refresh', refreshRoute)
app.route('/auth/logout', logoutRoute)
app.route('/auth/forgot-password', forgotPasswordRoute)
app.route('/auth/reset-password', resetPasswordRoute)
app.route('/auth/resend', resendVerificationRoute)
app.route('/auth/me', meRoute)
app.route('/service-categories', serviceCategoriesRoute)
app.route('/professionals', professionalsRoute)
app.route('/bookings', bookingsRoute)
app.route('/reviews', reviewsRoute)
app.route('/admin', adminRoute)
app.route('/test', testRoute)

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
