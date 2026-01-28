# The Handy Man - User Stories

## Document Information
- **Project**: The Handy Man
- **Date Created**: January 24, 2026
- **Version**: 1.0
- **Status**: Draft

---

## Epic 1: Client Registration & Profile Management

### US-001: Client Sign Up
**As a** homeowner/client  
**I want to** quickly create an account  
**So that** I can book artisanal services

**Acceptance Criteria:**
- [ ] User can sign up with email and password
- [ ] User can sign up with phone number
- [ ] User can sign up with Google/Facebook social login
- [ ] Password must be at least 8 characters with 1 number
- [ ] User receives verification email/SMS
- [ ] Sign up process takes less than 1 minute
- [ ] User is redirected to home screen after successful registration

**Priority:** P0 (Critical for MVP)  
**Estimate:** 5 story points

---

### US-002: Client Profile Setup
**As a** registered client  
**I want to** set up my profile with contact details and addresses  
**So that** professionals can reach me and provide services at my location

**Acceptance Criteria:**
- [ ] User can add full name
- [ ] User can add phone number
- [ ] User can add profile photo (optional)
- [ ] User can add multiple service addresses
- [ ] User can set a default address
- [ ] User can edit profile information anytime
- [ ] Changes are saved instantly

**Priority:** P0 (Critical for MVP)  
**Estimate:** 3 story points

---

### US-003: Manage Multiple Addresses
**As a** client  
**I want to** save multiple addresses (home, office, rental property)  
**So that** I can quickly book services for different locations

**Acceptance Criteria:**
- [ ] User can add unlimited addresses
- [ ] Each address has a label (Home, Office, Other)
- [ ] User can edit/delete saved addresses
- [ ] User can set one address as default
- [ ] Address autocomplete using Google Maps API
- [ ] GPS-based current location detection

**Priority:** P1 (Important for MVP)  
**Estimate:** 3 story points

---

## Epic 2: Service Discovery & Booking

### US-004: Browse Service Categories
**As a** client  
**I want to** see all available service categories on the home screen  
**So that** I can quickly find the service I need

**Acceptance Criteria:**
- [ ] Display service categories with icons (Plumbing, Painting, Carpentry, Tiling, Cleaning, Electrical, General Repairs)
- [ ] Each category shows a brief description
- [ ] Visual icons are clear and intuitive
- [ ] Categories load in less than 1 second
- [ ] Mobile-optimized grid layout
- [ ] Tap on category opens booking flow

**Priority:** P0 (Critical for MVP)  
**Estimate:** 3 story points

---

### US-005: Quick Service Booking Flow
**As a** client  
**I want to** book a service in less than 2 minutes  
**So that** I can quickly get help without hassle

**Acceptance Criteria:**
- [ ] Step 1: Select service category (single tap)
- [ ] Step 2: Select/confirm address (autocomplete, saved addresses)
- [ ] Step 3: Choose date (calendar widget, today/tomorrow quick select)
- [ ] Step 4: Choose time slot (morning/afternoon/evening or specific time)
- [ ] Step 5: Describe the job (optional text field, max 500 characters)
- [ ] Step 6: View available professionals with ratings
- [ ] Step 7: See price estimate
- [ ] Step 8: Confirm booking
- [ ] Total flow takes less than 2 minutes
- [ ] Progress indicator shows current step (1/8, 2/8, etc.)
- [ ] User can go back to previous steps
- [ ] All data is cached (returns to same point if app closes)

**Priority:** P0 (Critical for MVP)  
**Estimate:** 13 story points

---

### US-006: View Professional Profiles
**As a** client  
**I want to** view detailed profiles of available professionals  
**So that** I can choose the best person for my job

**Acceptance Criteria:**
- [ ] Display professional photo
- [ ] Show name and specialty
- [ ] Show overall rating (1-5 stars) with number of reviews
- [ ] Show years of experience
- [ ] Show completed jobs count
- [ ] Display certifications/badges (verified, top-rated, etc.)
- [ ] Show recent reviews (3-5 reviews)
- [ ] Display hourly rate or base price
- [ ] Show response time (how fast they accept jobs)
- [ ] User can tap to see full profile with all reviews

