# The Handy Man - Database Schema

## Document Information
- **Project**: The Handy Man
- **Date Created**: January 24, 2026
- **Version**: 1.0
- **Database**: PostgreSQL 14+
- **Status**: Draft

---

## Entity Relationship Overview

```
Users (Base)
├── Clients
├── Professionals
└── Admins

ServiceCategories
├── Services (many-to-many with Professionals)

Bookings
├── BookingStatusHistory
├── Messages
├── BookingPhotos

Reviews
├── ReviewPhotos

Payments
├── PaymentTransactions
├── Withdrawals

Notifications
Applications (Professional)
Reports/Disputes
ReferralCodes
PromoCodes
```

---

## Core Entities

### 1. Users (Base Table)
**Purpose:** Base table for all user types (clients, professionals, admins)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_type | ENUM | NOT NULL | 'client', 'professional', 'admin' |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| phone | VARCHAR(20) | UNIQUE, NOT NULL | Phone number |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| profile_photo_url | TEXT | | Profile picture URL |
| is_verified | BOOLEAN | DEFAULT FALSE | Email/phone verified |
| is_active | BOOLEAN | DEFAULT TRUE | Account active status |
| last_login | TIMESTAMP | | Last login time |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_users_email` on (email)
- `idx_users_phone` on (phone)
- `idx_users_user_type` on (user_type)

---

### 2. Clients
**Purpose:** Extended information for client users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users(id), UNIQUE | Reference to base user |
| default_address_id | UUID | FOREIGN KEY → addresses(id) | Default service address |
| total_bookings | INTEGER | DEFAULT 0 | Total bookings made |
| average_rating_given | DECIMAL(3,2) | | Avg rating client gives |
| preferred_language | VARCHAR(10) | DEFAULT 'en' | App language preference |
| notification_preferences | JSONB | | Notification settings |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_clients_user_id` on (user_id)

---

### 3. Addresses
**Purpose:** Store client service addresses

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| client_id | UUID | FOREIGN KEY → clients(id) | Client who owns address |
| label | VARCHAR(50) | NOT NULL | 'Home', 'Office', 'Other' |
| address_line1 | VARCHAR(255) | NOT NULL | Street address |
| address_line2 | VARCHAR(255) | | Apartment, suite, etc. |
| city | VARCHAR(100) | NOT NULL | City |
| province | VARCHAR(100) | NOT NULL | Province/state |
| postal_code | VARCHAR(20) | NOT NULL | Postal code |
| country | VARCHAR(100) | DEFAULT 'South Africa' | Country |
| latitude | DECIMAL(10,8) | | GPS latitude |
| longitude | DECIMAL(11,8) | | GPS longitude |
| special_instructions | TEXT | | Delivery/access notes |
| is_default | BOOLEAN | DEFAULT FALSE | Is default address |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_addresses_client_id` on (client_id)
- `idx_addresses_lat_lng` on (latitude, longitude)

---

### 4. Professionals
**Purpose:** Extended information for professional users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users(id), UNIQUE | Reference to base user |
| bio | TEXT | | Professional bio (max 300 chars) |
| years_experience | INTEGER | NOT NULL | Years of experience |
| id_number | VARCHAR(50) | UNIQUE | ID/License number (encrypted) |
| id_document_url | TEXT | | ID document URL |
| certifications | JSONB | | Array of certifications |
| portfolio_photos | JSONB | | Array of portfolio photo URLs |
| service_radius_km | INTEGER | DEFAULT 20 | Service radius in km |
| base_location_lat | DECIMAL(10,8) | | Home/base latitude |
| base_location_lng | DECIMAL(11,8) | | Home/base longitude |
| hourly_rate | DECIMAL(10,2) | | Base hourly rate |
| is_available | BOOLEAN | DEFAULT TRUE | Currently accepting jobs |
| total_jobs_completed | INTEGER | DEFAULT 0 | Total completed jobs |
| total_earnings | DECIMAL(12,2) | DEFAULT 0 | Total lifetime earnings |
| average_rating | DECIMAL(3,2) | | Average rating (1-5) |
| total_reviews | INTEGER | DEFAULT 0 | Total number of reviews |
| acceptance_rate | DECIMAL(5,2) | | Job acceptance rate % |
| response_time_minutes | INTEGER | | Avg response time |
| background_check_status | ENUM | DEFAULT 'pending' | 'pending', 'passed', 'failed' |
| background_check_date | DATE | | Date of last check |
| insurance_policy_number | VARCHAR(100) | | Insurance policy # |
| insurance_expiry_date | DATE | | Insurance expiry |
| bank_account_name | VARCHAR(255) | | Bank account name (encrypted) |
| bank_account_number | VARCHAR(50) | | Bank account # (encrypted) |
| bank_name | VARCHAR(100) | | Bank name |
| bank_branch_code | VARCHAR(20) | | Bank branch code |
| is_verified | BOOLEAN | DEFAULT FALSE | Admin verified |
| verification_date | DATE | | Date verified |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_professionals_user_id` on (user_id)
- `idx_professionals_available` on (is_available)
- `idx_professionals_rating` on (average_rating)
- `idx_professionals_location` on (base_location_lat, base_location_lng)

