# The Handy Man - Technical Architecture & API Design

## Document Information
- **Project**: The Handy Man
- **Date Created**: January 24, 2026
- **Version**: 1.0
- **Status**: Draft

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [API Design](#api-design)
4. [Authentication & Authorization](#authentication--authorization)
5. [File Storage Strategy](#file-storage-strategy)
6. [Real-Time Features](#real-time-features)
7. [Payment Integration](#payment-integration)
8. [Deployment Architecture](#deployment-architecture)
9. [Performance Optimization](#performance-optimization)
10. [Security Considerations](#security-considerations)
11. [Monitoring & Logging](#monitoring--logging)

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│  │   iOS App    │   │ Android App  │   │   Web App    │       │
│  │  (Swift/     │   │   (Kotlin/   │   │   (React/    │       │
│  │  React Native)│   │React Native) │   │    Next.js)  │       │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘       │
│         │                   │                   │               │
│         └───────────────────┴───────────────────┘               │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │ HTTPS/WSS
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
├─────────────────────────────┼────────────────────────────────────┤
│                             │                                    │
│  ┌──────────────────────────▼───────────────────────────┐       │
│  │            API Gateway (Kong / AWS API Gateway)      │       │
│  │  • Rate Limiting                                     │       │
│  │  • Authentication                                     │       │
│  │  • Request Routing                                    │       │
│  │  • SSL Termination                                    │       │
│  └──────────────────────────┬───────────────────────────┘       │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│                    APPLICATION LAYER                             │
├─────────────────────────────┼────────────────────────────────────┤
│                             │                                    │
│  ┌──────────────┐   ┌──────▼───────┐   ┌──────────────┐       │
│  │   Auth       │   │   Main API   │   │  WebSocket   │       │
│  │   Service    │   │   Service    │   │   Service    │       │
│  │  (Node.js/   │   │  (Node.js/   │   │  (Node.js/   │       │
│  │   FastAPI)   │   │   FastAPI)   │   │  Socket.io)  │       │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘       │
│         │                   │                   │               │
│         │    ┌──────────────┴───────────────┐   │               │
│         │    │                              │   │               │
│  ┌──────▼────▼──────┐   ┌──────────────┐  │   │               │
│  │  Booking Engine  │   │   Matching   │  │   │               │
│  │   Microservice   │   │    Engine    │  │   │               │
│  │                  │   │(Location-based)│  │   │               │
│  └──────┬───────────┘   └──────┬───────┘  │   │               │
│         │                      │           │   │               │
│  ┌──────▼───────┐   ┌──────────▼──────┐  │   │               │
│  │   Payment    │   │  Notification   │  │   │               │
│  │   Service    │   │    Service      │  │   │               │
│  │  (Stripe API)│   │ (FCM/SNS/Email) │  │   │               │
│  └──────────────┘   └─────────────────┘  │   │               │
│                                           │   │               │
└───────────────────────────────────────────┼───┼───────────────┘
                                            │   │
                              ┌─────────────┴───┴─────────────┐
                              │                               │
┌─────────────────────────────┼───────────────────────────────┼───┐
│                      DATA LAYER                             │   │
├─────────────────────────────┼───────────────────────────────┼───┤
│                             │                               │   │
│  ┌──────────────────────────▼────┐   ┌─────────────────────▼─┐ │
│  │    PostgreSQL (Primary DB)    │   │   Redis (Cache/Queue)│ │
│  │  • User Data                   │   │  • Session Store     │ │
│  │  • Bookings                    │   │  • API Cache         │ │
│  │  • Transactions                │   │  • Rate Limiting     │ │
│  └───────────────────────────────┘   └──────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────┐   ┌──────────────────────┐ │
│  │    MongoDB (NoSQL)            │   │  Elasticsearch       │ │
│  │  • Chat Messages              │   │  • Search Index      │ │
│  │  • Logs                       │   │  • Professional Search│ │
│  └───────────────────────────────┘   └──────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    STORAGE & CDN LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────┐   ┌─────────────────────────┐    │
│  │   S3 / Cloud Storage     │   │   CDN (CloudFlare)      │    │
│  │  • Profile Photos        │   │  • Static Assets        │    │
│  │  • Job Photos            │   │  • Images               │    │
│  │  • Documents             │   │  • Global Distribution  │    │
│  └──────────────────────────┘   └─────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  • Google Maps API (Geocoding, Distance, Directions)            │
│  • Stripe/PayStack (Payments)                                   │
│  • Firebase Cloud Messaging (Push Notifications)                │
│  • Twilio (SMS)                                                  │
│  • SendGrid (Email)                                              │
│  • Sentry (Error Tracking)                                       │
│  • Background Check API                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

#### Option 1: React Native (Recommended for MVP)
```yaml
Framework: React Native 0.73+
Language: TypeScript
State Management: Redux Toolkit / Zustand
Navigation: React Navigation 6
UI Components: React Native Paper / NativeBase
Maps: react-native-maps
Real-time: Socket.io-client
Forms: React Hook Form
HTTP Client: Axios / React Query
Local Storage: AsyncStorage / MMKV
Push Notifications: react-native-firebase

Advantages:
  - Single codebase for iOS & Android
  - Fast development
  - Large community
  - Native performance
  - Hot reloading
```

#### Option 2: Flutter (Alternative)
```yaml
Framework: Flutter 3.16+
Language: Dart
State Management: Riverpod / Bloc
Navigation: go_router
UI Components: Material Design 3
Maps: google_maps_flutter
Real-time: socket_io_client
HTTP Client: Dio
Local Storage: Hive / Shared Preferences

Advantages:
  - Excellent performance
  - Beautiful UI out of the box
  - Single codebase
  - Growing ecosystem
```

#### Web Application
```yaml
Framework: Next.js 14+ (React)
Language: TypeScript
Styling: Tailwind CSS
State Management: Redux Toolkit / Zustand
Maps: @react-google-maps/api
Real-time: Socket.io-client
Forms: React Hook Form
HTTP Client: Axios / React Query
UI Components: shadcn/ui / Headless UI

Features:
  - Server-Side Rendering (SSR)
  - SEO Optimized
  - Progressive Web App (PWA)
  - Fast page loads
```

### Backend

#### Primary Stack (Recommended)
```yaml
Runtime: Node.js 20+ LTS
Framework: Express.js / Fastify
Language: TypeScript
API Type: RESTful + WebSocket
Documentation: OpenAPI 3.0 (Swagger)
Validation: Zod / Joi
ORM: Prisma / TypeORM
Authentication: Passport.js / JWT
Real-time: Socket.io
Background Jobs: Bull / BullMQ (Redis-based)
Testing: Jest + Supertest
Linting: ESLint + Prettier

Advantages:
  - JavaScript/TypeScript ecosystem
  - Fast development
  - Large community
  - Great for real-time features
  - Easy to scale
```

#### Alternative Stack
```yaml
Language: Python 3.11+
Framework: FastAPI
API Type: RESTful + WebSocket
Documentation: Auto-generated (FastAPI)
Validation: Pydantic
ORM: SQLAlchemy / Tortoise ORM
Authentication: FastAPI Security
Real-time: WebSockets (native) / Socket.io
Background Jobs: Celery (Redis/RabbitMQ)
Testing: pytest + httpx

Advantages:
  - Clean, modern syntax
  - Excellent async support
  - Auto API documentation
  - Type hints
  - Great for ML features (future)
```

### Database

#### Primary Database
```yaml
Database: PostgreSQL 15+
Purpose: Main transactional data
Extensions:
  - PostGIS (Geospatial queries)
  - pg_trgm (Full-text search)
  - uuid-ossp (UUID generation)

Features:
  - ACID compliance
  - JSON support
  - Excellent performance
  - Mature ecosystem
```

#### Cache & Session Store
```yaml
Cache: Redis 7+
Purpose: 
  - Session storage
  - API response caching
  - Rate limiting
  - Job queues
  - Real-time data
```

#### NoSQL Database (Optional)
```yaml
Database: MongoDB 7+
Purpose:
  - Chat messages
  - Activity logs
  - Analytics events

Advantages:
  - Flexible schema
  - Great for logs
  - High write throughput
```

#### Search Engine
```yaml
Search: Elasticsearch 8+ / Meilisearch
Purpose:
  - Professional search
  - Service search
  - Full-text search
  - Autocomplete
```

### Infrastructure

```yaml
Cloud Provider: AWS / Google Cloud / Azure

Compute:
  - AWS EC2 / ECS (Containers)
  - Auto Scaling Groups
  - Load Balancer (ALB)

Database:
  - AWS RDS (PostgreSQL)
  - AWS ElastiCache (Redis)
  - AWS DocumentDB (MongoDB alternative)

Storage:
  - AWS S3 (File storage)
  - CloudFront (CDN)

Networking:
  - VPC
  - Security Groups
  - Route 53 (DNS)

Monitoring:
  - CloudWatch
  - X-Ray (Tracing)

Container Orchestration:
  - Docker
  - Kubernetes / AWS ECS

CI/CD:
  - GitHub Actions
  - AWS CodePipeline
  - Jenkins
```

---

## API Design

### Base URL Structure

```
Production:  https://api.thehandyman.com/v1
Staging:     https://api-staging.thehandyman.com/v1
Development: http://localhost:3000/api/v1
```

### Authentication

All authenticated endpoints require:
```http
Authorization: Bearer <JWT_TOKEN>
```

### API Endpoints

#### 1. Authentication & User Management

```yaml
# Register new client
POST /auth/register/client
Request:
  {
    "email": "john@example.com",
    "phone": "+27123456789",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Smith"
  }
Response: 201
  {
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "user_type": "client"
    },
    "tokens": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_in": 3600
    }
  }

# Login
POST /auth/login
Request:
  {
    "email": "john@example.com",
    "password": "SecurePass123!"
  }
Response: 200
  {
    "user": { /* user object */ },
    "tokens": { /* tokens */ }
  }

# Social Login (Google, Facebook)
POST /auth/social/google
Request:
  {
    "id_token": "google_id_token"
  }
Response: 200
  {
    "user": { /* user object */ },
    "tokens": { /* tokens */ }
  }

# Refresh Token
POST /auth/refresh
Request:
  {
    "refresh_token": "refresh_token"
  }
Response: 200
  {
    "access_token": "new_jwt_token",
    "expires_in": 3600
  }

# Logout
POST /auth/logout
Headers: Authorization: Bearer <token>
Response: 204

# Get Current User
GET /auth/me
Headers: Authorization: Bearer <token>
Response: 200
  {
    "id": "uuid",
    "email": "john@example.com",
    "user_type": "client",
    "profile": { /* profile details */ }
  }

# Update Profile
PATCH /users/me
Headers: Authorization: Bearer <token>
Request:
  {
    "first_name": "John",
    "profile_photo_url": "https://..."
  }
Response: 200
  {
    "user": { /* updated user */ }
  }

# Change Password
POST /auth/change-password
Headers: Authorization: Bearer <token>
Request:
  {
    "current_password": "OldPass123!",
    "new_password": "NewPass123!"
  }
Response: 200

# Request Password Reset
POST /auth/forgot-password
Request:
  {
    "email": "john@example.com"
  }
Response: 200
  {
    "message": "Reset link sent to email"
  }

# Reset Password
POST /auth/reset-password
Request:
  {
    "token": "reset_token",
    "new_password": "NewPass123!"
  }
Response: 200
```

#### 2. Service Categories

```yaml
# Get All Service Categories
GET /service-categories
Response: 200
  {
    "categories": [
      {
        "id": "uuid",
        "name": "Plumbing",
        "slug": "plumbing",
        "description": "Leak repairs, installations...",
        "icon_url": "https://...",
        "base_price": 350.00,
        "estimated_duration_hours": 2.0
      }
    ]
  }

# Get Single Service Category
GET /service-categories/{id}
Response: 200
  {
    "id": "uuid",
    "name": "Plumbing",
    "slug": "plumbing",
    "description": "...",
    "professionals_count": 156,
    "avg_rating": 4.8,
    "sample_professionals": [ /* top 3 */ ]
  }
```

#### 3. Professional Discovery

```yaml
# Search Available Professionals
POST /professionals/search
Request:
  {
    "service_category_id": "uuid",
    "latitude": -33.9249,
    "longitude": 18.4241,
    "scheduled_date": "2026-01-25",
    "scheduled_time_start": "14:00:00",
    "scheduled_time_end": "16:00:00",
    "sort_by": "rating", // rating, distance, price
    "radius_km": 20
  }
Response: 200
  {
    "professionals": [
      {
        "id": "uuid",
        "user": {
          "first_name": "James",
          "last_name": "Khumalo",
          "profile_photo_url": "https://..."
        },
        "average_rating": 4.9,
        "total_reviews": 341,
        "total_jobs_completed": 500,
        "hourly_rate": 350.00,
        "distance_km": 2.3,
        "response_time_minutes": 2,
        "badges": ["top_rated", "fast_responder"],
        "is_available": true
      }
    ],
    "total": 12,
    "page": 1,
    "per_page": 10
  }

# Get Professional Profile
GET /professionals/{id}
Response: 200
  {
    "id": "uuid",
    "user": { /* user details */ },
    "bio": "Experienced plumber...",
    "years_experience": 5,
    "average_rating": 4.9,
    "total_reviews": 341,
    "total_jobs_completed": 500,
    "hourly_rate": 350.00,
    "service_radius_km": 20,
    "services": [
      {
        "category": "Plumbing",
        "is_primary_service": true,
        "years_experience": 5
      }
    ],
    "badges": ["top_rated", "verified"],
    "portfolio_photos": ["url1", "url2"],
    "recent_reviews": [ /* last 5 reviews */ ],
    "acceptance_rate": 98,
    "response_time_minutes": 2
  }

# Get Professional Reviews
GET /professionals/{id}/reviews
Query Params: ?page=1&per_page=20&sort=recent
Response: 200
  {
    "reviews": [
      {
        "id": "uuid",
        "client": {
          "first_name": "Sarah",
          "last_initial": "M."
        },
        "overall_rating": 5,
        "punctuality_rating": 5,
        "quality_rating": 5,
        "professionalism_rating": 5,
        "value_rating": 5,
        "review_text": "Excellent service!",
        "photos": ["url1", "url2"],
        "created_at": "2026-01-20T10:30:00Z"
      }
    ],
    "total": 341,
    "average_rating": 4.9
  }
```

#### 4. Bookings

```yaml
# Create Booking (Step 1: Request)
POST /bookings
Headers: Authorization: Bearer <token>
Request:
  {
    "service_category_id": "uuid",
    "professional_id": "uuid",
    "address_id": "uuid",
    "scheduled_date": "2026-01-25",
    "scheduled_time_start": "14:00:00",
    "scheduled_time_end": "16:00:00",
    "client_description": "Leaking kitchen sink",
    "is_emergency": false,
    "payment_method_id": "uuid"
  }
Response: 201
  {
    "booking": {
      "id": "uuid",
      "booking_reference": "HM-2026-001234",
      "booking_status": "pending",
      "estimated_price": 826.00,
      "professional": { /* professional details */ },
      "service": { /* service details */ },
      "address": { /* address details */ },
      "scheduled_date": "2026-01-25",
      "scheduled_time_start": "14:00:00"
    }
  }

# Get My Bookings
GET /bookings
Headers: Authorization: Bearer <token>
Query Params: ?status=upcoming&page=1&per_page=20
Response: 200
  {
    "bookings": [
      {
        "id": "uuid",
        "booking_reference": "HM-2026-001234",
        "booking_status": "confirmed",
        "service_category": { /* service */ },
        "professional": { /* professional */ },
        "scheduled_date": "2026-01-25",
        "scheduled_time_start": "14:00:00",
        "estimated_price": 826.00
      }
    ],
    "total": 15,
    "page": 1
  }

# Get Single Booking
GET /bookings/{id}
Headers: Authorization: Bearer <token>
Response: 200
  {
    "id": "uuid",
    "booking_reference": "HM-2026-001234",
    "booking_status": "confirmed",
    "service_category": { /* full details */ },
    "professional": { /* full details */ },
    "client": { /* full details */ },
    "address": { /* full details */ },
    "scheduled_date": "2026-01-25",
    "scheduled_time_start": "14:00:00",
    "scheduled_time_end": "16:00:00",
    "client_description": "Leaking kitchen sink",
    "estimated_price": 826.00,
    "payment_method": { /* payment method */ },
    "status_history": [ /* status changes */ ],
    "created_at": "2026-01-24T10:00:00Z"
  }

# Cancel Booking
POST /bookings/{id}/cancel
Headers: Authorization: Bearer <token>
Request:
  {
    "reason": "Plans changed"
  }
Response: 200
  {
    "booking": { /* updated booking */ },
    "refund": {
      "amount": 826.00,
      "status": "processing"
    }
  }

# Reschedule Booking
POST /bookings/{id}/reschedule
Headers: Authorization: Bearer <token>
Request:
  {
    "scheduled_date": "2026-01-26",
    "scheduled_time_start": "10:00:00",
    "scheduled_time_end": "12:00:00"
  }
Response: 200
  {
    "booking": { /* updated booking */ }
  }

# Start Job (Professional)
POST /bookings/{id}/start
Headers: Authorization: Bearer <token>
Request:
  {
    "latitude": -33.9249,
    "longitude": 18.4241
  }
Response: 200
  {
    "booking": {
      "booking_status": "in_progress",
      "actual_start_time": "2026-01-25T14:05:00Z"
    }
  }

# Complete Job (Professional)
POST /bookings/{id}/complete
Headers: Authorization: Bearer <token>
Request:
  {
    "professional_notes": "Fixed leaking pipe...",
    "final_price": 850.00,
    "price_adjustment_reason": "Needed extra parts",
    "before_photos": ["url1", "url2"],
    "after_photos": ["url3", "url4"]
  }
Response: 200
  {
    "booking": {
      "booking_status": "completed",
      "actual_end_time": "2026-01-25T16:20:00Z",
      "final_price": 850.00
    }
  }

# Accept Job (Professional)
POST /bookings/{id}/accept
Headers: Authorization: Bearer <token>
Response: 200
  {
    "booking": {
      "booking_status": "confirmed"
    }
  }

# Decline Job (Professional)
POST /bookings/{id}/decline
Headers: Authorization: Bearer <token>
Request:
  {
    "reason": "Schedule conflict"
  }
Response: 200
  {
    "message": "Job declined"
  }
```

#### 5. Reviews & Ratings

```yaml
# Create Review
POST /bookings/{booking_id}/review
Headers: Authorization: Bearer <token>
Request:
  {
    "overall_rating": 5,
    "punctuality_rating": 5,
    "quality_rating": 5,
    "professionalism_rating": 5,
    "value_rating": 5,
    "review_text": "Excellent service!",
    "would_recommend": true,
    "photos": ["url1", "url2"]
  }
Response: 201
  {
    "review": {
      "id": "uuid",
      "booking_id": "uuid",
      "professional_id": "uuid",
      "overall_rating": 5,
      "review_text": "Excellent service!",
      "created_at": "2026-01-25T18:00:00Z"
    }
  }

# Update Review
PATCH /reviews/{id}
Headers: Authorization: Bearer <token>
Request:
  {
    "review_text": "Updated review text"
  }
Response: 200

# Respond to Review (Professional)
POST /reviews/{id}/respond
Headers: Authorization: Bearer <token>
Request:
  {
    "response": "Thank you for the kind words!"
  }
Response: 200
```

#### 6. Addresses

```yaml
# Create Address
POST /addresses
Headers: Authorization: Bearer <token>
Request:
  {
    "label": "Home",
    "address_line1": "123 Main Street",
    "address_line2": "Apt 4B",
    "city": "Cape Town",
    "province": "Western Cape",
    "postal_code": "8001",
    "latitude": -33.9249,
    "longitude": 18.4241,
    "special_instructions": "Blue gate"
  }
Response: 201
  {
    "address": { /* address object */ }
  }

# Get My Addresses
GET /addresses
Headers: Authorization: Bearer <token>
Response: 200
  {
    "addresses": [ /* array of addresses */ ]
  }

# Update Address
PATCH /addresses/{id}
Headers: Authorization: Bearer <token>
Request:
  {
    "label": "Work"
  }
Response: 200

# Delete Address
DELETE /addresses/{id}
Headers: Authorization: Bearer <token>
Response: 204

# Set Default Address
POST /addresses/{id}/set-default
Headers: Authorization: Bearer <token>
Response: 200
```

#### 7. Payments

```yaml
# Add Payment Method
POST /payment-methods
Headers: Authorization: Bearer <token>
Request:
  {
    "payment_type": "card",
    "stripe_payment_method_id": "pm_xxxxx"
  }
Response: 201
  {
    "payment_method": {
      "id": "uuid",
      "payment_type": "card",
      "card_brand": "visa",
      "card_last_four": "4242",
      "is_default": false
    }
  }

# Get Payment Methods
GET /payment-methods
Headers: Authorization: Bearer <token>
Response: 200
  {
    "payment_methods": [ /* array */ ]
  }

# Delete Payment Method
DELETE /payment-methods/{id}
Headers: Authorization: Bearer <token>
Response: 204

# Process Payment (after job completion)
POST /payments
Headers: Authorization: Bearer <token>
Request:
  {
    "booking_id": "uuid",
    "payment_method_id": "uuid",
    "amount": 850.00,
    "tip_amount": 50.00
  }
Response: 201
  {
    "payment": {
      "id": "uuid",
      "payment_reference": "PAY-2026-001234",
      "payment_status": "completed",
      "amount": 850.00,
      "tip_amount": 50.00,
      "total_amount": 900.00
    },
    "receipt_url": "https://..."
  }

# Get Payment History
GET /payments
Headers: Authorization: Bearer <token>
Query Params: ?page=1&per_page=20
Response: 200
  {
    "payments": [ /* array of payments */ ],
    "total": 45
  }

# Get Single Payment
GET /payments/{id}
Headers: Authorization: Bearer <token>
Response: 200
  {
    "payment": { /* full payment details */ }
  }
```

#### 8. Professional Earnings & Withdrawals

```yaml
# Get Earnings Summary
GET /professionals/me/earnings
Headers: Authorization: Bearer <token>
Query Params: ?period=week // today, week, month, all
Response: 200
  {
    "period": "week",
    "total_earnings": 5420.00,
    "jobs_completed": 12,
    "tips_received": 450.00,
    "average_per_job": 451.67,
    "available_balance": 4275.50,
    "pending_earnings": 850.00,
    "earnings_chart": [
      { "date": "2026-01-19", "amount": 680.00 },
      { "date": "2026-01-20", "amount": 920.00 }
    ]
  }

# Request Withdrawal
POST /withdrawals
Headers: Authorization: Bearer <token>
Request:
  {
    "amount": 2000.00,
    "bank_account_id": "uuid"
  }
Response: 201
  {
    "withdrawal": {
      "id": "uuid",
      "withdrawal_reference": "WD-2026-001234",
      "amount": 2000.00,
      "processing_fee": 25.00,
      "net_amount": 1975.00,
      "withdrawal_status": "pending",
      "estimated_completion": "2026-01-27"
    }
  }

# Get Withdrawal History
GET /withdrawals
Headers: Authorization: Bearer <token>
Response: 200
  {
    "withdrawals": [ /* array */ ]
  }
```

#### 9. Messages

```yaml
# Get Conversations
GET /messages/conversations
Headers: Authorization: Bearer <token>
Response: 200
  {
    "conversations": [
      {
        "booking_id": "uuid",
        "other_user": { /* user details */ },
        "last_message": {
          "message_content": "I'm on my way",
          "created_at": "2026-01-25T13:45:00Z"
        },
        "unread_count": 2
      }
    ]
  }

# Get Messages for Booking
GET /bookings/{booking_id}/messages
Headers: Authorization: Bearer <token>
Query Params: ?page=1&per_page=50
Response: 200
  {
    "messages": [
      {
        "id": "uuid",
        "sender_id": "uuid",
        "message_type": "text",
        "message_content": "Hi! I'll be there at 2 PM",
        "is_read": true,
        "created_at": "2026-01-25T13:30:00Z"
      }
    ]
  }

# Send Message
POST /bookings/{booking_id}/messages
Headers: Authorization: Bearer <token>
Request:
  {
    "message_type": "text",
    "message_content": "Perfect! See you then"
  }
Response: 201
  {
    "message": { /* message object */ }
  }

# Mark Messages as Read
POST /bookings/{booking_id}/messages/read
Headers: Authorization: Bearer <token>
Response: 200
```

#### 10. Notifications

```yaml
# Get Notifications
GET /notifications
Headers: Authorization: Bearer <token>
Query Params: ?unread=true&page=1
Response: 200
  {
    "notifications": [
      {
        "id": "uuid",
        "notification_type": "booking",
        "title": "Booking Confirmed",
        "message": "Your plumbing service is confirmed",
        "related_id": "booking_uuid",
        "is_read": false,
        "created_at": "2026-01-25T10:00:00Z"
      }
    ],
    "unread_count": 5
  }

# Mark Notification as Read
POST /notifications/{id}/read
Headers: Authorization: Bearer <token>
Response: 200

# Mark All as Read
POST /notifications/read-all
Headers: Authorization: Bearer <token>
Response: 200

# Update Notification Preferences
PATCH /users/me/notification-preferences
Headers: Authorization: Bearer <token>
Request:
  {
    "push_enabled": true,
    "sms_enabled": true,
    "email_enabled": false,
    "booking_reminders": true,
    "promotional": false
  }
Response: 200
```

#### 11. Professional Application

```yaml
# Submit Application
POST /professional-applications
Request:
  {
    "email": "james@example.com",
    "phone": "+27123456789",
    "first_name": "James",
    "last_name": "Khumalo",
    "id_number": "8001015800089",
    "service_categories": ["plumbing", "electrical"],
    "years_experience": 5,
    "bio": "Experienced plumber...",
    "references": [
      {
        "name": "John Smith",
        "phone": "+27987654321",
        "relationship": "Previous employer"
      }
    ]
  }
Response: 201
  {
    "application": {
      "id": "uuid",
      "application_status": "pending",
      "created_at": "2026-01-24T10:00:00Z"
    }
  }

# Upload Application Document
POST /professional-applications/{id}/documents
Headers: Content-Type: multipart/form-data
Request:
  {
    "document_type": "id_document",
    "file": <file>
  }
Response: 201
  {
    "document_url": "https://..."
  }

# Check Application Status
GET /professional-applications/{id}
Response: 200
  {
    "application": {
      "id": "uuid",
      "application_status": "under_review",
      "background_check_status": "in_progress",
      "reference_check_status": "passed",
      "created_at": "2026-01-24T10:00:00Z"
    }
  }
```

#### 12. Reports & Disputes

```yaml
# Create Report
POST /reports
Headers: Authorization: Bearer <token>
Request:
  {
    "booking_id": "uuid",
    "report_type": "poor_quality",
    "description": "Work was not completed properly",
    "evidence_urls": ["url1", "url2"]
  }
Response: 201
  {
    "report": {
      "id": "uuid",
      "report_reference": "REP-2026-001234",
      "report_status": "open",
      "created_at": "2026-01-25T18:00:00Z"
    }
  }

# Get My Reports
GET /reports
Headers: Authorization: Bearer <token>
Response: 200
  {
    "reports": [ /* array of reports */ ]
  }

# Get Single Report
GET /reports/{id}
Headers: Authorization: Bearer <token>
Response: 200
  {
    "report": { /* full report details */ }
  }
```

#### 13. Referrals & Promo Codes

```yaml
# Get My Referral Code
GET /referrals/my-code
Headers: Authorization: Bearer <token>
Response: 200
  {
    "referral_code": "JOHN123",
    "total_referrals": 5,
    "total_rewards_earned": 250.00,
    "referral_url": "https://app.thehandyman.com/r/JOHN123"
  }

# Apply Promo Code
POST /promo-codes/validate
Headers: Authorization: Bearer <token>
Request:
  {
    "promo_code": "WELCOME50",
    "booking_amount": 826.00
  }
Response: 200
  {
    "valid": true,
    "discount_amount": 50.00,
    "final_amount": 776.00,
    "promo_code_details": { /* details */ }
  }
```

#### 14. Admin Endpoints

```yaml
# Get Dashboard Stats
GET /admin/dashboard
Headers: Authorization: Bearer <admin_token>
Response: 200
  {
    "stats": {
      "total_users": 12450,
      "active_professionals": 856,
      "bookings_today": 234,
      "revenue_today": 45678.00,
      "avg_rating": 4.8
    },
    "revenue_chart": [ /* data */ ],
    "recent_activity": [ /* activities */ ]
  }

# Manage Professional Applications
GET /admin/applications
Headers: Authorization: Bearer <admin_token>
Query Params: ?status=pending
Response: 200
  {
    "applications": [ /* array */ ]
  }

# Approve Application
POST /admin/applications/{id}/approve
Headers: Authorization: Bearer <admin_token>
Response: 200

# Reject Application
POST /admin/applications/{id}/reject
Headers: Authorization: Bearer <admin_token>
Request:
  {
    "reason": "Insufficient experience"
  }
Response: 200

# Manage Disputes
GET /admin/reports
Headers: Authorization: Bearer <admin_token>
Query Params: ?status=open&priority=high
Response: 200
  {
    "reports": [ /* array */ ]
  }

# Resolve Dispute
POST /admin/reports/{id}/resolve
Headers: Authorization: Bearer <admin_token>
Request:
  {
    "resolution": "Refund issued to client",
    "action_taken": "warning_issued"
  }
Response: 200

# Suspend User
POST /admin/users/{id}/suspend
Headers: Authorization: Bearer <admin_token>
Request:
  {
    "reason": "Multiple complaints",
    "duration_days": 7
  }
Response: 200
```

### WebSocket Events (Real-Time)

```yaml
# Client connects
Client -> Server: connect
Server -> Client: connected { user_id, session_id }

# Join booking room
Client -> Server: join_booking { booking_id }
Server -> Client: booking_joined { booking_id }

# New message
Client -> Server: send_message { booking_id, message }
Server -> Other Client: new_message { message }

# Professional location update (live tracking)
Professional -> Server: location_update { booking_id, lat, lng }
Server -> Client: professional_location { lat, lng, eta_minutes }

# Job status updates
Professional -> Server: job_status_changed { booking_id, status }
Server -> Client: booking_status_updated { booking_id, status }

# New job request (to professional)
Server -> Professional: new_job_request { booking }

# Typing indicators
Client -> Server: typing { booking_id }
Server -> Other Client: user_typing { user_id }
```

---

## Authentication & Authorization

### JWT Token Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_uuid",
    "email": "john@example.com",
    "user_type": "client",
    "iat": 1706112000,
    "exp": 1706115600,
    "jti": "token_id"
  }
}
```

### Token Expiration
- **Access Token**: 1 hour
- **Refresh Token**: 30 days
- **Password Reset Token**: 1 hour

### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  CLIENT = 'client',
  PROFESSIONAL = 'professional',
  ADMIN = 'admin'
}

// Middleware example
const requireRole = (roles: UserRole[]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.user_type)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

// Usage
router.get('/admin/dashboard', 
  authenticate, 
  requireRole([UserRole.ADMIN]), 
  getDashboard
);
```

### Permission Matrix

| Resource | Client | Professional | Admin |
|----------|--------|--------------|-------|
| Create Booking | ✅ | ❌ | ✅ |
| Accept Booking | ❌ | ✅ | ✅ |
| View Own Bookings | ✅ | ✅ | ✅ |
| View All Bookings | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Withdraw Earnings | ❌ | ✅ | ❌ |
| Resolve Disputes | ❌ | ❌ | ✅ |

---

## File Storage Strategy

### S3 Bucket Structure

```
/thehandyman-prod/
  /profiles/
    /clients/
      /{user_id}/
        /avatar.jpg
    /professionals/
      /{user_id}/
        /avatar.jpg
        /portfolio/
          /photo1.jpg
          /photo2.jpg
  /documents/
    /id-documents/
      /{user_id}/
        /id_front.jpg
        /id_back.jpg
    /certifications/
      /{user_id}/
        /cert1.pdf
  /bookings/
    /{booking_id}/
      /before/
        /photo1.jpg
      /after/
        /photo1.jpg
      /during/
        /photo1.jpg
  /reviews/
    /{review_id}/
      /photo1.jpg
```

### File Upload Process

```typescript
// 1. Client requests presigned URL
POST /files/upload-url
Request: {
  file_type: 'image/jpeg',
  file_size: 2048576,
  upload_category: 'profile_photo'
}
Response: {
  upload_url: 'https://s3.../presigned-url',
  file_key: 'profiles/clients/uuid/avatar.jpg',
  expires_in: 3600
}

// 2. Client uploads directly to S3
PUT https://s3.../presigned-url
Body: <file>

// 3. Client confirms upload
POST /files/confirm-upload
Request: {
  file_key: 'profiles/clients/uuid/avatar.jpg'
}
Response: {
  file_url: 'https://cdn.../avatar.jpg'
}
```

### Image Processing

```yaml
On Upload:
  1. Validate file type and size
  2. Scan for malware
  3. Generate thumbnails (if image)
     - Small: 150x150
     - Medium: 500x500
     - Large: 1200x1200
  4. Compress original
  5. Store in S3
  6. Serve via CloudFront CDN

Image Formats:
  - Upload: JPEG, PNG, WebP
  - Storage: WebP (optimized)
  - CDN: Serve WebP to supported browsers
```

---

## Real-Time Features

### Architecture

```
Client App
    ↓
Socket.io Client
    ↓
Load Balancer (Sticky Sessions)
    ↓
Socket.io Server (Multiple instances)
    ↓
Redis Pub/Sub (Message broker)
    ↓
All Socket.io instances receive events
```

### Implementation

```typescript
// Server-side (Node.js)
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL }
});

// Redis adapter for multiple instances
const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

// Authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  const user = await verifyToken(token);
  socket.data.user = user;
  next();
});

// Events
io.on('connection', (socket) => {
  console.log('User connected:', socket.data.user.id);
  
  // Join booking room
  socket.on('join_booking', (bookingId) => {
    socket.join(`booking:${bookingId}`);
  });
  
  // Send message
  socket.on('send_message', async (data) => {
    const message = await saveMessage(data);
    io.to(`booking:${data.booking_id}`).emit('new_message', message);
  });
  
  // Location update (professional)
  socket.on('location_update', (data) => {
    io.to(`booking:${data.booking_id}`).emit('professional_location', {
      lat: data.lat,
      lng: data.lng,
      eta_minutes: calculateETA(data)
    });
  });
});
```

```typescript
// Client-side (React Native)
import io from 'socket.io-client';

const socket = io('https://api.thehandyman.com', {
  auth: {
    token: accessToken
  }
});

// Connect
socket.on('connect', () => {
  console.log('Connected');
  socket.emit('join_booking', bookingId);
});

// Listen for messages
socket.on('new_message', (message) => {
  setMessages(prev => [...prev, message]);
});

// Listen for location updates
socket.on('professional_location', (location) => {
  setProfessionalLocation(location);
});

// Send message
const sendMessage = (text) => {
  socket.emit('send_message', {
    booking_id: bookingId,
    message_content: text
  });
};
```

---

## Payment Integration

### Stripe Integration (Recommended)

```typescript
// Server-side
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
async function createPaymentIntent(amount, currency = 'ZAR') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      booking_id: bookingId
    }
  });
  
  return {
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id
  };
}

// Handle Webhook
app.post('/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
  }
  
  res.json({received: true});
});
```

```typescript
// Client-side (React Native)
import { CardField, useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  
  const handlePayment = async () => {
    // 1. Get client secret from backend
    const { client_secret } = await api.post('/payments/create-intent', {
      booking_id: bookingId,
      amount: totalAmount
    });
    
    // 2. Confirm payment
    const { error, paymentIntent } = await confirmPayment(client_secret, {
      paymentMethodType: 'Card',
    });
    
    if (error) {
      Alert.alert('Payment failed', error.message);
    } else {
      Alert.alert('Success', 'Payment confirmed!');
      navigation.navigate('BookingConfirmed');
    }
  };
  
  return (
    <View>
      <CardField
        postalCodeEnabled={true}
        onCardChange={(cardDetails) => {
          setCardValid(cardDetails.complete);
        }}
      />
      <Button onPress={handlePayment} disabled={!cardValid}>
        Pay R{totalAmount}
      </Button>
    </View>
  );
};
```

### Payment Flow

```
1. Client completes booking → Create payment intent (backend)
2. Backend creates Stripe Payment Intent → Returns client_secret
3. Client enters card details → Confirms payment (Stripe SDK)
4. Stripe processes payment → Sends webhook to backend
5. Backend verifies webhook → Updates booking status
6. Backend splits payment:
   - Platform fee (18%)
   - Professional earnings (82%)
7. Professional requests withdrawal
8. Backend initiates payout to professional's bank account
```

---

## Deployment Architecture

### Infrastructure Setup (AWS)

```yaml
Production Environment:
  Region: af-south-1 (Cape Town) / eu-west-1 (Ireland)
  
  Network:
    VPC: 10.0.0.0/16
    Public Subnets: 
      - 10.0.1.0/24 (AZ1)
      - 10.0.2.0/24 (AZ2)
    Private Subnets:
      - 10.0.10.0/24 (AZ1)
      - 10.0.20.0/24 (AZ2)
  
  Compute:
    Application Load Balancer:
      - HTTPS (443)
      - Health checks
      - SSL Certificate (ACM)
    
    ECS Cluster:
      - Service: API (2-10 tasks)
      - Service: WebSocket (2-5 tasks)
      - Service: Background Jobs (1-3 tasks)
      - Auto Scaling based on CPU/Memory
    
    Task Definition:
      - CPU: 512 (0.5 vCPU)
      - Memory: 1024 MB
      - Docker Image: ECR
  
  Database:
    RDS PostgreSQL:
      - Instance: db.t3.medium
      - Multi-AZ: Yes
      - Automated backups: Daily
      - Read Replica: 1
    
    ElastiCache Redis:
      - Instance: cache.t3.medium
      - Cluster mode: Enabled
      - Nodes: 2
  
  Storage:
    S3 Buckets:
      - thehandyman-prod-files
      - Versioning: Enabled
      - Lifecycle: Archive after 90 days
    
    CloudFront:
      - Origin: S3 bucket
      - Cache TTL: 24 hours
      - Compression: Enabled
  
  Background Jobs:
    SQS Queues:
      - notifications-queue
      - email-queue
      - background-checks-queue
    
    Lambda Functions:
      - Image processing
      - Email sending
      - SMS sending
      - Report generation
```

### CI/CD Pipeline

```yaml
GitHub Actions Workflow:

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 20
      - Install dependencies
      - Run linter
      - Run unit tests
      - Run integration tests
      - Generate coverage report
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Build Docker image
      - Scan for vulnerabilities
      - Push to ECR
  
  deploy-staging:
    needs: build
    if: branch == 'develop'
    runs-on: ubuntu-latest
    steps:
      - Update ECS task definition
      - Deploy to staging
      - Run smoke tests
  
  deploy-production:
    needs: build
    if: branch == 'main'
    runs-on: ubuntu-latest
    steps:
      - Create deployment
      - Update ECS task definition
      - Deploy to production (blue-green)
      - Run smoke tests
      - Monitor metrics
      - Rollback on failure
```

### Deployment Strategy

```
Blue-Green Deployment:

1. Deploy new version to "Green" environment
2. Run health checks
3. Route 10% of traffic to Green
4. Monitor metrics (5 minutes)
5. Route 50% of traffic to Green
6. Monitor metrics (10 minutes)
7. Route 100% of traffic to Green
8. Keep Blue environment for 24 hours (rollback)
9. Terminate Blue environment
```

---

## Performance Optimization

### Database Optimization

```sql
-- Indexes (already defined in schema, but critical ones)
CREATE INDEX CONCURRENTLY idx_bookings_client_scheduled 
  ON bookings(client_id, scheduled_date);

CREATE INDEX CONCURRENTLY idx_bookings_professional_status 
  ON bookings(professional_id, booking_status);

CREATE INDEX CONCURRENTLY idx_professionals_location 
  ON professionals USING GIST(ll_to_earth(base_location_lat, base_location_lng));

-- Partitioning (for large tables)
CREATE TABLE bookings_2026_01 PARTITION OF bookings
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- Materialized views for analytics
CREATE MATERIALIZED VIEW professional_stats AS
SELECT 
  p.id,
  COUNT(b.id) as total_bookings,
  AVG(r.overall_rating) as avg_rating,
  SUM(pay.professional_amount) as total_earnings
FROM professionals p
LEFT JOIN bookings b ON p.id = b.professional_id
LEFT JOIN reviews r ON p.id = r.professional_id
LEFT JOIN payments pay ON b.id = pay.booking_id
GROUP BY p.id;

-- Refresh daily
CREATE INDEX ON professional_stats(id);
REFRESH MATERIALIZED VIEW CONCURRENTLY professional_stats;
```

### Caching Strategy

```typescript
// Redis caching layers
const CACHE_TTL = {
  SERVICE_CATEGORIES: 3600,      // 1 hour
  PROFESSIONAL_PROFILE: 300,     // 5 minutes
  SEARCH_RESULTS: 60,            // 1 minute
  USER_SESSION: 86400,           // 24 hours
};

// Cache aside pattern
async function getProfessionalProfile(id: string) {
  const cacheKey = `professional:${id}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const professional = await db.professionals.findUnique({
    where: { id },
    include: { user: true, services: true }
  });
  
  // Store in cache
  await redis.setex(
    cacheKey, 
    CACHE_TTL.PROFESSIONAL_PROFILE, 
    JSON.stringify(professional)
  );
  
  return professional;
}

// Cache invalidation
async function updateProfessionalProfile(id: string, data: any) {
  await db.professionals.update({
    where: { id },
    data
  });
  
  // Invalidate cache
  await redis.del(`professional:${id}`);
}
```

### API Response Compression

```typescript
import compression from 'compression';

app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

### Database Connection Pooling

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                    // Max connections
  idleTimeoutMillis: 30000,   // Close idle clients after 30s
  connectionTimeoutMillis: 2000,
});
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests, please try again later.'
});

// Strict limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
```

---

## Security Considerations

### Security Checklist

```yaml
Authentication & Authorization:
  ✅ JWT tokens with short expiration
  ✅ Refresh token rotation
  ✅ Password hashing (bcrypt, cost factor 12)
  ✅ Role-based access control
  ✅ Two-factor authentication (optional)

Input Validation:
  ✅ Request validation (Zod/Joi)
  ✅ SQL injection prevention (ORM/parameterized queries)
  ✅ XSS prevention (sanitize inputs)
  ✅ CSRF protection
  ✅ File upload validation

Data Protection:
  ✅ Encryption at rest (database, S3)
  ✅ Encryption in transit (TLS 1.3)
  ✅ Sensitive data encryption (IDs, bank details)
  ✅ PII data handling (POPIA/GDPR compliance)
  ✅ Data retention policies

API Security:
  ✅ Rate limiting
  ✅ CORS configuration
  ✅ Helmet.js (security headers)
  ✅ API key rotation
  ✅ Webhook signature verification

Infrastructure:
  ✅ VPC with private subnets
  ✅ Security groups (least privilege)
  ✅ WAF (Web Application Firewall)
  ✅ DDoS protection
  ✅ Regular security audits
  ✅ Automated vulnerability scanning
```

### Encryption Implementation

```typescript
import crypto from 'crypto';

// Encrypt sensitive data (bank account numbers)
const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

function decrypt(encrypted: string): string {
  const [ivHex, authTagHex, encryptedText] = encrypted.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

---

## Monitoring & Logging

### Logging Strategy

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-server' },
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'combined.log' 
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Usage
logger.info('Booking created', { booking_id: '123', client_id: '456' });
logger.error('Payment failed', { error: err.message, booking_id: '123' });
```

### Monitoring Setup

```yaml
Application Metrics (Prometheus):
  - Request rate
  - Response time (p50, p95, p99)
  - Error rate
  - Active connections
  - Database query time
  - Cache hit rate

Business Metrics:
  - Bookings per hour
  - Revenue per hour
  - Professional acceptance rate
  - Average booking value
  - User acquisition
  - Retention rate

Infrastructure Metrics (CloudWatch):
  - CPU utilization
  - Memory utilization
  - Disk I/O
  - Network traffic
  - RDS connections
  - ECS task health

Alerts:
  - Error rate > 5%
  - Response time p95 > 500ms
  - Database CPU > 80%
  - Failed payments
  - Critical errors in logs
```

### Error Tracking (Sentry)

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,  // 10% of transactions
});

// Error handling middleware
app.use(Sentry.Handlers.errorHandler());

// Custom error tracking
try {
  await processPayment(booking);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      booking_id: booking.id,
      payment_method: booking.payment_method
    }
  });
  throw error;
}
```

---

## Next Steps

1. ✅ Review and validate technical architecture
2. ✅ Choose technology stack
3. ✅ Set up development environment
4. ✅ Initialize project structure
5. ✅ Implement core API endpoints
6. ✅ Build frontend applications
7. ✅ Integration testing
8. ✅ Performance testing
9. ✅ Security audit
10. ✅ Deploy to production

---

**End of Technical Architecture Document**