**Priority:** P0 (Critical for MVP)  
**Estimate:** 5 story points

---

### US-007: Get Price Estimate
**As a** client  
**I want to** see the estimated cost before confirming  
**So that** I know what to expect and can budget accordingly

**Acceptance Criteria:**
- [ ] Show base price for service
- [ ] Show estimated duration
- [ ] Show total estimated cost
- [ ] Display any additional fees (platform fee, insurance)
- [ ] Show payment methods accepted
- [ ] Clear breakdown of costs
- [ ] Note that final price may vary based on actual work
- [ ] Price displayed in local currency

**Priority:** P0 (Critical for MVP)  
**Estimate:** 3 story points

---

### US-008: Confirm Booking
**As a** client  
**I want to** receive instant confirmation of my booking  
**So that** I know my request has been received

**Acceptance Criteria:**
- [ ] Display confirmation screen with booking details
- [ ] Show booking reference number
- [ ] Show professional details (name, photo, rating)
- [ ] Show service date, time, and address
- [ ] Show estimated price
- [ ] Send confirmation SMS/email
- [ ] Send push notification
- [ ] Add booking to "My Bookings" section
- [ ] Option to share booking details
- [ ] Option to add to calendar

**Priority:** P0 (Critical for MVP)  
**Estimate:** 3 story points

---

## Epic 3: Booking Management

### US-009: View My Bookings
**As a** client  
**I want to** see all my upcoming and past bookings  
**So that** I can keep track of my services

**Acceptance Criteria:**
- [ ] Separate tabs for "Upcoming" and "Past" bookings
- [ ] Display booking cards with key info (service type, date, time, professional name, status)
- [ ] Status indicators (Pending, Confirmed, In Progress, Completed, Cancelled)
- [ ] Tap on booking to view full details
- [ ] Sort by date (newest first for upcoming, most recent first for past)
- [ ] Empty state message when no bookings
- [ ] Pull to refresh functionality

**Priority:** P0 (Critical for MVP)  
**Estimate:** 5 story points

---

### US-010: View Booking Details
**As a** client  
**I want to** see complete details of a specific booking  
**So that** I have all information at hand

**Acceptance Criteria:**
- [ ] Display booking reference number
- [ ] Show service category and description
- [ ] Show professional details (name, photo, rating, phone)
- [ ] Show date, time, and address
- [ ] Show estimated and actual price
- [ ] Show booking status
- [ ] Option to call professional
- [ ] Option to message professional
- [ ] Option to get directions to address
- [ ] Cancel/Reschedule buttons (if applicable)
- [ ] Rate & Review button (after completion)

**Priority:** P0 (Critical for MVP)  
**Estimate:** 3 story points

---

### US-011: Cancel Booking
**As a** client  
**I want to** cancel a booking if my plans change  
**So that** I'm not charged for a service I don't need

**Acceptance Criteria:**
- [ ] Cancel button visible on booking details (if status allows)
- [ ] Show cancellation policy (free cancellation window)
- [ ] Confirm cancellation with reason selection (optional)
- [ ] Show any cancellation fees if applicable
- [ ] Update booking status to "Cancelled"
- [ ] Send notification to professional
- [ ] Send confirmation to client
- [ ] Refund processed according to policy

**Priority:** P1 (Important for MVP)  
**Estimate:** 5 story points

---

### US-012: Reschedule Booking
**As a** client  
**I want to** reschedule a booking to a different date/time  
**So that** I can adjust to my changing schedule

**Acceptance Criteria:**
- [ ] Reschedule button visible on booking details
- [ ] Opens date/time picker with professional's availability
- [ ] Show if same professional is available
- [ ] Option to request different professional if needed
- [ ] Confirm new date and time
- [ ] Update booking details
- [ ] Send notification to professional
- [ ] Send confirmation to client
- [ ] Show reschedule in booking history