---

### 5. ProfessionalAvailability
**Purpose:** Manage professional working hours and availability

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| professional_id | UUID | FOREIGN KEY → professionals(id) | Professional reference |
| day_of_week | INTEGER | NOT NULL | 0=Sunday, 1=Monday, ... 6=Saturday |
| start_time | TIME | NOT NULL | Working start time |
| end_time | TIME | NOT NULL | Working end time |
| is_available | BOOLEAN | DEFAULT TRUE | Available on this day |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_availability_professional_id` on (professional_id)
- `idx_availability_day` on (day_of_week)

**Constraints:**
- UNIQUE (professional_id, day_of_week)

---

### 6. ProfessionalBlockedDates
**Purpose:** Track specific dates when professional is unavailable

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| professional_id | UUID | FOREIGN KEY → professionals(id) | Professional reference |
| blocked_date | DATE | NOT NULL | Date unavailable |
| reason | VARCHAR(255) | | Reason for unavailability |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |

**Indexes:**
- `idx_blocked_dates_professional_id` on (professional_id)
- `idx_blocked_dates_date` on (blocked_date)

---

### 7. ServiceCategories
**Purpose:** Main service categories (Plumbing, Painting, etc.)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly slug |
| description | TEXT | | Category description |
| icon_url | TEXT | | Category icon URL |
| is_active | BOOLEAN | DEFAULT TRUE | Active/inactive |
| display_order | INTEGER | DEFAULT 0 | Display order on app |
| estimated_duration_hours | DECIMAL(4,2) | | Typical duration |
| base_price | DECIMAL(10,2) | | Starting price |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_service_categories_slug` on (slug)
- `idx_service_categories_active` on (is_active)

**Initial Data:**
```sql
INSERT INTO service_categories (name, slug, description) VALUES
('Plumbing', 'plumbing', 'Leak repairs, installations, drain cleaning'),
('Painting', 'painting', 'Interior/exterior painting, touch-ups'),
('Carpentry', 'carpentry', 'Furniture repair, installations, custom work'),
('Tiling', 'tiling', 'Floor/wall tiling, tile repairs'),
('Electrical', 'electrical', 'Wiring, fixture installation, repairs'),
('Cleaning', 'cleaning', 'House cleaning, deep cleaning'),
('General Repairs', 'general-repairs', 'Handyman services, misc repairs');
```

---

### 8. ProfessionalServices
**Purpose:** Junction table - which services each professional offers

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| professional_id | UUID | FOREIGN KEY → professionals(id) | Professional reference |
| service_category_id | UUID | FOREIGN KEY → service_categories(id) | Service reference |
| custom_rate | DECIMAL(10,2) | | Professional's custom rate |
| years_experience | INTEGER | | Experience in this service |
| is_primary_service | BOOLEAN | DEFAULT FALSE | Primary specialty |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |

**Indexes:**
- `idx_professional_services_professional` on (professional_id)
- `idx_professional_services_category` on (service_category_id)

**Constraints:**
- UNIQUE (professional_id, service_category_id)

---

