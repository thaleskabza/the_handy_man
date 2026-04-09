/**
 * OpenAPI 3.0 specification for the Handy Man API
 */

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Handy Man API',
    version: '1.0.0',
    description:
      'REST API for the Handy Man platform — connecting clients with vetted home service professionals.',
    contact: { name: 'Handy Man Team' },
  },
  servers: [
    { url: 'https://handyman-backend-rho.vercel.app', description: 'Production' },
    { url: 'http://localhost:3000', description: 'Local development' },
  ],
  tags: [
    { name: 'Health', description: 'Server health check' },
    { name: 'Auth', description: 'Registration, login, token management' },
    { name: 'Service Categories', description: 'Available service types' },
    { name: 'Professionals', description: 'Professional profiles and availability' },
    { name: 'Bookings', description: 'Booking lifecycle management' },
    { name: 'Reviews', description: 'Client reviews and professional responses' },
    { name: 'Admin', description: 'Admin-only operations (requires ADMIN role)' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token returned on login or email/SMS verification',
      },
    },
    schemas: {
      // ── Common ────────────────────────────────────────────────────────────────
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Error message' },
          code: { type: 'string', example: 'ERROR_CODE' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Validation failed' },
          code: { type: 'string', example: 'VALIDATION_ERROR' },
          details: {
            type: 'object',
            additionalProperties: { type: 'array', items: { type: 'string' } },
            example: { email: ['Invalid email address'] },
          },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
      // ── Auth ─────────────────────────────────────────────────────────────────
      SignupEmailRequest: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName', 'acceptedTerms', 'acceptedPrivacy'],
        properties: {
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          password: { type: 'string', minLength: 8, example: 'SecurePass1!' },
          firstName: { type: 'string', example: 'Jane' },
          lastName: { type: 'string', example: 'Doe' },
          acceptedTerms: { type: 'boolean', enum: [true] },
          acceptedPrivacy: { type: 'boolean', enum: [true] },
          marketingOptIn: { type: 'boolean', default: false },
        },
      },
      SignupPhoneRequest: {
        type: 'object',
        required: ['phone', 'firstName', 'lastName', 'acceptedTerms', 'acceptedPrivacy'],
        properties: {
          phone: { type: 'string', example: '+27821234567' },
          firstName: { type: 'string', example: 'Jane' },
          lastName: { type: 'string', example: 'Doe' },
          acceptedTerms: { type: 'boolean', enum: [true] },
          acceptedPrivacy: { type: 'boolean', enum: [true] },
          marketingOptIn: { type: 'boolean', default: false },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          phone: { type: 'string', example: '+27821234567' },
          password: { type: 'string', example: 'SecurePass1!' },
        },
      },
      // ── Service Categories ───────────────────────────────────────────────────
      ServiceCategory: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Plumbing' },
          slug: { type: 'string', example: 'plumbing' },
          description: { type: 'string' },
          iconUrl: { type: 'string', format: 'uri' },
          basePrice: { type: 'number', example: 350 },
          estimatedDurationHours: { type: 'number', example: 2 },
          displayOrder: { type: 'integer', example: 1 },
          isActive: { type: 'boolean' },
        },
      },
      // ── Bookings ─────────────────────────────────────────────────────────────
      CreateBookingRequest: {
        type: 'object',
        required: ['serviceCategoryId', 'addressId', 'scheduledDate', 'scheduledTimeStart'],
        properties: {
          serviceCategoryId: { type: 'string' },
          addressId: { type: 'string' },
          scheduledDate: { type: 'string', format: 'date', example: '2026-05-15' },
          scheduledTimeStart: { type: 'string', example: '09:00' },
          clientDescription: { type: 'string', maxLength: 500 },
          professionalId: { type: 'string' },
          isEmergency: { type: 'boolean', default: false },
        },
      },
      CreateAddressRequest: {
        type: 'object',
        required: ['label', 'addressLine1', 'city', 'province', 'postalCode'],
        properties: {
          label: { type: 'string', example: 'Home' },
          addressLine1: { type: 'string', example: '12 Main Street' },
          addressLine2: { type: 'string' },
          city: { type: 'string', example: 'Cape Town' },
          province: { type: 'string', example: 'Western Cape' },
          postalCode: { type: 'string', example: '8001' },
          country: { type: 'string', default: 'South Africa' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          specialInstructions: { type: 'string' },
          isDefault: { type: 'boolean', default: false },
        },
      },
      // ── Reviews ──────────────────────────────────────────────────────────────
      CreateReviewRequest: {
        type: 'object',
        required: ['bookingId', 'overallRating'],
        properties: {
          bookingId: { type: 'string' },
          overallRating: { type: 'integer', minimum: 1, maximum: 5 },
          punctualityRating: { type: 'integer', minimum: 1, maximum: 5 },
          qualityRating: { type: 'integer', minimum: 1, maximum: 5 },
          professionalismRating: { type: 'integer', minimum: 1, maximum: 5 },
          valueRating: { type: 'integer', minimum: 1, maximum: 5 },
          reviewText: { type: 'string', maxLength: 500 },
          wouldRecommend: { type: 'boolean', default: true },
        },
      },
    },
  },
  paths: {
    // ── Health ────────────────────────────────────────────────────────────────
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ── Auth ─────────────────────────────────────────────────────────────────
    '/auth/signup/email': {
      post: {
        tags: ['Auth'],
        summary: 'Register with email & password',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/SignupEmailRequest' } },
          },
        },
        responses: {
          201: { description: 'Account created — check email to verify' },
          409: { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          422: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationError' } } } },
        },
      },
    },
    '/auth/signup/phone': {
      post: {
        tags: ['Auth'],
        summary: 'Register with phone number',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/SignupPhoneRequest' } },
          },
        },
        responses: {
          201: { description: 'Account created — SMS verification code sent' },
          409: { description: 'Phone number already registered' },
          422: { description: 'Validation error' },
        },
      },
    },
    '/auth/verify/email': {
      post: {
        tags: ['Auth'],
        summary: 'Verify email address with token from verification email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token'],
                properties: { token: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Email verified — returns auth tokens', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } } },
          400: { description: 'Invalid or expired token' },
        },
      },
    },
    '/auth/verify/sms': {
      post: {
        tags: ['Auth'],
        summary: 'Verify phone number with SMS code',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone', 'code'],
                properties: {
                  phone: { type: 'string', example: '+27821234567' },
                  code: { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Phone verified — returns auth tokens', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } } },
          400: { description: 'Invalid or expired code' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email+password or phone+password',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } },
          },
        },
        responses: {
          200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } } },
          401: { description: 'Invalid credentials' },
          403: { description: 'Email or phone not verified yet' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'New token pair issued', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } } },
          401: { description: 'Invalid or expired refresh token' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and invalidate refresh token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Logged out successfully' },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request a password reset email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', format: 'email' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Reset email sent (always returns 200 to prevent email enumeration)' },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password using token from email',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'password'],
                properties: {
                  token: { type: 'string' },
                  password: { type: 'string', minLength: 8, example: 'NewPass1!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Password reset successfully' },
          400: { description: 'Invalid or expired token' },
        },
      },
    },
    '/auth/resend/email': {
      post: {
        tags: ['Auth'],
        summary: 'Resend email verification link',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', format: 'email' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Verification email sent' },
          400: { description: 'Already verified or user not found' },
        },
      },
    },
    '/auth/resend/sms': {
      post: {
        tags: ['Auth'],
        summary: 'Resend SMS verification code',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['phone'],
                properties: { phone: { type: 'string', example: '+27821234567' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'SMS code sent' },
          400: { description: 'Already verified or user not found' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current authenticated user',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        role: { type: 'string', enum: ['CLIENT', 'HANDYMAN', 'ADMIN'] },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ── Service Categories ────────────────────────────────────────────────────
    '/service-categories': {
      get: {
        tags: ['Service Categories'],
        summary: 'List all active service categories',
        responses: {
          200: {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    categories: { type: 'array', items: { $ref: '#/components/schemas/ServiceCategory' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Service Categories'],
        summary: 'Create a service category (Admin only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'slug'],
                properties: {
                  name: { type: 'string', example: 'Plumbing' },
                  slug: { type: 'string', example: 'plumbing' },
                  description: { type: 'string' },
                  iconUrl: { type: 'string', format: 'uri' },
                  basePrice: { type: 'number', example: 350 },
                  estimatedDurationHours: { type: 'number' },
                  displayOrder: { type: 'integer', default: 0 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Category created' },
          409: { description: 'Slug already exists' },
        },
      },
    },
    '/service-categories/{slug}': {
      get: {
        tags: ['Service Categories'],
        summary: 'Get a single category by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Category detail' },
          404: { description: 'Category not found or inactive' },
        },
      },
      patch: {
        tags: ['Service Categories'],
        summary: 'Update a category (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  iconUrl: { type: 'string' },
                  basePrice: { type: 'number' },
                  estimatedDurationHours: { type: 'number' },
                  displayOrder: { type: 'integer' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Category updated' },
          404: { description: 'Category not found' },
        },
      },
    },
    '/service-categories/{slug}/toggle': {
      patch: {
        tags: ['Service Categories'],
        summary: 'Toggle category active/inactive (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Category toggled' },
          404: { description: 'Category not found' },
        },
      },
    },

    // ── Professionals ─────────────────────────────────────────────────────────
    '/professionals': {
      get: {
        tags: ['Professionals'],
        summary: 'Search verified professionals',
        parameters: [
          { name: 'serviceCategoryId', in: 'query', schema: { type: 'string' } },
          { name: 'lat', in: 'query', schema: { type: 'number' } },
          { name: 'lng', in: 'query', schema: { type: 'number' } },
          { name: 'radiusKm', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 50 } },
        ],
        responses: {
          200: { description: 'Paginated list of professionals' },
        },
      },
    },
    '/professionals/{id}': {
      get: {
        tags: ['Professionals'],
        summary: 'Get a professional public profile',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Professional profile' },
          404: { description: 'Not found' },
        },
      },
    },
    '/professionals/me': {
      get: {
        tags: ['Professionals'],
        summary: 'Get own professional profile (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Full professional profile' },
          404: { description: 'Profile not found' },
        },
      },
      patch: {
        tags: ['Professionals'],
        summary: 'Update own professional profile (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  bio: { type: 'string', maxLength: 300 },
                  yearsExperience: { type: 'integer', minimum: 0 },
                  serviceRadiusKm: { type: 'integer', minimum: 1, maximum: 100 },
                  hourlyRate: { type: 'number' },
                  isAvailable: { type: 'boolean' },
                  isOnVacation: { type: 'boolean' },
                  baseLocationLat: { type: 'number' },
                  baseLocationLng: { type: 'number' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Profile updated' },
        },
      },
    },
    '/professionals/me/services': {
      put: {
        tags: ['Professionals'],
        summary: 'Set offered services (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['services'],
                properties: {
                  services: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['serviceCategoryId'],
                      properties: {
                        serviceCategoryId: { type: 'string' },
                        customRate: { type: 'number' },
                        yearsExperience: { type: 'integer' },
                        isPrimaryService: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Services updated' },
        },
      },
    },
    '/professionals/me/availability': {
      put: {
        tags: ['Professionals'],
        summary: 'Set weekly availability schedule (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['availability'],
                properties: {
                  availability: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['dayOfWeek', 'startTime', 'endTime'],
                      properties: {
                        dayOfWeek: { type: 'integer', minimum: 0, maximum: 6, description: '0=Sunday' },
                        startTime: { type: 'string', example: '08:00' },
                        endTime: { type: 'string', example: '17:00' },
                        isAvailable: { type: 'boolean', default: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Availability updated' },
        },
      },
    },
    '/professionals/me/blocked-dates': {
      post: {
        tags: ['Professionals'],
        summary: 'Block a date (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['blockedDate'],
                properties: {
                  blockedDate: { type: 'string', format: 'date', example: '2026-12-25' },
                  reason: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Date blocked' },
        },
      },
    },
    '/professionals/me/blocked-dates/{dateId}': {
      delete: {
        tags: ['Professionals'],
        summary: 'Unblock a date (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'dateId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Date unblocked' },
          404: { description: 'Blocked date not found' },
        },
      },
    },
    '/professionals/me/apply': {
      post: {
        tags: ['Professionals'],
        summary: 'Submit verification application (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['yearsExperience', 'selectedCategories', 'agreedToBackgroundCheck'],
                properties: {
                  yearsExperience: { type: 'integer', minimum: 0 },
                  selectedCategories: { type: 'array', items: { type: 'string' } },
                  idDocumentUrl: { type: 'string', format: 'uri' },
                  certificationsUrls: { type: 'array', items: { type: 'string', format: 'uri' } },
                  referencesUrls: { type: 'array', items: { type: 'string', format: 'uri' } },
                  agreedToBackgroundCheck: { type: 'boolean', enum: [true] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Application submitted' },
          409: { description: 'Application already submitted' },
        },
      },
      get: {
        tags: ['Professionals'],
        summary: 'Get own application status (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Application details' },
          404: { description: 'No application found' },
        },
      },
    },

    // ── Bookings ──────────────────────────────────────────────────────────────
    '/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'List my bookings (CLIENT)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'filter',
            in: 'query',
            schema: { type: 'string', enum: ['upcoming', 'past', 'all'], default: 'all' },
          },
        ],
        responses: {
          200: { description: 'Bookings list' },
        },
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create a booking (CLIENT)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateBookingRequest' } },
          },
        },
        responses: {
          201: { description: 'Booking created' },
          404: { description: 'Address, category, or professional not found' },
        },
      },
    },
    '/bookings/{id}': {
      get: {
        tags: ['Bookings'],
        summary: 'Get booking detail',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Booking detail with status history, payments, reviews' },
          404: { description: 'Booking not found' },
        },
      },
    },
    '/bookings/{id}/cancel': {
      post: {
        tags: ['Bookings'],
        summary: 'Cancel a booking (CLIENT)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reason'],
                properties: { reason: { type: 'string', maxLength: 500 } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Booking cancelled' },
          422: { description: 'Booking cannot be cancelled at this stage' },
        },
      },
    },
    '/bookings/{id}/accept': {
      post: {
        tags: ['Bookings'],
        summary: 'Accept a pending booking (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Booking accepted and confirmed' },
          400: { description: 'Booking not available' },
        },
      },
    },
    '/bookings/{id}/start': {
      post: {
        tags: ['Bookings'],
        summary: 'Start a confirmed booking (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Booking marked IN_PROGRESS' },
        },
      },
    },
    '/bookings/{id}/complete': {
      post: {
        tags: ['Bookings'],
        summary: 'Complete a booking (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  finalPrice: { type: 'number' },
                  priceAdjustmentReason: { type: 'string', maxLength: 500 },
                  professionalNotes: { type: 'string', maxLength: 500 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Booking completed — earnings calculated' },
        },
      },
    },
    '/bookings/addresses': {
      get: {
        tags: ['Bookings'],
        summary: 'List saved addresses (CLIENT)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Address list' },
        },
      },
      post: {
        tags: ['Bookings'],
        summary: 'Add a saved address (CLIENT)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateAddressRequest' } },
          },
        },
        responses: {
          201: { description: 'Address saved' },
        },
      },
    },

    // ── Reviews ───────────────────────────────────────────────────────────────
    '/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Submit a review for a completed booking (CLIENT)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateReviewRequest' } },
          },
        },
        responses: {
          201: { description: 'Review submitted' },
          409: { description: 'Review already submitted for this booking' },
          404: { description: 'Booking not found or not completed' },
        },
      },
    },
    '/reviews/professional/{id}': {
      get: {
        tags: ['Reviews'],
        summary: 'Get all reviews for a professional (public)',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 50 } },
        ],
        responses: {
          200: { description: 'Paginated reviews with aggregate ratings' },
        },
      },
    },
    '/reviews/{id}/response': {
      post: {
        tags: ['Reviews'],
        summary: 'Respond to a review (HANDYMAN)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['response'],
                properties: { response: { type: 'string', minLength: 1, maxLength: 500 } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Response added' },
          409: { description: 'Already responded' },
        },
      },
    },

    // ── Admin ─────────────────────────────────────────────────────────────────
    '/admin/applications': {
      get: {
        tags: ['Admin'],
        summary: 'List professional verification applications (ADMIN)',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
          },
        ],
        responses: {
          200: { description: 'Applications list' },
        },
      },
    },
    '/admin/applications/{id}': {
      patch: {
        tags: ['Admin'],
        summary: 'Approve or reject a professional application (ADMIN)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['APPROVED', 'REJECTED'] },
                  adminNotes: { type: 'string', maxLength: 1000 },
                  rejectionReason: { type: 'string', maxLength: 500 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Application reviewed' },
          404: { description: 'Application not found' },
        },
      },
    },
  },
}