**Priority:** P1 (Important for MVP)  
**Estimate:** 5 story points

---

### US-013: Track Professional in Real-Time
**As a** client  
**I want to** track the professional's location on booking day  
**So that** I know when they will arrive

**Acceptance Criteria:**
- [ ] Map view showing professional's current location
- [ ] Show estimated arrival time
- [ ] Update location every 30 seconds
- [ ] Show when professional is en route
- [ ] Show when professional has arrived
- [ ] Notification when professional is 10 minutes away
- [ ] Only visible on booking day when professional has accepted

**Priority:** P2 (Nice to have)  
**Estimate:** 8 story points

---

## Epic 4: Communication

### US-014: Message Professional
**As a** client  
**I want to** send messages to my professional  
**So that** I can communicate details or ask questions

**Acceptance Criteria:**
- [ ] In-app chat interface
- [ ] Real-time messaging
- [ ] Message history saved
- [ ] Push notifications for new messages
- [ ] Unread message badge
- [ ] Can send text messages
- [ ] Can share photos
- [ ] Can share location
- [ ] Timestamps on all messages
- [ ] Professional can only be messaged after booking confirmed

**Priority:** P1 (Important for MVP)  
**Estimate:** 8 story points

---

### US-015: Call Professional
**As a** client  
**I want to** call the professional directly  
**So that** I can discuss urgent matters

**Acceptance Criteria:**
- [ ] Call button on booking details page
- [ ] Tap to initiate phone call
- [ ] Privacy option (masked number through app)
- [ ] Only available after booking confirmed
- [ ] Call log tracked (for disputes)

**Priority:** P1 (Important for MVP)  
**Estimate:** 3 story points

---

## Epic 5: Ratings & Reviews

### US-016: Rate Professional After Service
**As a** client  
**I want to** rate the professional after service completion  
**So that** I can share my experience with others

**Acceptance Criteria:**
- [ ] Rating prompt appears after service marked complete
- [ ] 5-star rating system
- [ ] Option to leave written review (optional, max 500 characters)
- [ ] Category ratings (Punctuality, Quality, Professionalism, Value)
- [ ] Option to add photos of completed work
- [ ] Option to tip professional
- [ ] Option to skip and rate later
- [ ] Reminder notification if not rated within 48 hours
- [ ] Rating appears on professional's profile

**Priority:** P0 (Critical for MVP)  
**Estimate:** 5 story points

---

### US-017: View Professional Reviews
**As a** client  
**I want to** read reviews from other clients  
**So that** I can make an informed decision

**Acceptance Criteria:**
- [ ] Display all reviews on professional profile
- [ ] Show reviewer name (first name + initial)
- [ ] Show rating (stars)
- [ ] Show review text
- [ ] Show review date
- [ ] Show photos if included
- [ ] Sort options (Most Recent, Highest Rated, Lowest Rated)
- [ ] Filter by service type
- [ ] Show verified booking badge

**Priority:** P1 (Important for MVP)  
**Estimate:** 3 story points

---

### US-018: Report Issue
**As a** client  
**I want to** report a problem with a booking or professional  
**So that** the platform can address issues

**Acceptance Criteria:**
- [ ] Report button on booking details
- [ ] Select issue category (No show, Poor quality, Safety concern, Pricing dispute, Other)
- [ ] Text field to describe issue (required, max 1000 characters)
- [ ] Option to upload photos/evidence
- [ ] Submit report to admin
- [ ] Receive confirmation of report
- [ ] Track report status
- [ ] Receive resolution notification

**Priority:** P1 (Important for MVP)  
**Estimate:** 5 story points

---

## Epic 6: Payment

### US-019: Add Payment Method
**As a** client  
**I want to** save my payment methods securely  
**So that** I can pay quickly without entering details each time