### 9. Bookings
**Purpose:** Core booking/job records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| booking_reference | VARCHAR(20) | UNIQUE, NOT NULL | Human-readable ref (e.g., HM-2026-001234) |
| client_id | UUID | FOREIGN KEY → clients(id) | Client who booked |
| professional_id | UUID | FOREIGN KEY → professionals(id) | Assigned professional |
| service_category_id | UUID | FOREIGN KEY → service_categories(id) | Service type |
| address_id | UUID | FOREIGN KEY → addresses(id) | Service location |
| booking_status | ENUM | NOT NULL | 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled' |
| scheduled_date | DATE | NOT NULL | Scheduled service date |
| scheduled_time_start | TIME | NOT NULL | Scheduled start time |
| scheduled_time_end | TIME | | Scheduled end time |
| actual_start_time | TIMESTAMP | | Actual start time |
| actual_end_time | TIMESTAMP | | Actual end time |
| duration_minutes | INTEGER | | Actual duration |
| client_description | TEXT | | Client's job description |
| professional_notes | TEXT | | Professional's notes |
| estimated_price | DECIMAL(10,2) | NOT NULL | Initial price estimate |
| final_price | DECIMAL(10,2) | | Final agreed price |
| price_adjustment_reason | TEXT | | Why price changed |
| platform_fee_percentage | DECIMAL(5,2) | DEFAULT 18.00 | Platform commission % |
| platform_fee_amount | DECIMAL(10,2) | | Calculated fee amount |
| professional_earnings | DECIMAL(10,2) | | Professional's net earnings |
| tip_amount | DECIMAL(10,2) | DEFAULT 0 | Tip from client |
| cancellation_reason | TEXT | | Reason if cancelled |
| cancelled_by | ENUM | | 'client', 'professional', 'admin' |
| cancelled_at | TIMESTAMP | | Cancellation timestamp |
| is_emergency | BOOLEAN | DEFAULT FALSE | Emergency service flag |
| requires_materials | BOOLEAN | DEFAULT FALSE | Materials needed |
| completed_at | TIMESTAMP | | Completion timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Booking creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_bookings_client_id` on (client_id)
- `idx_bookings_professional_id` on (professional_id)
- `idx_bookings_reference` on (booking_reference)
- `idx_bookings_status` on (booking_status)
- `idx_bookings_scheduled_date` on (scheduled_date)
- `idx_bookings_created_at` on (created_at)

---

### 10. BookingStatusHistory
**Purpose:** Track all status changes for bookings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| booking_id | UUID | FOREIGN KEY → bookings(id) | Booking reference |
| old_status | ENUM | | Previous status |
| new_status | ENUM | NOT NULL | New status |
| changed_by_user_id | UUID | FOREIGN KEY → users(id) | Who made the change |
| notes | TEXT | | Change notes/reason |
| created_at | TIMESTAMP | DEFAULT NOW() | Change timestamp |

**Indexes:**
- `idx_booking_status_history_booking_id` on (booking_id)

---

### 11. BookingPhotos
**Purpose:** Before/after photos for bookings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| booking_id | UUID | FOREIGN KEY → bookings(id) | Booking reference |
| uploaded_by_user_id | UUID | FOREIGN KEY → users(id) | Who uploaded |
| photo_url | TEXT | NOT NULL | Photo URL |
| photo_type | ENUM | NOT NULL | 'before', 'after', 'progress' |
| caption | TEXT | | Photo caption |
| created_at | TIMESTAMP | DEFAULT NOW() | Upload timestamp |

**Indexes:**
- `idx_booking_photos_booking_id` on (booking_id)

---

### 12. Reviews
**Purpose:** Client reviews of professionals

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| booking_id | UUID | FOREIGN KEY → bookings(id), UNIQUE | Booking being reviewed |
| client_id | UUID | FOREIGN KEY → clients(id) | Client reviewer |
| professional_id | UUID | FOREIGN KEY → professionals(id) | Professional being reviewed |
| overall_rating | INTEGER | NOT NULL, CHECK (1-5) | Overall rating 1-5 |
| punctuality_rating | INTEGER | CHECK (1-5) | Punctuality rating |
| quality_rating | INTEGER | CHECK (1-5) | Quality rating |
| professionalism_rating | INTEGER | CHECK (1-5) | Professionalism rating |
| value_rating | INTEGER | CHECK (1-5) | Value for money rating |
| review_text | TEXT | | Written review (max 500 chars) |
| would_recommend | BOOLEAN | DEFAULT TRUE | Would recommend? |
| is_visible | BOOLEAN | DEFAULT TRUE | Visible on profile |
| professional_response | TEXT | | Professional's response |
| responded_at | TIMESTAMP | | Response timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Review timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_reviews_booking_id` on (booking_id)
- `idx_reviews_professional_id` on (professional_id)
- `idx_reviews_rating` on (overall_rating)
- `idx_reviews_created_at` on (created_at)

---

### 13. ReviewPhotos
**Purpose:** Photos attached to reviews

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| review_id | UUID | FOREIGN KEY → reviews(id) | Review reference |
| photo_url | TEXT | NOT NULL | Photo URL |
| caption | TEXT | | Photo caption |
| created_at | TIMESTAMP | DEFAULT NOW() | Upload timestamp |

**Indexes:**
- `idx_review_photos_review_id` on (review_id)

---

### 14. Messages
**Purpose:** In-app messaging between clients and professionals

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| booking_id | UUID | FOREIGN KEY → bookings(id) | Related booking |
| sender_id | UUID | FOREIGN KEY → users(id) | Message sender |
| receiver_id | UUID | FOREIGN KEY → users(id) | Message receiver |
| message_type | ENUM | DEFAULT 'text' | 'text', 'image', 'location' |
| message_content | TEXT | NOT NULL | Message content |
| attachment_url | TEXT | | Attachment URL if any |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| read_at | TIMESTAMP | | Read timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Message timestamp |

**Indexes:**
- `idx_messages_booking_id` on (booking_id)
- `idx_messages_sender_id` on (sender_id)
- `idx_messages_receiver_id` on (receiver_id)
- `idx_messages_created_at` on (created_at)

---

### 15. Payments
**Purpose:** Track all payment transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| booking_id | UUID | FOREIGN KEY → bookings(id) | Related booking |
| client_id | UUID | FOREIGN KEY → clients(id) | Client paying |
| professional_id | UUID | FOREIGN KEY → professionals(id) | Professional receiving |
| payment_reference | VARCHAR(100) | UNIQUE | Payment gateway reference |
| payment_method | ENUM | NOT NULL | 'card', 'mobile_money', 'cash' |
| payment_status | ENUM | DEFAULT 'pending' | 'pending', 'completed', 'failed', 'refunded' |
| amount | DECIMAL(10,2) | NOT NULL | Total amount |
| platform_fee | DECIMAL(10,2) | NOT NULL | Platform commission |
| professional_amount | DECIMAL(10,2) | NOT NULL | Professional's share |
| tip_amount | DECIMAL(10,2) | DEFAULT 0 | Tip amount |
| currency | VARCHAR(3) | DEFAULT 'ZAR' | Currency code |
| payment_gateway | VARCHAR(50) | | Gateway used (Stripe, etc.) |
| gateway_transaction_id | VARCHAR(255) | | Gateway transaction ID |
| card_last_four | VARCHAR(4) | | Last 4 digits of card |
| paid_at | TIMESTAMP | | Payment completion time |
| refund_amount | DECIMAL(10,2) | | Refund amount if any |
| refund_reason | TEXT | | Refund reason |
| refunded_at | TIMESTAMP | | Refund timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_payments_booking_id` on (booking_id)
- `idx_payments_client_id` on (client_id)
- `idx_payments_professional_id` on (professional_id)
- `idx_payments_reference` on (payment_reference)
- `idx_payments_status` on (payment_status)

---

### 16. PaymentMethods
**Purpose:** Store client saved payment methods

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| client_id | UUID | FOREIGN KEY → clients(id) | Client owner |
| payment_type | ENUM | NOT NULL | 'card', 'mobile_money' |
| card_brand | VARCHAR(50) | | Visa, Mastercard, etc. |
| card_last_four | VARCHAR(4) | | Last 4 digits |
| card_expiry_month | INTEGER | | Expiry month |
| card_expiry_year | INTEGER | | Expiry year |
| mobile_money_provider | VARCHAR(50) | | Provider name |
| mobile_money_number | VARCHAR(20) | | Phone number (encrypted) |
| gateway_customer_id | VARCHAR(255) | | Stripe customer ID |
| gateway_payment_method_id | VARCHAR(255) | | Stripe payment method ID |
| is_default | BOOLEAN | DEFAULT FALSE | Default payment method |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_payment_methods_client_id` on (client_id)

---