**Acceptance Criteria:**
- [ ] Add credit/debit card
- [ ] Add mobile money account
- [ ] Card details entered securely (PCI compliant)
- [ ] Option to set default payment method
- [ ] Can save multiple payment methods
- [ ] Can delete payment methods
- [ ] Security indicators (padlock icon, "Secure Payment" text)

**Priority:** P0 (Critical for MVP)  
**Estimate:** 8 story points

---

### US-020: Pay for Service
**As a** client  
**I want to** pay securely through the app  
**So that** I don't need to handle cash

**Acceptance Criteria:**
- [ ] Payment processed after service completion
- [ ] Choose payment method
- [ ] See final amount (can differ from estimate if job scope changed)
- [ ] Professional can adjust price with reason
- [ ] Client approves adjusted price
- [ ] Payment confirmation screen
- [ ] Digital receipt sent via email/SMS
- [ ] Payment history visible in app
- [ ] Refund option if issue reported

**Priority:** P0 (Critical for MVP)  
**Estimate:** 8 story points

---

### US-021: View Payment History
**As a** client  
**I want to** see all my past payments  
**So that** I can track my spending and access receipts

**Acceptance Criteria:**
- [ ] List all transactions
- [ ] Show date, service type, professional, amount
- [ ] Filter by date range
- [ ] Search by professional or service
- [ ] Download receipt as PDF
- [ ] Email receipt
- [ ] Show payment method used
- [ ] Show payment status (Completed, Pending, Refunded)

**Priority:** P2 (Nice to have)  
**Estimate:** 5 story points

---

### US-022: Tip Professional
**As a** client  
**I want to** tip the professional for excellent service  
**So that** I can show appreciation

**Acceptance Criteria:**
- [ ] Tipping option after service completion
- [ ] Suggested tip amounts (10%, 15%, 20%)
- [ ] Custom tip amount option
- [ ] Tip processed with main payment
- [ ] Professional receives 100% of tip
- [ ] Tip shown separately on receipt

**Priority:** P2 (Nice to have)  
**Estimate:** 3 story points

---

## Epic 7: Professional Application & Onboarding

### US-023: Apply to Join Platform
**As a** skilled artisan  
**I want to** apply to join The Handy Man platform  
**So that** I can find more clients and grow my business

**Acceptance Criteria:**
- [ ] Separate "Become a Professional" flow
- [ ] Application form with personal details
- [ ] Select service categories and specialties
- [ ] Upload ID/driver's license
- [ ] Upload certifications/licenses
- [ ] Upload references (2 required)
- [ ] Confirm 2+ years of experience
- [ ] Agree to background check
- [ ] Submit application
- [ ] Receive confirmation email
- [ ] Status page to track application

**Priority:** P0 (Critical for MVP)  
**Estimate:** 8 story points

---

### US-024: Complete Professional Profile
**As a** approved professional  
**I want to** create a detailed profile  
**So that** clients can learn about me and my skills

**Acceptance Criteria:**
- [ ] Upload professional photo
- [ ] Add bio (max 300 characters)
- [ ] List service categories
- [ ] List specialties/skills
- [ ] Add years of experience
- [ ] Upload portfolio photos (up to 10)
- [ ] Set service areas/radius
- [ ] Set hourly rate or base prices
- [ ] Add certifications/badges
- [ ] Profile preview before publishing

**Priority:** P0 (Critical for MVP)  
**Estimate:** 5 story points

---

### US-025: Set Availability
**As a** professional  
**I want to** set my availability and working hours  
**So that** I only receive bookings when I'm available

**Acceptance Criteria:**
- [ ] Calendar view to set availability
- [ ] Set recurring weekly schedule
- [ ] Block out specific dates
- [ ] Set working hours per day
- [ ] Mark as available/unavailable instantly
- [ ] "Vacation mode" to pause all bookings
- [ ] Changes reflected immediately in booking system

**Priority:** P0 (Critical for MVP)  
**Estimate:** 8 story points