### 17. Withdrawals
**Purpose:** Professional withdrawal/payout requests

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| professional_id | UUID | FOREIGN KEY → professionals(id) | Professional requesting |
| withdrawal_reference | VARCHAR(100) | UNIQUE | Withdrawal reference |
| amount | DECIMAL(10,2) | NOT NULL | Withdrawal amount |
| bank_account_number | VARCHAR(50) | | Bank account # (encrypted) |
| bank_name | VARCHAR(100) | | Bank name |
| withdrawal_status | ENUM | DEFAULT 'pending' | 'pending', 'processing', 'completed', 'failed' |
| processing_fee | DECIMAL(10,2) | DEFAULT 0 | Processing fee |
| net_amount | DECIMAL(10,2) | | Amount after fees |
| requested_at | TIMESTAMP | DEFAULT NOW() | Request timestamp |
| processed_at | TIMESTAMP | | Processing timestamp |
| completed_at | TIMESTAMP | | Completion timestamp |
| failure_reason | TEXT | | Failure reason if any |
| admin_notes | TEXT | | Admin notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_withdrawals_professional_id` on (professional_id)
- `idx_withdrawals_reference` on (withdrawal_reference)
- `idx_withdrawals_status` on (withdrawal_status)

---

### 18. Notifications
**Purpose:** Track all notifications sent to users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY → users(id) | Recipient user |
| notification_type | ENUM | NOT NULL | 'booking', 'payment', 'message', 'review', 'system' |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| related_id | UUID | | Related entity ID (booking, message, etc.) |
| related_type | VARCHAR(50) | | Related entity type |
| delivery_method | ENUM[] | | ['push', 'sms', 'email'] |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| is_sent | BOOLEAN | DEFAULT FALSE | Sent status |
| sent_at | TIMESTAMP | | Sent timestamp |
| read_at | TIMESTAMP | | Read timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_notifications_user_id` on (user_id)
- `idx_notifications_is_read` on (is_read)
- `idx_notifications_created_at` on (created_at)

---

### 19. ProfessionalApplications
**Purpose:** Track professional applications to join platform

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | NOT NULL | Applicant email |
| phone | VARCHAR(20) | NOT NULL | Applicant phone |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| id_number | VARCHAR(50) | | ID number (encrypted) |
| id_document_url | TEXT | | ID document URL |
| service_categories | JSONB | NOT NULL | Services they offer |
| years_experience | INTEGER | NOT NULL | Years of experience |
| certifications | JSONB | | Certifications |
| references | JSONB | NOT NULL | References (min 2) |
| portfolio_urls | JSONB | | Portfolio photos |
| bio | TEXT | | Professional bio |
| application_status | ENUM | DEFAULT 'pending' | 'pending', 'under_review', 'approved', 'rejected' |
| background_check_status | ENUM | DEFAULT 'pending' | 'pending', 'in_progress', 'passed', 'failed' |
| reference_check_status | ENUM | DEFAULT 'pending' | 'pending', 'in_progress', 'passed', 'failed' |
| reviewed_by_admin_id | UUID | FOREIGN KEY → users(id) | Admin who reviewed |
| reviewed_at | TIMESTAMP | | Review timestamp |
| rejection_reason | TEXT | | Rejection reason |
| notes | TEXT | | Admin notes |
| created_at | TIMESTAMP | DEFAULT NOW() | Application date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_applications_email` on (email)
- `idx_applications_status` on (application_status)
- `idx_applications_created_at` on (created_at)

---

### 20. Reports
**Purpose:** Track issues/disputes reported by users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| report_reference | VARCHAR(100) | UNIQUE | Report reference |
| reported_by_user_id | UUID | FOREIGN KEY → users(id) | User reporting |
| reported_user_id | UUID | FOREIGN KEY → users(id) | User being reported |
| booking_id | UUID | FOREIGN KEY → bookings(id) | Related booking |
| report_type | ENUM | NOT NULL | 'no_show', 'poor_quality', 'safety_concern', 'pricing_dispute', 'harassment', 'other' |
| report_category | ENUM | NOT NULL | 'complaint', 'dispute', 'safety', 'quality' |
| priority | ENUM | DEFAULT 'medium' | 'low', 'medium', 'high', 'urgent' |
| description | TEXT | NOT NULL | Report description |
| evidence_urls | JSONB | | Photos/documents |
| report_status | ENUM | DEFAULT 'open' | 'open', 'under_review', 'resolved', 'closed' |
| assigned_to_admin_id | UUID | FOREIGN KEY → users(id) | Admin handling |
| admin_notes | TEXT | | Admin investigation notes |
| resolution | TEXT | | Resolution details |
| resolved_at | TIMESTAMP | | Resolution timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Report timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_reports_reference` on (report_reference)
- `idx_reports_reported_by` on (reported_by_user_id)
- `idx_reports_reported_user` on (reported_user_id)
- `idx_reports_booking_id` on (booking_id)
- `idx_reports_status` on (report_status)
- `idx_reports_priority` on (priority)

---

### 21. ReferralCodes
**Purpose:** Manage referral program

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| referrer_user_id | UUID | FOREIGN KEY → users(id) | User who refers |
| referral_code | VARCHAR(20) | UNIQUE, NOT NULL | Unique referral code |
| referred_user_id | UUID | FOREIGN KEY → users(id) | User who was referred |
| referrer_reward_amount | DECIMAL(10,2) | DEFAULT 50.00 | Reward for referrer |
| referred_reward_amount | DECIMAL(10,2) | DEFAULT 50.00 | Reward for referred |
| reward_status | ENUM | DEFAULT 'pending' | 'pending', 'earned', 'redeemed' |
| reward_earned_at | TIMESTAMP | | When reward earned |
| reward_redeemed_at | TIMESTAMP | | When reward redeemed |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Code creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_referral_codes_code` on (referral_code)
- `idx_referral_codes_referrer` on (referrer_user_id)
- `idx_referral_codes_referred` on (referred_user_id)

---

### 22. PromoCodes
**Purpose:** Manage promotional discount codes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| promo_code | VARCHAR(50) | UNIQUE, NOT NULL | Promo code |
| description | TEXT | | Code description |
| discount_type | ENUM | NOT NULL | 'percentage', 'fixed_amount' |
| discount_value | DECIMAL(10,2) | NOT NULL | Discount value |
| min_booking_amount | DECIMAL(10,2) | DEFAULT 0 | Minimum booking amount |
| max_discount_amount | DECIMAL(10,2) | | Max discount cap |
| usage_limit | INTEGER | | Total usage limit |
| usage_count | INTEGER | DEFAULT 0 | Current usage count |
| user_usage_limit | INTEGER | DEFAULT 1 | Per-user usage limit |
| valid_from | TIMESTAMP | NOT NULL | Valid from date |
| valid_until | TIMESTAMP | NOT NULL | Valid until date |
| applicable_services | JSONB | | Service categories array |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_by_admin_id | UUID | FOREIGN KEY → users(id) | Admin who created |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
- `idx_promo_codes_code` on (promo_code)
- `idx_promo_codes_active` on (is_active)
- `idx_promo_codes_valid_dates` on (valid_from, valid_until)

---

### 23. PromoCodeUsage
**Purpose:** Track promo code usage

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| promo_code_id | UUID | FOREIGN KEY → promo_codes(id) | Promo code used |
| user_id | UUID | FOREIGN KEY → users(id) | User who used code |
| booking_id | UUID | FOREIGN KEY → bookings(id) | Booking with promo |
| discount_applied | DECIMAL(10,2) | NOT NULL | Discount amount applied |
| created_at | TIMESTAMP | DEFAULT NOW() | Usage timestamp |

**Indexes:**
- `idx_promo_usage_code_id` on (promo_code_id)
- `idx_promo_usage_user_id` on (user_id)
- `idx_promo_usage_booking_id` on (booking_id)

---

### 24. ProfessionalBadges
**Purpose:** Badges earned by professionals

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| professional_id | UUID | FOREIGN KEY → professionals(id) | Professional owner |
| badge_type | ENUM | NOT NULL | 'top_rated', 'super_pro', 'fast_responder', 'reliable', 'expert' |
| badge_name | VARCHAR(100) | NOT NULL | Badge display name |
| badge_icon_url | TEXT | | Badge icon URL |
| earned_at | TIMESTAMP | DEFAULT NOW() | When earned |
| expires_at | TIMESTAMP | | Expiry date (if applicable) |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |

**Indexes:**
- `idx_badges_professional_id` on (professional_id)
- `idx_badges_type` on (badge_type)

---

### 25. SystemSettings
**Purpose:** App-wide configuration settings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| setting_key | VARCHAR(100) | UNIQUE, NOT NULL | Setting key |
| setting_value | TEXT | NOT NULL | Setting value |
| setting_type | ENUM | NOT NULL | 'string', 'number', 'boolean', 'json' |
| description | TEXT | | Setting description |
| is_public | BOOLEAN | DEFAULT FALSE | Visible to clients |
| updated_by_admin_id | UUID | FOREIGN KEY → users(id) | Admin who updated |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update date |

**Example Settings:**
- `platform_fee_percentage` = 18.00
- `booking_cancellation_hours` = 24
- `professional_service_radius_km` = 20
- `minimum_withdrawal_amount` = 500
- `referral_reward_amount` = 50
- `emergency_service_fee` = 100

---

## ENUM Definitions

```sql
CREATE TYPE user_type AS ENUM ('client', 'professional', 'admin');