---

## Epic 8: Professional Job Management

### US-026: Receive Job Notifications
**As a** professional  
**I want to** receive instant notifications for new job requests  
**So that** I can respond quickly

**Acceptance Criteria:**
- [ ] Push notification for new job request
- [ ] SMS notification (optional)
- [ ] Notification shows service type, location, date, time, estimated earning
- [ ] Sound/vibration alert
- [ ] Tap notification to open job details
- [ ] Badge count on app icon

**Priority:** P0 (Critical for MVP)  
**Estimate:** 3 story points

---

### US-027: View Job Request Details
**As a** professional  
**I want to** see complete job details before accepting  
**So that** I can make an informed decision

**Acceptance Criteria:**
- [ ] Service type and client description
- [ ] Date and time
- [ ] Service address with map
- [ ] Distance from current location
- [ ] Estimated duration
- [ ] Estimated earnings
- [ ] Client rating and review count
- [ ] Accept/Decline buttons
- [ ] Counter-offer option (suggest different time)

**Priority:** P0 (Critical for MVP)  
**Estimate:** 5 story points

---

### US-028: Accept/Decline Job
**As a** professional  
**I want to** accept or decline job requests  
**So that** I control my workload

**Acceptance Criteria:**
- [ ] Large Accept and Decline buttons
- [ ] Auto-decline after 15 minutes if no response
- [ ] If declined, job offered to next professional
- [ ] If declined, optional reason selection
- [ ] If accepted, booking status changes to Confirmed
- [ ] Client receives notification of acceptance
- [ ] Job added to professional's schedule
- [ ] Navigation option to job location

**Priority:** P0 (Critical for MVP)  
**Estimate:** 5 story points

---

### US-029: View My Schedule
**As a** professional  
**I want to** see all my confirmed jobs in a calendar  
**So that** I can plan my day/week

**Acceptance Criteria:**
- [ ] Calendar view (day/week/month)
- [ ] Job cards showing time, service type, location
- [ ] Color-coded by service category
- [ ] Tap job to view full details
- [ ] Show travel time between jobs
- [ ] Daily earnings summary
- [ ] Empty slots show available time

**Priority:** P1 (Important for MVP)  
**Estimate:** 5 story points

---

### US-030: Start Job
**As a** professional  
**I want to** mark when I start a job  
**So that** the client knows I've arrived and time tracking begins

**Acceptance Criteria:**
- [ ] "Start Job" button on booking details
- [ ] GPS verification that professional is at location (within 100m)
- [ ] Time stamp recorded
- [ ] Client receives notification
- [ ] Booking status changes to "In Progress"
- [ ] Timer starts for duration tracking

**Priority:** P1 (Important for MVP)  
**Estimate:** 5 story points

---

### US-031: Complete Job
**As a** professional  
**I want to** mark a job as complete  
**So that** I can get paid and the client can review

**Acceptance Criteria:**
- [ ] "Complete Job" button on booking details
- [ ] Time stamp recorded
- [ ] Option to adjust final price if scope changed
- [ ] Reason required if price changed
- [ ] Option to upload before/after photos
- [ ] Job summary (duration, tasks completed)
- [ ] Client must approve completion and adjusted price
- [ ] Payment processed after client approval
- [ ] Booking status changes to "Completed"

**Priority:** P0 (Critical for MVP)  
**Estimate:** 5 story points

---

### US-032: Upload Job Photos
**As a** professional  
**I want to** upload photos of completed work  
**So that** I can showcase my skills and protect against disputes

**Acceptance Criteria:**
- [ ] Upload before photos
- [ ] Upload after photos
- [ ] Up to 10 photos per job
- [ ] Photos visible to client
- [ ] Photos added to professional portfolio (with client consent)
- [ ] Compress photos to reduce storage

**Priority:** P2 (Nice to have)  
**Estimate:** 3 story points

---

## Epic 9: Professional Earnings & Payments

### US-033: View Earnings Dashboard
**As a** professional  
**I want to** see my earnings and performance metrics  
**So that** I can track my income and growth

**Acceptance Criteria:**
- [ ] Total earnings (today, this week, this month, all time)
- [ ] Number of completed jobs
- [ ] Average rating
- [ ] Average earnings per job
- [ ] Acceptance rate
- [ ] Graph showing earnings over time
- [ ] Tips received
- [ ] Pending earnings (jobs completed but not paid out yet)

**Priority:** P1 (Important for MVP)  
**Estimate:** 8 story points

---

### US-034: Withdraw Earnings
**As a** professional  
**I want to** withdraw my earnings to my bank account  
**So that** I can access my money

**Acceptance Criteria:**
- [ ] View available balance
- [ ] Add bank account details (verified)
- [ ] Choose withdrawal amount (minimum R500)
- [ ] Platform fee deducted (15-20%)
- [ ] Processing time displayed (1-3 business days)
- [ ] Withdrawal confirmation
- [ ] Email notification when funds transferred
- [ ] Transaction history

**Priority:** P0 (Critical for MVP)  
**Estimate:** 8 story points

---

### US-035: View Payment History
**As a** professional  
**I want to** see all my payments and deductions  
**So that** I can track my income and verify accuracy

**Acceptance Criteria:**
- [ ] List all payments received
- [ ] Show date, client, service type, amount earned, platform fee
- [ ] Filter by date range
- [ ] Search by client
- [ ] Download statement as PDF
- [ ] Show payment method (instant/weekly payout)
- [ ] Show withdrawal history

**Priority:** P2 (Nice to have)  
**Estimate:** 5 story points

---

## Epic 10: Professional Communication

### US-036: Message Client
**As a** professional  
**I want to** message my client  
**So that** I can confirm details or ask questions

**Acceptance Criteria:**
- [ ] In-app chat interface
- [ ] Real-time messaging
- [ ] Message history saved
- [ ] Push notifications for new messages
- [ ] Can send text messages
- [ ] Can share photos
- [ ] Can share ETA
- [ ] Timestamps on all messages
- [ ] Professional guidelines for communication

**Priority:** P1 (Important for MVP)  
**Estimate:** 5 story points

---

### US-037: Call Client
**As a** professional  
**I want to** call the client  
**So that** I can discuss job details or notify of arrival

**Acceptance Criteria:**
- [ ] Call button on booking details
- [ ] Tap to initiate phone call
- [ ] Privacy option (masked number through app)
- [ ] Only available after job accepted
- [ ] Call log tracked

**Priority:** P1 (Important for MVP)  
**Estimate:** 2 story points

---

## Epic 11: Professional Performance & Growth

### US-038: View My Ratings & Reviews
**As a** professional  
**I want to** see my ratings and reviews  
**So that** I know what clients think and can improve

**Acceptance Criteria:**
- [ ] Overall rating (1-5 stars)
- [ ] Number of reviews
- [ ] All reviews listed with date, rating, comment
- [ ] Category ratings (Punctuality, Quality, Professionalism, Value)
- [ ] Filter by rating (5-star, 4-star, etc.)
- [ ] Respond to reviews (optional)

**Priority:** P2 (Nice to have)  
**Estimate:** 5 story points

---

### US-039: Earn Badges & Achievements
**As a** professional  
**I want to** earn badges for good performance  
**So that** I can stand out and attract more clients

**Acceptance Criteria:**
- [ ] Badge system (Top Rated, Super Pro, Fast Responder, etc.)
- [ ] Criteria for each badge displayed
- [ ] Badges shown on profile
- [ ] Notification when badge earned
- [ ] Badges increase booking priority

**Priority:** P2 (Nice to have)  
**Estimate:** 8 story points

---

## Epic 12: Admin & Platform Management

### US-040: Admin Dashboard
**As an** admin  
**I want to** view platform metrics and activity  
**So that** I can monitor business health