CREATE TYPE booking_status AS ENUM (
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled'
);

CREATE TYPE cancelled_by AS ENUM ('client', 'professional', 'admin');

CREATE TYPE payment_method AS ENUM ('card', 'mobile_money', 'cash');

CREATE TYPE payment_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);

CREATE TYPE withdrawal_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed'
);

CREATE TYPE notification_type AS ENUM (
    'booking',
    'payment',
    'message',
    'review',
    'system'
);

CREATE TYPE message_type AS ENUM ('text', 'image', 'location');

CREATE TYPE photo_type AS ENUM ('before', 'after', 'progress');

CREATE TYPE background_check_status AS ENUM ('pending', 'passed', 'failed');

CREATE TYPE application_status AS ENUM (
    'pending',
    'under_review',
    'approved',
    'rejected'
);

CREATE TYPE report_type AS ENUM (
    'no_show',
    'poor_quality',
    'safety_concern',
    'pricing_dispute',
    'harassment',
    'other'
);

CREATE TYPE report_category AS ENUM (
    'complaint',
    'dispute',
    'safety',
    'quality'
);

CREATE TYPE report_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE report_status AS ENUM (
    'open',
    'under_review',
    'resolved',
    'closed'
);

CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount');

CREATE TYPE badge_type AS ENUM (
    'top_rated',
    'super_pro',
    'fast_responder',
    'reliable',
    'expert'
);

CREATE TYPE setting_type AS ENUM ('string', 'number', 'boolean', 'json');
```

---

## Sample Queries

### 1. Find Available Professionals for a Service

```sql
SELECT 
    p.id,
    u.first_name,
    u.last_name,
    p.average_rating,
    p.total_reviews,
    p.hourly_rate,
    ps.custom_rate,
    -- Calculate distance
    (
        6371 * acos(
            cos(radians(:client_lat)) * cos(radians(p.base_location_lat)) *
            cos(radians(p.base_location_lng) - radians(:client_lng)) +
            sin(radians(:client_lat)) * sin(radians(p.base_location_lat))
        )
    ) AS distance_km
FROM professionals p
JOIN users u ON p.user_id = u.id
JOIN professional_services ps ON p.id = ps.professional_id
WHERE 
    ps.service_category_id = :service_category_id
    AND p.is_available = TRUE
    AND p.is_verified = TRUE
    AND (
        6371 * acos(
            cos(radians(:client_lat)) * cos(radians(p.base_location_lat)) *
            cos(radians(p.base_location_lng) - radians(:client_lng)) +
            sin(radians(:client_lat)) * sin(radians(p.base_location_lat))
        )
    ) <= p.service_radius_km
    -- Check availability for requested date/time
    AND NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.professional_id = p.id
        AND b.scheduled_date = :requested_date
        AND b.booking_status IN ('confirmed', 'in_progress')
        AND (
            (b.scheduled_time_start <= :requested_time_start AND b.scheduled_time_end > :requested_time_start)
            OR
            (b.scheduled_time_start < :requested_time_end AND b.scheduled_time_end >= :requested_time_end)
        )
    )
    -- Check blocked dates
    AND NOT EXISTS (
        SELECT 1 FROM professional_blocked_dates pbd
        WHERE pbd.professional_id = p.id
        AND pbd.blocked_date = :requested_date
    )
ORDER BY 
    p.average_rating DESC,
    distance_km ASC