**Acceptance Criteria:**
- [ ] Total users (clients and professionals)
- [ ] Total bookings (today, week, month)
- [ ] Total revenue
- [ ] Active bookings
- [ ] Average booking value
- [ ] Professional acceptance rate
- [ ] Client satisfaction score
- [ ] Charts and graphs for trends

**Priority:** P1 (Important for MVP)  
**Estimate:** 13 story points

---

### US-041: Approve/Reject Professional Applications
**As an** admin  
**I want to** review and approve professional applications  
**So that** only qualified professionals join the platform

**Acceptance Criteria:**
- [ ] List all pending applications
- [ ] View application details
- [ ] View submitted documents
- [ ] Background check results
- [ ] Reference check results
- [ ] Approve or Reject buttons
- [ ] Rejection reason required
- [ ] Applicant notified of decision
- [ ] Approved professionals can access app

**Priority:** P0 (Critical for MVP)  
**Estimate:** 8 story points

---

### US-042: Manage Service Categories
**As an** admin  
**I want to** add, edit, or remove service categories  
**So that** the platform can evolve with market needs

**Acceptance Criteria:**
- [ ] List all service categories
- [ ] Add new category with icon and description
- [ ] Edit category details
- [ ] Deactivate category (don't delete, preserve data)
- [ ] Set pricing guidelines per category
- [ ] Changes reflected immediately on client app

**Priority:** P2 (Nice to have)  
**Estimate:** 5 story points

---

### US-043: Handle Disputes
**As an** admin  
**I want to** review and resolve disputes between clients and professionals  
**So that** both parties are treated fairly

**Acceptance Criteria:**
- [ ] List all open disputes
- [ ] View dispute details (client complaint, professional response)
- [ ] View booking details and evidence
- [ ] Chat with both parties
- [ ] Make ruling (refund, payment release, warning, ban)
- [ ] Record resolution
- [ ] Notify both parties
- [ ] Track dispute history

**Priority:** P1 (Important for MVP)  
**Estimate:** 13 story points

---

### US-044: Suspend/Ban Users
**As an** admin  
**I want to** suspend or ban problematic users  
**So that** the platform remains safe and trustworthy

**Acceptance Criteria:**
- [ ] View user profile (client or professional)
- [ ] See user history (bookings, reviews, disputes)
- [ ] Suspend temporarily (7, 14, 30 days)
- [ ] Ban permanently
- [ ] Reason required
- [ ] User notified
- [ ] User cannot access platform
- [ ] Option to reverse suspension/ban

**Priority:** P1 (Important for MVP)  
**Estimate:** 5 story points

---

## Epic 13: Notifications & Alerts

### US-045: Receive Booking Notifications
**As a** client  
**I want to** receive notifications about my bookings  
**So that** I stay informed

**Acceptance Criteria:**
- [ ] Booking confirmed
- [ ] Professional assigned
- [ ] Professional accepted job
- [ ] Reminder 24 hours before
- [ ] Reminder 1 hour before
- [ ] Professional is on the way
- [ ] Professional has arrived
- [ ] Job completed
- [ ] Reminder to rate
- [ ] Push notification + SMS + Email (user preference)

**Priority:** P1 (Important for MVP)  
**Estimate:** 5 story points

---

### US-046: Receive Job Notifications
**As a** professional  
**I want to** receive notifications about job opportunities  
**So that** I don't miss out

**Acceptance Criteria:**
- [ ] New job request
- [ ] Job cancelled by client
- [ ] Reminder of upcoming job
- [ ] Payment received
- [ ] New message from client
- [ ] New review received
- [ ] Badge earned
- [ ] Push notification + SMS (professional preference)

**Priority:** P1 (Important for MVP)  
**Estimate:** 3 story points

---

## Epic 14: Help & Support

### US-047: Access Help Center
**As a** user (client or professional)  
**I want to** access FAQs and help articles  
**So that** I can find answers to common questions

**Acceptance Criteria:**
- [ ] Help Center accessible from menu
- [ ] Categories (Booking, Payments, Account, Safety, etc.)
- [ ] Search functionality
- [ ] Articles with text and images
- [ ] Related articles suggested
- [ ] "Was this helpful?" feedback
- [ ] Contact support button if issue not resolved

**Priority:** P2 (Nice to have)  
**Estimate:** 8 story points

---

### US-048: Contact Support
**As a** user  
**I want to** contact customer support  
**So that** I can get help with issues

**Acceptance Criteria:**
- [ ] In-app chat with support agent
- [ ] Support ticket submission form
- [ ] Phone support option
- [ ] Email support option
- [ ] Attach screenshots or documents
- [ ] Ticket tracking
- [ ] Response within 24 hours
- [ ] Support available 7am-7pm daily

**Priority:** P1 (Important for MVP)  
**Estimate:** 13 story points

---

## Epic 15: Safety & Security

### US-049: Verify Professional Background
**As a** platform  
**I want to** conduct background checks on all professionals  
**So that** clients can trust the service

**Acceptance Criteria:**
- [ ] Criminal record check (automated via third-party API)
- [ ] ID verification
- [ ] Reference checks (2 required, contacted by phone)
- [ ] Certification verification
- [ ] Results recorded in admin dashboard
- [ ] Only approved after all checks pass
- [ ] Re-verification annually

**Priority:** P0 (Critical for MVP)  
**Estimate:** 13 story points

---

### US-050: Report Safety Concern
**As a** user  
**I want to** report a safety concern immediately  
**So that** action can be taken quickly

**Acceptance Criteria:**
- [ ] Emergency "Report Safety Issue" button
- [ ] Select concern type (Threat, Harassment, Theft, Other)
- [ ] Text field for details
- [ ] Upload photos/evidence
- [ ] Immediate alert to admin
- [ ] Option to call emergency services
- [ ] Booking automatically suspended
- [ ] Follow-up from admin within 1 hour

**Priority:** P0 (Critical for MVP)  
**Estimate:** 8 story points

---

## Epic 16: Referral Program

### US-051: Refer a Friend
**As a** client  
**I want to** refer friends to the platform  
**So that** we both get rewards

**Acceptance Criteria:**
- [ ] Generate unique referral code
- [ ] Share via WhatsApp, SMS, Email, Social Media
- [ ] Friend uses code to sign up
- [ ] Both get credit/discount after friend's first booking
- [ ] Track referrals in app
- [ ] View earned rewards
- [ ] Unlimited referrals

**Priority:** P2 (Nice to have)  
**Estimate:** 8 story points

---

## Epic 17: Promotions & Discounts

### US-052: Apply Promo Code
**As a** client  
**I want to** apply a promo code to my booking  
**So that** I can get a discount

**Acceptance Criteria:**
- [ ] Promo code field on payment screen
- [ ] Validate code (active, not expired, user eligible)
- [ ] Apply discount (percentage or fixed amount)
- [ ] Show original and discounted price
- [ ] One promo code per booking
- [ ] Record promo usage

**Priority:** P2 (Nice to have)  
**Estimate:** 5 story points

---

## Summary by Priority

### P0 - Critical for MVP (Must Have)
- 23 user stories
- Estimated: ~145 story points

### P1 - Important for MVP (Should Have)
- 16 user stories
- Estimated: ~110 story points

### P2 - Nice to Have (Could Have)
- 13 user stories
- Estimated: ~87 story points

---

## Notes
- Each story point roughly equals 1 day of development time
- MVP focus should be P0 and select P1 stories
- P2 stories can be included in post-MVP releases
- Estimates are approximate and should be refined during sprint planning
- Stories may be broken down further into subtasks during development

---

## Next Steps
1. Prioritize user stories with stakeholders
2. Create detailed wireframes for each flow
3. Design database schema
4. Set up development environment
5. Begin Sprint 1 with highest priority stories