LIMIT 10;
```

### 2. Get Professional Performance Metrics

```sql
SELECT 
    p.id,
    u.first_name || ' ' || u.last_name AS full_name,
    p.total_jobs_completed,
    p.average_rating,
    p.total_reviews,
    p.acceptance_rate,
    p.response_time_minutes,
    COUNT(DISTINCT b.id) AS bookings_this_month,
    SUM(CASE WHEN b.booking_status = 'completed' THEN 1 ELSE 0 END) AS completed_this_month,
    SUM(CASE WHEN b.booking_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_this_month,
    AVG(r.overall_rating) AS avg_rating_this_month,
    SUM(pay.professional_amount) AS earnings_this_month
FROM professionals p
JOIN users u ON p.user_id = u.id
LEFT JOIN bookings b ON p.id = b.professional_id 
    AND b.created_at >= date_trunc('month', CURRENT_DATE)
LEFT JOIN reviews r ON p.id = r.professional_id 
    AND r.created_at >= date_trunc('month', CURRENT_DATE)
LEFT JOIN payments pay ON p.id = pay.professional_id 
    AND pay.payment_status = 'completed'
    AND pay.created_at >= date_trunc('month', CURRENT_DATE)
WHERE p.id = :professional_id
GROUP BY p.id, u.first_name, u.last_name;
```

### 3. Get Client Booking History with Details

```sql
SELECT 
    b.id,
    b.booking_reference,
    b.booking_status,
    b.scheduled_date,
    b.scheduled_time_start,
    sc.name AS service_name,
    u.first_name || ' ' || u.last_name AS professional_name,
    u.profile_photo_url,
    p.average_rating,
    a.address_line1,
    a.city,
    b.estimated_price,
    b.final_price,
    r.overall_rating AS my_rating,
    r.review_text
FROM bookings b
JOIN clients c ON b.client_id = c.id
JOIN service_categories sc ON b.service_category_id = sc.id
JOIN professionals p ON b.professional_id = p.id
JOIN users u ON p.user_id = u.id
JOIN addresses a ON b.address_id = a.id
LEFT JOIN reviews r ON b.id = r.booking_id
WHERE c.user_id = :user_id
ORDER BY b.scheduled_date DESC, b.created_at DESC;
```

### 4. Calculate Platform Revenue

```sql
SELECT 
    date_trunc('day', paid_at) AS date,
    COUNT(*) AS total_payments,
    SUM(amount) AS total_revenue,
    SUM(platform_fee) AS platform_earnings,
    SUM(professional_amount) AS professional_earnings,
    AVG(amount) AS average_booking_value
FROM payments
WHERE 
    payment_status = 'completed'
    AND paid_at >= :start_date
    AND paid_at <= :end_date
GROUP BY date_trunc('day', paid_at)
ORDER BY date DESC;
```

---

## Database Migration Strategy

### Phase 1: Core Tables (Week 1)
1. Users, Clients, Professionals
2. Addresses
3. ServiceCategories, ProfessionalServices
4. ProfessionalAvailability, ProfessionalBlockedDates

### Phase 2: Booking System (Week 2)
1. Bookings
2. BookingStatusHistory
3. BookingPhotos
4. Messages

### Phase 3: Reviews & Payments (Week 3)
1. Reviews, ReviewPhotos
2. Payments, PaymentMethods
3. Withdrawals

### Phase 4: Admin & Support (Week 4)
1. ProfessionalApplications
2. Reports
3. Notifications
4. SystemSettings

### Phase 5: Marketing & Growth (Week 5)
1. ReferralCodes
2. PromoCodes, PromoCodeUsage
3. ProfessionalBadges

---

## Backup & Maintenance

### Daily Backups
- Full database backup at 2 AM
- Transaction log backups every hour
- Retention: 30 days

### Weekly Maintenance
- Index optimization
- Query performance analysis
- Clean up old notifications (> 90 days)
- Archive completed bookings (> 1 year)

### Data Retention Policy
- User accounts: Indefinite (unless deleted by user)
- Bookings: 2 years in main DB, then archive
- Messages: 1 year
- Notifications: 90 days
- Payment records: 7 years (compliance)

---

## Security Considerations

1. **Encryption**
   - ID numbers, bank account numbers encrypted at rest
   - All API communications over HTTPS/TLS
   - Database encryption enabled

2. **Access Control**
   - Row-level security for multi-tenant data
   - Admin users have separate authentication
   - API rate limiting

3. **PII Protection**
   - POPIA/GDPR compliance
   - Data anonymization for analytics
   - Right to deletion support

4. **Audit Logging**
   - Log all sensitive data access
   - Track all booking status changes
   - Record all payment transactions

---

## Next Steps
1. Review and validate schema design
2. Create database migration scripts
3. Set up development database
4. Create seed data for testing
5. Design API endpoints based on schema

