# The Handy Man - Wireframes & User Flow Diagrams

## Document Information
- **Project**: The Handy Man
- **Date Created**: January 24, 2026
- **Version**: 1.0
- **Status**: Draft

---

## Table of Contents
1. [User Flow Diagrams](#user-flow-diagrams)
2. [Client App Wireframes](#client-app-wireframes)
3. [Professional App Wireframes](#professional-app-wireframes)
4. [Admin Dashboard Wireframes](#admin-dashboard-wireframes)
5. [Design System](#design-system)

---

## User Flow Diagrams

### 1. Client Booking Flow (Primary Flow)

```
┌─────────────────┐
│   APP LAUNCH    │
│   (Splash)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      Not Logged In     ┌─────────────────┐
│  Check Auth     │─────────────────────────▶│   Login/Signup  │
└────────┬────────┘                          └────────┬────────┘
         │ Logged In                                  │
         ▼                                            │
┌─────────────────┐◀───────────────────────────────────┘
│   HOME SCREEN   │
│ Service Grid    │
└────────┬────────┘
         │ Select Service (e.g., Plumbing)
         ▼
┌─────────────────┐
│  STEP 1: SELECT │
│  SERVICE TYPE   │
│  [Plumbing]     │
└────────┬────────┘
         │ Tap Plumbing
         ▼
┌─────────────────┐
│  STEP 2: SELECT │
│    ADDRESS      │
│ • Current Loc   │
│ • Saved Address │
│ • Add New       │
└────────┬────────┘
         │ Select Address
         ▼
┌─────────────────┐
│  STEP 3: SELECT │
│   DATE & TIME   │
│ • Calendar      │
│ • Time Slots    │
└────────┬────────┘
         │ Pick Date/Time
         ▼
┌─────────────────┐
│  STEP 4: JOB    │
│   DESCRIPTION   │
│ [Text Field]    │
│ Optional        │
└────────┬────────┘
         │ Continue
         ▼
┌─────────────────┐
│  STEP 5: VIEW   │
│  AVAILABLE PROS │
│ • List of Pros  │
│ • Ratings       │
│ • Prices        │
└────────┬────────┘
         │ Select Professional
         ▼
┌─────────────────┐
│  STEP 6: PRICE  │
│   ESTIMATE      │
│ • Breakdown     │
│ • Total         │
└────────┬────────┘
         │ Confirm
         ▼
┌─────────────────┐
│  STEP 7: REVIEW │
│   & CONFIRM     │
│ • All Details   │
│ • Payment Method│
└────────┬────────┘
         │ Confirm Booking
         ▼
┌─────────────────┐
│  CONFIRMATION   │
│   SCREEN        │
│ • Ref Number    │
│ • Details       │
│ • Share/Calendar│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MY BOOKINGS    │
│  (Upcoming)     │
└─────────────────┘

Total Steps: 7 (Target: < 2 minutes)
```

### 2. Professional Job Acceptance Flow

```
┌─────────────────┐
│  NEW JOB REQUEST│
│  Push Notification
└────────┬────────┘
         │ Tap Notification
         ▼
┌─────────────────┐
│  JOB DETAILS    │
│ • Service Type  │
│ • Date/Time     │
│ • Location/Map  │
│ • Distance      │
│ • Client Rating │
│ • Estimated Pay │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌─────────┐
│ ACCEPT │ │ DECLINE │
└───┬────┘ └────┬────┘
    │           │ (Select Reason)
    │           ▼
    │      ┌─────────────┐
    │      │ Job offered │
    │      │ to next pro │
    │      └─────────────┘
    │
    ▼
┌─────────────────┐
│  CONFIRMATION   │
│ Job Added to    │
│ Your Schedule   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MY SCHEDULE    │
│ Calendar View   │
└─────────────────┘
```

### 3. Complete Booking Flow (Professional)

```
┌─────────────────┐
│  BOOKING DAY    │
│  My Schedule    │
└────────┬────────┘
         │ Tap Job
         ▼
┌─────────────────┐
│  JOB DETAILS    │
│ • Start Job Btn │
│ • Call Client   │
│ • Navigate      │
└────────┬────────┘
         │ Arrive at Location
         ▼
┌─────────────────┐
│  START JOB      │
│ GPS Verification│
│ Timer Starts    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JOB IN         │
│  PROGRESS       │
│ • Timer         │
│ • Add Photos    │
│ • Add Notes     │
└────────┬────────┘
         │ Work Completed
         ▼
┌─────────────────┐
│  COMPLETE JOB   │
│ • Upload Photos │
│ • Adjust Price? │
│ • Summary       │
└────────┬────────┘
         │ Submit
         ▼
┌─────────────────┐
│  AWAITING       │
│  CLIENT APPROVAL│
└────────┬────────┘
         │ Client Approves
         ▼
┌─────────────────┐
│  PAYMENT        │
│  PROCESSING     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JOB COMPLETED  │
│ Earnings Added  │
└─────────────────┘
```

### 4. Review & Rating Flow (Client)

```
┌─────────────────┐
│  JOB COMPLETED  │
│  Notification   │
└────────┬────────┘
         │ Tap Notification
         ▼
┌─────────────────┐
│  RATE YOUR      │
│  PROFESSIONAL   │
│ • Overall Stars │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  DETAILED       │
│  RATINGS        │
│ • Punctuality   │
│ • Quality       │
│ • Professional  │
│ • Value         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  WRITTEN REVIEW │
│  (Optional)     │
│ [Text Field]    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ADD PHOTOS     │
│  (Optional)     │
│ Upload Photos   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  TIP PROFESSIONAL│
│  (Optional)     │
│ • 10%, 15%, 20% │
│ • Custom        │
└────────┬────────┘
         │ Submit Review
         ▼
┌─────────────────┐
│  THANK YOU      │
│  Review Posted  │
└─────────────────┘
```

---

## Client App Wireframes

### Screen 1: Splash Screen
```
╔══════════════════════════════════╗
║                                  ║
║                                  ║
║                                  ║
║          🔨 🔧 🎨                ║
║                                  ║
║        THE HANDY MAN             ║
║                                  ║
║    Your trusted professionals    ║
║                                  ║
║                                  ║
║         [Loading...]             ║
║                                  ║
║                                  ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 2: Login/Signup
```
╔══════════════════════════════════╗
║  [← Back]                        ║
║                                  ║
║        THE HANDY MAN             ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 📧 Email or Phone          │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 🔒 Password                │ ║
║  └────────────────────────────┘ ║
║                                  ║
║         [Forgot Password?]       ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      LOGIN                 │ ║
║  └────────────────────────────┘ ║
║                                  ║
║      ──── or continue with ───   ║
║                                  ║
║   [Google]  [Facebook]  [Apple] ║
║                                  ║
║   Don't have an account?         ║
║         [Sign Up]                ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 3: Home Screen (Service Selection)
```
╔══════════════════════════════════╗
║ ☰  THE HANDY MAN          🔔 👤  ║
║──────────────────────────────────║
║                                  ║
║  Hello, John! 👋                 ║
║  What service do you need?       ║
║                                  ║
║  ┌────────────┐  ┌────────────┐ ║
║  │     🔧     │  │     🎨     │ ║
║  │  PLUMBING  │  │  PAINTING  │ ║
║  └────────────┘  └────────────┘ ║
║                                  ║
║  ┌────────────┐  ┌────────────┐ ║
║  │     🪚     │  │     🧱     │ ║
║  │ CARPENTRY  │  │   TILING   │ ║
║  └────────────┘  └────────────┘ ║
║                                  ║
║  ┌────────────┐  ┌────────────┐ ║
║  │     ⚡     │  │     🧹     │ ║
║  │ ELECTRICAL │  │  CLEANING  │ ║
║  └────────────┘  └────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │         🔨                 │ ║
║  │    GENERAL REPAIRS         │ ║
║  └────────────────────────────┘ ║
║                                  ║
║──────────────────────────────────║
║  🏠 Home  📅 Bookings  💬 Chat   ║
╚══════════════════════════════════╝
```

### Screen 4: Service Category Details
```
╔══════════════════════════════════╗
║  [← Back]      PLUMBING      [?] ║
║──────────────────────────────────║
║                                  ║
║  🔧 Plumbing Services            ║
║                                  ║
║  Common services include:        ║
║  • Leak repairs                  ║
║  • Pipe installations            ║
║  • Drain cleaning                ║
║  • Fixture repairs               ║
║  • Water heater services         ║
║                                  ║
║  💰 Starting from R350/hour      ║
║  ⏱️  Avg duration: 2-3 hours     ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │    BOOK PLUMBER            │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Recent Customer Reviews ─── ║
║                                  ║
║  ⭐⭐⭐⭐⭐ 4.8 (2,341 reviews)    ║
║                                  ║
║  Sarah M. ⭐⭐⭐⭐⭐               ║
║  "Fixed my leaking pipe quickly  ║
║  and professionally!"            ║
║  📷📷                            ║
║                                  ║
║  [View All Reviews]              ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 5: Select Address
```
╔══════════════════════════════════╗
║  [← Back]   Step 2 of 7     [×]  ║
║──────────────────────────────────║
║                                  ║
║  Where do you need service?      ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 📍 Use Current Location    │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Saved Addresses ───         ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 🏠 Home (Default)          │ ║
║  │ 123 Main St, Cape Town     │ ║
║  │                     [Edit] │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 🏢 Office                  │ ║
║  │ 456 Business Rd, CPT       │ ║
║  │                     [Edit] │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  + Add New Address         │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      CONTINUE              │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 6: Select Date & Time
```
╔══════════════════════════════════╗
║  [← Back]   Step 3 of 7     [×]  ║
║──────────────────────────────────║
║                                  ║
║  When do you need service?       ║
║                                  ║
║  ┌────────┐ ┌────────┐          ║
║  │ TODAY  │ │TOMORROW│          ║
║  │ Jan 24 │ │ Jan 25 │          ║
║  └────────┘ └────────┘          ║
║                                  ║
║  ┌──────────────────────────┐   ║
║  │   📅 Select Date         │   ║
║  │                          │   ║
║  │   January 2026           │   ║
║  │   S  M  T  W  T  F  S    │   ║
║  │         1  2  3  4  5    │   ║
║  │   6  7  8  9 10 11 12    │   ║
║  │  13 14 15 16 17 18 19    │   ║
║  │  20 21 22 23[24]25 26    │   ║
║  │  27 28 29 30 31          │   ║
║  └──────────────────────────┘   ║
║                                  ║
║  ─── Select Time ───             ║
║                                  ║
║  ⏰ Morning (8am - 12pm)    ○    ║
║  ⏰ Afternoon (12pm - 5pm)  ●    ║
║  ⏰ Evening (5pm - 8pm)     ○    ║
║                                  ║
║  Specific time: [2:00 PM ▼]     ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      CONTINUE              │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 7: Job Description
```
╔══════════════════════════════════╗
║  [← Back]   Step 4 of 7     [×]  ║
║──────────────────────────────────║
║                                  ║
║  Describe the job (Optional)     ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ Tell us more about what    │ ║
║  │ needs to be done...        │ ║
║  │                            │ ║
║  │ Example: "Leaking kitchen  │ ║
║  │ sink under the basin"      │ ║
║  │                            │ ║
║  │                            │ ║
║  │                            │ ║
║  │                            │ ║
║  │                            │ ║
║  │                            │ ║
║  │                            │ ║
║  └────────────────────────────┘ ║
║                        0/500     ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  📷 Add Photos (Optional)  │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ☐ This is an emergency          ║
║     (+R100 emergency fee)        ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      CONTINUE              │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      SKIP                  │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 8: Available Professionals
```
╔══════════════════════════════════╗
║  [← Back]   Step 5 of 7     [×]  ║
║──────────────────────────────────║
║                                  ║
║  Available Professionals         ║
║  Near 123 Main St, Cape Town     ║
║                                  ║
║  [Sort: Top Rated ▼]  [Filter]  ║
║                                  ║
║ ┌──────────────────────────────┐║
║ │ [Photo] James K.        ⭐4.9││
║ │         Plumbing Specialist  ││
║ │         ⚡2 min response      ││
║ │         📍2.3 km away        ││
║ │         💰R350/hr            ││
║ │         🏆Top Rated, Verified││
║ │         [View Profile] [SELECT]│
║ └──────────────────────────────┘║
║                                  ║
║ ┌──────────────────────────────┐║
║ │ [Photo] David M.        ⭐4.8││
║ │         Licensed Plumber     ││
║ │         ⚡5 min response      ││
║ │         📍3.1 km away        ││
║ │         💰R320/hr            ││
║ │         ✓ Verified, 500+ jobs││
║ │         [View Profile] [SELECT]│
║ └──────────────────────────────┘║
║                                  ║
║ ┌──────────────────────────────┐║
║ │ [Photo] Sarah L.        ⭐4.7││
║ │         Plumbing Pro         ││
║ │         ⚡10 min response     ││
║ │         📍4.5 km away        ││
║ │         💰R380/hr            ││
║ │         [View Profile] [SELECT]│
║ └──────────────────────────────┘║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 9: Professional Profile (Detail)
```
╔══════════════════════════════════╗
║  [← Back]                   [×]  ║
║──────────────────────────────────║
║         [Profile Photo]          ║
║                                  ║
║         James Khumalo            ║
║      Plumbing Specialist         ║
║      🏆 Top Rated Pro            ║
║                                  ║
║  ⭐ 4.9 (341 reviews) · 5 yrs   ║
║  ✓ Verified · ✓ Insured         ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      SELECT THIS PRO       │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── About ───                   ║
║  Experienced plumber specializing║
║  in residential repairs and      ║
║  installations. Available 7 days ║
║  a week with same-day service.   ║
║                                  ║
║  ─── Services ───                ║
║  • Leak Repairs                  ║
║  • Pipe Installation             ║
║  • Drain Cleaning                ║
║  • Emergency Services            ║
║                                  ║
║  ─── Performance ───             ║
║  🎯 98% Acceptance Rate          ║
║  ⚡ 2 min Avg Response            ║
║  ✅ 500+ Jobs Completed          ║
║                                  ║
║  ─── Reviews (341) ───           ║
║                                  ║
║  Sarah M. ⭐⭐⭐⭐⭐  2 days ago ║
║  "Fixed my leaking pipe quickly  ║
║  and professionally. Highly      ║
║  recommend!"                     ║
║  📷📷                            ║
║                                  ║
║  [View All Reviews]              ║
║                                  ║
║  ─── Portfolio ───               ║
║  📷📷📷📷📷📷                    ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 10: Price Estimate
```
╔══════════════════════════════════╗
║  [← Back]   Step 6 of 7     [×]  ║
║──────────────────────────────────║
║                                  ║
║  Price Estimate                  ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ Service: Plumbing          │ ║
║  │ Professional: James K.     │ ║
║  │ Date: Jan 24, 2:00 PM      │ ║
║  │ Location: 123 Main St      │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Price Breakdown ───         ║
║                                  ║
║  Base Rate (2 hrs est.)   R700   ║
║  Platform Fee             R126   ║
║  ─────────────────────────────   ║
║  Estimated Total          R826   ║
║                                  ║
║  💡 Final price may vary based   ║
║     on actual work completed     ║
║                                  ║
║  ─── Payment Method ───          ║
║                                  ║
║  ● Visa •••• 4242                ║
║  ○ Cash on completion            ║
║  [+ Add Payment Method]          ║
║                                  ║
║  ─── Booking Protection ───      ║
║  ✓ Verified professional         ║
║  ✓ Insured up to R10,000         ║
║  ✓ Free cancellation (24hrs)    ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      CONTINUE              │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 11: Review & Confirm Booking
```
╔══════════════════════════════════╗
║  [← Back]   Step 7 of 7     [×]  ║
║──────────────────────────────────║
║                                  ║
║  Review Your Booking             ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 🔧 Plumbing               │ ║
║  │                            │ ║
║  │ 📅 Friday, Jan 24, 2026    │ ║
║  │ ⏰ 2:00 PM - 4:00 PM       │ ║
║  │                            │ ║
║  │ 📍 123 Main St             │ ║
║  │    Cape Town, 8001         │ ║
║  │                            │ ║
║  │ 👤 James Khumalo ⭐4.9     │ ║
║  │    Plumbing Specialist     │ ║
║  │                            │ ║
║  │ 📝 "Leaking kitchen sink   │ ║
║  │     under the basin"       │ ║
║  │                            │ ║
║  │ 💳 Visa •••• 4242          │ ║
║  │ 💰 Estimated: R826         │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ☑ I agree to the Terms of      ║
║    Service and Cancellation     ║
║    Policy                        ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │   CONFIRM BOOKING          │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  🔒 Secure payment              ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 12: Booking Confirmation
```
╔══════════════════════════════════╗
║                              [×] ║
║──────────────────────────────────║
║                                  ║
║            ✅                    ║
║                                  ║
║      Booking Confirmed!          ║
║                                  ║
║  Booking Ref: HM-2026-001234     ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ James will arrive at       │ ║
║  │ 2:00 PM on Jan 24          │ ║
║  │                            │ ║
║  │ [Photo] James Khumalo      │ ║
║  │         ⭐ 4.9             │ ║
║  │         📞 Call            │ ║
║  │         💬 Message          │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  📧 Confirmation sent to email   ║
║  📱 SMS reminder 1 hour before   ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  📅 Add to Calendar        │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  📤 Share Booking          │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  VIEW BOOKING DETAILS      │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  BACK TO HOME              │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 13: My Bookings (List)
```
╔══════════════════════════════════╗
║ ☰  MY BOOKINGS            🔔 👤  ║
║──────────────────────────────────║
║                                  ║
║  [Upcoming] [Past] [Cancelled]   ║
║                                  ║
║  ─── Today ───                   ║
║                                  ║
║ ┌──────────────────────────────┐║
║ │ 🔧 Plumbing                  ││
║ │ 2:00 PM - 4:00 PM            ││
║ │                              ││
║ │ James K. ⭐4.9               ││
║ │ 123 Main St                  ││
║ │                              ││
║ │ Status: Confirmed            ││
║ │ Ref: HM-2026-001234          ││
║ │                              ││
║ │ [View Details] [Track]       ││
║ └──────────────────────────────┘║
║                                  ║
║  ─── Tomorrow ───                ║
║                                  ║
║ ┌──────────────────────────────┐║
║ │ 🎨 Painting                  ││
║ │ 10:00 AM - 1:00 PM           ││
║ │                              ││
║ │ Sarah L. ⭐4.8               ││
║ │ 456 Office Rd                ││
║ │                              ││
║ │ Status: Confirmed            ││
║ │ Ref: HM-2026-001235          ││
║ │                              ││
║ │ [View Details] [Reschedule]  ││
║ └──────────────────────────────┘║
║                                  ║
║  ─── Next Week ───               ║
║                                  ║
║ ┌──────────────────────────────┐║
║ │ 🧹 Cleaning                  ││
║ │ Jan 30, 9:00 AM              ││
║ │ David M. ⭐4.7               ││
║ └──────────────────────────────┘║
║                                  ║
║──────────────────────────────────║
║  🏠 Home  📅 Bookings  💬 Chat   ║
╚══════════════════════════════════╝
```

### Screen 14: Booking Details (Upcoming)
```
╔══════════════════════════════════╗
║  [← Back]                   [⋮]  ║
║──────────────────────────────────║
║                                  ║
║  Booking Details                 ║
║  Ref: HM-2026-001234             ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ Status: Confirmed ✅       │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Service ───                 ║
║  🔧 Plumbing                     ║
║  Leaking kitchen sink            ║
║                                  ║
║  ─── Schedule ───                ║
║  📅 Friday, January 24, 2026     ║
║  ⏰ 2:00 PM - 4:00 PM            ║
║                                  ║
║  ─── Location ───                ║
║  📍 123 Main St                  ║
║      Cape Town, 8001             ║
║  [Get Directions]                ║
║                                  ║
║  ─── Professional ───            ║
║  ┌────────────────────────────┐ ║
║  │ [Photo] James Khumalo      │ ║
║  │         ⭐ 4.9 (341)       │ ║
║  │         Plumbing Specialist│ ║
║  │                            │ ║
║  │ [📞 Call] [💬 Message]     │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Payment ───                 ║
║  Estimated: R826                 ║
║  Payment Method: Visa •••• 4242  ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │    RESCHEDULE BOOKING      │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │    CANCEL BOOKING          │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 15: Track Professional (Live)
```
╔══════════════════════════════════╗
║  [← Back]   TRACKING        [×]  ║
║──────────────────────────────────║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │         [MAP VIEW]         │ ║
║  │                            │ ║
║  │    📍 Your Location        │ ║
║  │                            │ ║
║  │         ↓ ↓ ↓              │ ║
║  │                            │ ║
║  │    🚗 James                │ ║
║  │       (5 km away)          │ ║
║  │                            │ ║
║  │    [Route displayed]       │ ║
║  │                            │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ [Photo] James is on the way│ ║
║  │                            │ ║
║  │ ⏱️  Estimated arrival:     │ ║
║  │     15 minutes             │ ║
║  │                            │ ║
║  │ 📱 [Call James]            │ ║
║  │ 💬 [Send Message]          │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  📍 Destination:                 ║
║     123 Main St, Cape Town       ║
║                                  ║
║  💡 Tip: Make sure someone is    ║
║     available to let James in    ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 16: Job In Progress
```
╔══════════════════════════════════╗
║  [← Back]                        ║
║──────────────────────────────────║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │   Job In Progress 🔨       │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  Booking Ref: HM-2026-001234     ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ [Photo] James Khumalo      │ ║
║  │         is working on      │ ║
║  │         your plumbing      │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  Started at: 2:05 PM             ║
║  Duration: 1 hr 23 min           ║
║                                  ║
║  ─── Status ───                  ║
║  🔧 Fixing kitchen sink leak     ║
║                                  ║
║  ─── Actions ───                 ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  💬 Message James          │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  📞 Call James             │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  ⚠️ Report an Issue        │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  💡 You'll be notified when      ║
║     the job is complete          ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 17: Rate & Review
```
╔══════════════════════════════════╗
║  [← Back]                   [×]  ║
║──────────────────────────────────║
║                                  ║
║  Rate Your Experience            ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ [Photo] James Khumalo      │ ║
║  │         Plumbing Service   │ ║
║  │         Jan 24, 2026       │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  Overall Rating                  ║
║  ⭐ ⭐ ⭐ ⭐ ⭐                   ║
║                                  ║
║  ─── Detailed Ratings ───        ║
║                                  ║
║  Punctuality                     ║
║  ⭐ ⭐ ⭐ ⭐ ⭐                   ║
║                                  ║
║  Quality of Work                 ║
║  ⭐ ⭐ ⭐ ⭐ ⭐                   ║
║                                  ║
║  Professionalism                 ║
║  ⭐ ⭐ ⭐ ⭐ ⭐                   ║
║                                  ║
║  Value for Money                 ║
║  ⭐ ⭐ ⭐ ⭐ ⭐                   ║
║                                  ║
║  ─── Written Review (Optional)───║
║  ┌────────────────────────────┐ ║
║  │ Tell others about your     │ ║
║  │ experience...              │ ║
║  │                            │ ║
║  │                            │ ║
║  └────────────────────────────┘ ║
║                        0/500     ║
║                                  ║
║  [📷 Add Photos]                 ║
║                                  ║
║  ☑ I would recommend James       ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │   SUBMIT REVIEW            │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 18: Tip Professional
```
╔══════════════════════════════════╗
║  [← Back]                   [×]  ║
║──────────────────────────────────║
║                                  ║
║  Tip Your Professional           ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ [Photo] James Khumalo      │ ║
║  │         did a great job!   │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  Show your appreciation with     ║
║  a tip (optional)                ║
║                                  ║
║  Job Total: R850                 ║
║                                  ║
║  ─── Select Tip Amount ───       ║
║                                  ║
║  ┌──────┐ ┌──────┐ ┌──────┐    ║
║  │ 10%  │ │ 15%  │ │ 20%  │    ║
║  │ R85  │ │R128  │ │R170  │    ║
║  └──────┘ └──────┘ └──────┘    ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  Custom Amount             │ ║
║  │  R [_______]               │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  💡 James receives 100% of tip   ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │   CONFIRM TIP              │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │   SKIP, NO TIP             │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 19: Messages/Chat
```
╔══════════════════════════════════╗
║  [← Back]  James K.         [⋮]  ║
║──────────────────────────────────║
║                                  ║
║  📅 Booking: Jan 24, 2:00 PM     ║
║      Ref: HM-2026-001234         ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ Hi! I'll be there at 2 PM  │ ║
║  │                       1:30 PM││
║  └────────────────────────────┘ ║
║                                  ║
║              ┌──────────────────┐║
║              │ Great, see you   ║║
║              │ then!       1:31 PM│
║              └──────────────────┘║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ I'm on my way 🚗           │ ║
║  │                       1:45 PM││
║  └────────────────────────────┘ ║
║                                  ║
║              ┌──────────────────┐║
║              │ Perfect!    1:46 PM│
║              └──────────────────┘║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ I've arrived. Job looks    │ ║
║  │ straightforward, should    │ ║
║  │ take about 2 hours.  2:05 PM││
║  └────────────────────────────┘ ║
║                                  ║
║              ┌──────────────────┐║
║              │ Thank you! 2:06 PM│
║              └──────────────────┘║
║                                  ║
║                                  ║
║                                  ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ Type a message...      📎  │ ║
║  └────────────────────────────┘ ║
║                            [Send]║
╚══════════════════════════════════╝
```

### Screen 20: Client Profile/Settings
```
╔══════════════════════════════════╗
║  [← Back]     PROFILE            ║
║──────────────────────────────────║
║                                  ║
║         [Profile Photo]          ║
║                                  ║
║         John Smith               ║
║         john@email.com           ║
║         +27 123 456 789          ║
║                                  ║
║  [Edit Profile]                  ║
║                                  ║
║  ─── Account ───                 ║
║  📍 My Addresses (3)             ║
║  💳 Payment Methods (2)          ║
║  🎫 Promo Codes                  ║
║  🎁 Referral Code: JOHN123       ║
║                                  ║
║  ─── Activity ───                ║
║  📊 Booking History              ║
║  💰 Payment History              ║
║  ⭐ My Reviews (12)              ║
║                                  ║
║  ─── Settings ───                ║
║  🔔 Notifications                ║
║  🌍 Language: English            ║
║  🎨 Theme: System Default        ║
║                                  ║
║  ─── Support ───                 ║
║  ❓ Help Center                  ║
║  📞 Contact Support              ║
║  ℹ️  About                       ║
║  📄 Terms & Privacy              ║
║                                  ║
║  ─── Account Actions ───         ║
║  🔓 Change Password              ║
║  🚪 Logout                       ║
║  ❌ Delete Account               ║
║                                  ║
║  Version 1.0.0                   ║
║                                  ║
╚══════════════════════════════════╝
```

---

## Professional App Wireframes

### Screen 21: Professional Home/Dashboard
```
╔══════════════════════════════════╗
║ ☰  THE HANDY MAN          🔔 👤  ║
║──────────────────────────────────║
║                                  ║
║  Hello, James! 👋                ║
║                                  ║
║  [●Available] [○Unavailable]    ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ TODAY'S EARNINGS           │ ║
║  │ R1,250                     │ ║
║  │ 3 jobs completed           │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ ⭐ 4.9  Rating             │ ║
║  │ 🏆 341 Reviews             │ ║
║  │ ✅ 500+ Jobs               │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Today's Schedule ───        ║
║                                  ║
║ ┌──────────────────────────────┐║
║ │ 2:00 PM Plumbing            ││
║ │ John S. • 123 Main St       ││
║ │ Est. R850 • 5 km away       ││
║ │ [Start Job] [Navigate]      ││
║ └──────────────────────────────┘║
║                                  ║
║ ┌──────────────────────────────┐║
║ │ 5:00 PM Plumbing            ││
║ │ Mary T. • 789 Oak Ave       ││
║ │ Est. R600 • 3 km away       ││
║ │ [View Details]              ││
║ └──────────────────────────────┘║
║                                  ║
║  ─── Quick Actions ───           ║
║  [📅 View Schedule] [💰 Earnings]║
║                                  ║
║──────────────────────────────────║
║ 🏠Home 📋Jobs 💬Chat 👤Profile   ║
╚══════════════════════════════════╝
```

### Screen 22: New Job Request (Notification)
```
╔══════════════════════════════════╗
║                              [×] ║
║──────────────────────────────────║
║                                  ║
║  🔔 New Job Request!             ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 🔧 PLUMBING                │ ║
║  │                            │ ║
║  │ 📅 Today, Jan 24           │ ║
║  │ ⏰ 2:00 PM - 4:00 PM       │ ║
║  │                            │ ║
║  │ 📍 123 Main St, Cape Town  │ ║
║  │    📏 2.3 km away          │ ║
║  │                            │ ║
║  │ 👤 John Smith ⭐4.7        │ ║
║  │                            │ ║
║  │ 📝 "Leaking kitchen sink   │ ║
║  │     under the basin"       │ ║
║  │                            │ ║
║  │ 💰 Estimated Earning       │ ║
║  │    R595 (after fees)       │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ⏱️  Respond within 15 minutes   ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      ACCEPT JOB            │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      DECLINE               │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  [View Full Details]             ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 23: Job Details (Professional View)
```
╔══════════════════════════════════╗
║  [← Back]                   [⋮]  ║
║──────────────────────────────────║
║                                  ║
║  Job Request Details             ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 🔧 Plumbing                │ ║
║  │ Ref: HM-2026-001234        │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Schedule ───                ║
║  📅 Friday, January 24, 2026     ║
║  ⏰ 2:00 PM - 4:00 PM (2 hrs)    ║
║                                  ║
║  ─── Location ───                ║
║  📍 123 Main St                  ║
║      Cape Town, 8001             ║
║  📏 2.3 km from you              ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      [MAP VIEW]            │ ║
║  │                            │ ║
║  │  📍 Customer Location      │ ║
║  │  🚗 Your Location          │ ║
║  │                            │ ║
║  │  [Route shown on map]      │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  [Get Directions]                ║
║                                  ║
║  ─── Customer ───                ║
║  👤 John Smith                   ║
║  ⭐ 4.7 rating (23 bookings)     ║
║  📞 [View Number]                ║
║                                  ║
║  ─── Job Description ───         ║
║  "Leaking kitchen sink under     ║
║   the basin. Noticed water       ║
║   pooling yesterday."            ║
║                                  ║
║  📷 [Customer Photo]             ║
║                                  ║
║  ─── Earnings ───                ║
║  Estimated Total:    R826        ║
║  Platform Fee (28%): -R231       ║
║  Your Earnings:      R595        ║
║                                  ║
║  ⏱️  Respond within 12 minutes   ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      ACCEPT JOB            │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      DECLINE               │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 24: My Schedule (Professional)
```
╔══════════════════════════════════╗
║  [← Back]   MY SCHEDULE     [+]  ║
║──────────────────────────────────║
║                                  ║
║  [Day] [Week] [Month]            ║
║                                  ║
║  Friday, January 24, 2026        ║
║  [< Prev]              [Next >]  ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 8:00 AM                    │ ║
║  │ Available                  │ ║
║  │                            │ ║
║  │ 10:00 AM                   │ ║
║  │ 🎨 Painting                │ ║
║  │ Sarah L. • 456 Oak St      │ ║
║  │ R900 • [View]              │ ║
║  │                            │ ║
║  │ 2:00 PM                    │ ║
║  │ 🔧 Plumbing                │ ║
║  │ John S. • 123 Main St      │ ║
║  │ R850 • [Start Job]         │ ║
║  │                            │ ║
║  │ 5:00 PM                    │ ║
║  │ 🔧 Plumbing                │ ║
║  │ Mary T. • 789 Oak Ave      │ ║
║  │ R600 • [View]              │ ║
║  │                            │ ║
║  │ 7:00 PM                    │ ║
║  │ Available                  │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Summary ───                 ║
║  💰 Today's Potential: R2,350    ║
║  📋 3 Jobs Scheduled             ║
║  ⏱️  7 hours booked              ║
║                                  ║
║  [Block Time Off]                ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 25: Start Job (Professional)
```
╔══════════════════════════════════╗
║  [← Back]                   [⋮]  ║
║──────────────────────────────────║
║                                  ║
║  Start Job                       ║
║  Ref: HM-2026-001234             ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 🔧 Plumbing                │ ║
║  │ John Smith                 │ ║
║  │ 123 Main St, Cape Town     │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ✅ GPS Verified                 ║
║  You're at the job location      ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      [MAP VIEW]            │ ║
║  │                            │ ║
║  │  You are here: ●           │ ║
║  │  Job location: 📍          │ ║
║  │                            │ ║
║  │  Distance: 12m             │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  Scheduled: 2:00 PM - 4:00 PM    ║
║  Current time: 2:05 PM           ║
║                                  ║
║  💡 Starting the job will:       ║
║  • Notify the customer           ║
║  • Start time tracking           ║
║  • Update job status             ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │      START JOB NOW         │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  📞 Call Customer           │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  💬 Message Customer        │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 26: Job In Progress (Professional)
```
╔══════════════════════════════════╗
║  [← Back]  JOB IN PROGRESS  [⋮]  ║
║──────────────────────────────────║
║                                  ║
║  ⏱️  Duration: 1 hr 23 min       ║
║  Started: 2:05 PM                ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ 🔧 Plumbing                │ ║
║  │ John Smith                 │ ║
║  │ 123 Main St                │ ║
║  │ Ref: HM-2026-001234        │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Job Notes ───               ║
║  ┌────────────────────────────┐ ║
║  │ Add notes about the work   │ ║
║  │ being done...              │ ║
║  │                            │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Photos ───                  ║
║  ┌──────┐ ┌──────┐ ┌──────┐    ║
║  │Before│ │During│ │ [+]  │    ║
║  │  📷  │ │  📷  │ │ Add  │    ║
║  └──────┘ └──────┘ └──────┘    ║
║                                  ║
║  ─── Contact ───                 ║
║  ┌────────────────────────────┐ ║
║  │  📞 Call Customer           │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  💬 Message Customer        │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  ⏸️  PAUSE JOB              │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  ✅ COMPLETE JOB            │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 27: Complete Job (Professional)
```
╔══════════════════════════════════╗
║  [← Back]   COMPLETE JOB    [×]  ║
║──────────────────────────────────║
║                                  ║
║  Job Summary                     ║
║  Ref: HM-2026-001234             ║
║                                  ║
║  ⏱️  Duration: 2 hr 15 min       ║
║  Started: 2:05 PM                ║
║  Completed: 4:20 PM              ║
║                                  ║
║  ─── Work Summary ───            ║
║  ┌────────────────────────────┐ ║
║  │ Describe work completed... │ ║
║  │                            │ ║
║  │ "Fixed leaking pipe under  │ ║
║  │ kitchen sink. Replaced     │ ║
║  │ worn gasket and tightened  │ ║
║  │ connections."              │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Final Price ───             ║
║  Estimated Price:  R826          ║
║                                  ║
║  Adjust final price?             ║
║  ● Keep estimate (R826)          ║
║  ○ Adjust price  [R______]       ║
║                                  ║
║  Reason for adjustment:          ║
║  ┌────────────────────────────┐ ║
║  │ (Required if price changes)│ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Photos ───                  ║
║  ┌──────┐ ┌──────┐ ┌──────┐    ║
║  │Before│ │After │ │After │    ║
║  │  📷  │ │  📷  │ │  📷  │    ║
║  └──────┘ └──────┘ └──────┘    ║
║                                  ║
║  ☑ Add photos to my portfolio    ║
║                                  ║
║  ─── Your Earnings ───           ║
║  Final Price:        R826        ║
║  Platform Fee (28%): -R231       ║
║  Your Earnings:      R595        ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │   SUBMIT FOR APPROVAL      │ ║
║  └────────────────────────────┘ ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 28: Earnings Dashboard
```
╔══════════════════════════════════╗
║  [← Back]     EARNINGS           ║
║──────────────────────────────────║
║                                  ║
║  [Today] [Week] [Month] [All]    ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ AVAILABLE BALANCE          │ ║
║  │ R 4,275.50                 │ ║
║  │                            │ ║
║  │ [Withdraw Funds]           │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ THIS WEEK                  │ ║
║  │                            │ ║
║  │ Total Earned:    R 5,420   │ ║
║  │ Jobs Completed:  12        │ ║
║  │ Tips Received:   R 450     │ ║
║  │ Avg per Job:     R 451     │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │  [EARNINGS GRAPH]          │ ║
║  │                            │ ║
║  │  Mon  Tue  Wed Thu Fri Sat │ ║
║  │   ▂    ▄    ▆   ▃   █   ▅  │ ║
║  │                            │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Recent Payments ───         ║
║                                  ║
║  Jan 24 • Plumbing      +R595    ║
║  John S. • HM-2026-001234        ║
║                                  ║
║  Jan 24 • Painting      +R780    ║
║  Sarah L. • HM-2026-001233       ║
║  💰 Tip: R50                     ║
║                                  ║
║  Jan 23 • Carpentry     +R920    ║
║  David M. • HM-2026-001232       ║
║                                  ║
║  [View All Transactions]         ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 29: Withdraw Funds
```
╔══════════════════════════════════╗
║  [← Back]  WITHDRAW FUNDS   [×]  ║
║──────────────────────────────────║
║                                  ║
║  Available Balance               ║
║  R 4,275.50                      ║
║                                  ║
║  ─── Withdrawal Amount ───       ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │ R [___________]            │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  Quick amounts:                  ║
║  [R500] [R1000] [R2000] [All]   ║
║                                  ║
║  Minimum withdrawal: R500        ║
║  Maximum withdrawal: R4,275.50   ║
║                                  ║
║  ─── Bank Account ───            ║
║                                  ║
║  ● First National Bank           ║
║    Account: ••••1234             ║
║    James Khumalo                 ║
║    [Change]                      ║
║                                  ║
║  ─── Processing ───              ║
║                                  ║
║  Processing Fee:  R 25           ║
║  You will receive: R [____]      ║
║                                  ║
║  💡 Funds typically arrive in    ║
║     1-3 business days            ║
║                                  ║
║  ┌────────────────────────────┐ ║
║  │   REQUEST WITHDRAWAL       │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Recent Withdrawals ───      ║
║                                  ║
║  Jan 20 • R2,000 • Completed     ║
║  Jan 13 • R1,500 • Completed     ║
║                                  ║
╚══════════════════════════════════╝
```

### Screen 30: Professional Profile
```
╔══════════════════════════════════╗
║  [← Back]     PROFILE       [⋮]  ║
║──────────────────────────────────║
║                                  ║
║         [Profile Photo]          ║
║                                  ║
║         James Khumalo            ║
║      Plumbing Specialist         ║
║                                  ║
║  [Edit Profile]                  ║
║                                  ║
║  ─── Performance ───             ║
║  ┌────────────────────────────┐ ║
║  │ ⭐ 4.9        Rating        │ ║
║  │ 🏆 341       Reviews        │ ║
║  │ ✅ 500+      Jobs Done      │ ║
║  │ ⚡ 2 min     Response Time  │ ║
║  │ 🎯 98%       Accept Rate    │ ║
║  └────────────────────────────┘ ║
║                                  ║
║  ─── Badges ───                  ║
║  🏆 Top Rated Pro                ║
║  ⚡ Fast Responder               ║
║  ✓ Verified Professional         ║
║                                  ║
║  ─── Services ───                ║
║  🔧 Plumbing (Primary)           ║
║  ⚡ Electrical                   ║
║  🔨 General Repairs              ║
║  [Edit Services]                 ║
║                                  ║
║  ─── Availability ───            ║
║  Status: ● Available             ║
║  Service Radius: 20 km           ║
║  [Edit Availability]             ║
║                                  ║
║  ─── Account ───                 ║
║  💰 Earnings: R45,230 (All time) ║
║  💳 Bank Details                 ║
║  📄 Documents & Certifications   ║
║                                  ║
║  ─── Settings ───                ║
║  🔔 Notification Preferences     ║
║  🌍 Service Areas                ║
║  💵 Pricing                      ║
║                                  ║
║  ─── Support ───                 ║
║  ❓ Help Center                  ║
║  📞 Contact Support              ║
║  📊 My Statistics                ║
║                                  ║
║  🚪 Logout                       ║
║                                  ║
╚══════════════════════════════════╝
```

---

## Admin Dashboard Wireframes

### Screen 31: Admin Dashboard Home
```
╔════════════════════════════════════════════════════════════════╗
║  THE HANDY MAN - Admin Dashboard               🔔 Admin User ▼ ║
║────────────────────────────────────────────────────────────────║
║                                                                ║
║  [Dashboard] [Users] [Professionals] [Bookings] [Payments]    ║
║  [Reports] [Settings]                                          ║
║                                                                ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          ║
║  │ Total Users  │ │ Active Pros  │ │ Bookings     │          ║
║  │  12,450      │ │    856       │ │  Today: 234  │          ║
║  │  +12% ↑      │ │    +8% ↑     │ │  +15% ↑      │          ║
║  └──────────────┘ └──────────────┘ └──────────────┘          ║
║                                                                ║
║  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          ║
║  │ Revenue      │ │ Avg Rating   │ │ Response Time│          ║
║  │  R456,780    │ │    4.8 ⭐    │ │  3.2 min     │          ║
║  │  +18% ↑      │ │    +0.2 ↑    │ │  -0.5 ↓      │          ║
║  └──────────────┘ └──────────────┘ └──────────────┘          ║
║                                                                ║
║  ─────────────────────────────────────────────────────────    ║
║                                                                ║
║  Revenue Trend (Last 30 Days)                                  ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │                                                        │   ║
║  │  [LINE GRAPH showing revenue trend]                   │   ║
║  │                                                        │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  ─────────────────────────────────────────────────────────    ║
║                                                                ║
║  Recent Activity                      Pending Actions          ║
║  ┌──────────────────────────────┐   ┌──────────────────────┐ ║
║  │ • New booking HM-001234      │   │ • 12 Pro Applications│ ║
║  │ • Professional verified      │   │ • 5 Disputes Open    │ ║
║  │ • Payment completed R850     │   │ • 3 Withdrawals      │ ║
║  │ • Review posted (5★)         │   │ • 8 Reports          │ ║
║  │ • Booking cancelled          │   │                      │ ║
║  └──────────────────────────────┘   └──────────────────────┘ ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### Screen 32: Professional Applications
```
╔════════════════════════════════════════════════════════════════╗
║  THE HANDY MAN - Professional Applications     🔔 Admin User ▼ ║
║────────────────────────────────────────────────────────────────║
║                                                                ║
║  [Pending: 12] [Under Review: 5] [Approved: 234] [Rejected: 8]║
║                                                                ║
║  Search: [_________________________] [Filter ▼] [Export]       ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ James Khumalo                     Status: Pending      │   ║
║  │ james.k@email.com | +27 123 456 789                    │   ║
║  │                                                         │   ║
║  │ Applied: Jan 22, 2026 | Services: Plumbing, Electrical│   ║
║  │ Experience: 5 years                                    │   ║
║  │                                                         │   ║
║  │ ✓ ID Verified    ✓ References (2)    ⏳ Background Check│   ║
║  │                                                         │   ║
║  │ [View Details] [Approve] [Reject]                      │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐   ║
║  │ Sarah Ndlovu                      Status: Under Review │   ║
║  │ sarah.n@email.com | +27 987 654 321                    │   ║
║  │                                                         │   ║
║  │ Applied: Jan 21, 2026 | Services: Painting, Decorating│   ║
║  │ Experience: 3 years                                    │   ║
║  │                                                         │   ║
║  │ ✓ ID Verified    ⏳ References (2)   ⏳ Background Check│   ║
║  │                                                         │   ║
║  │ [View Details] [Approve] [Reject]                      │   ║
║  └────────────────────────────────────────────────────────┘   ║
║                                                                ║
║  [< Previous] Page 1 of 3 [Next >]                             ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Design System

### Color Palette

```
Primary Colors:
- Brand Blue:     #2563EB (Buttons, Links, Active states)
- Brand Dark:     #1E40AF (Headers, Important text)
- Brand Light:    #DBEAFE (Backgrounds, Highlights)

Secondary Colors:
- Success Green:  #10B981 (Completed, Available)
- Warning Orange: #F59E0B (Pending, Caution)
- Error Red:      #EF4444 (Cancelled, Errors)
- Info Blue:      #3B82F6 (Notifications, Info)

Neutral Colors:
- Black:          #111827 (Primary text)
- Dark Gray:      #4B5563 (Secondary text)
- Medium Gray:    #9CA3AF (Disabled text, Borders)
- Light Gray:     #F3F4F6 (Backgrounds)
- White:          #FFFFFF (Cards, Backgrounds)
```

### Typography

```
Font Family: Inter, SF Pro Display, -apple-system, sans-serif

Headings:
- H1: 32px, Bold (Page titles)
- H2: 24px, Semibold (Section headers)
- H3: 20px, Semibold (Card titles)
- H4: 18px, Medium (Subsections)

Body:
- Large: 16px, Regular (Primary text)
- Regular: 14px, Regular (Secondary text)
- Small: 12px, Regular (Captions, Labels)

Button Text: 16px, Semibold
```

### Spacing

```
Base Unit: 4px

Scale:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
```

### Components

#### Buttons
```
Primary Button:
- Background: Brand Blue
- Text: White
- Height: 48px (mobile), 44px (desktop)
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)

Secondary Button:
- Background: White
- Text: Brand Blue
- Border: 1px solid Brand Blue
- Height: 48px (mobile), 44px (desktop)
- Border Radius: 8px

Text Button:
- Background: Transparent
- Text: Brand Blue
- No border
- Underline on hover
```

#### Input Fields
```
- Height: 48px
- Border: 1px solid Medium Gray
- Border Radius: 8px
- Padding: 12px 16px
- Focus: Border changes to Brand Blue
- Font Size: 16px (prevents zoom on iOS)
```

#### Cards
```
- Background: White
- Border Radius: 12px
- Shadow: 0 4px 6px rgba(0,0,0,0.1)
- Padding: 16px
```

#### Navigation Bar (Bottom)
```
- Height: 60px
- Background: White
- Shadow: 0 -2px 4px rgba(0,0,0,0.1)
- Icons: 24px x 24px
- Active indicator: Brand Blue
```

### Icons

```
Icon Library: Heroicons / Lucide Icons
Size: 20px (inline), 24px (standalone), 32px (large)

Service Category Icons:
🔧 Plumbing
🎨 Painting
🪚 Carpentry
🧱 Tiling
⚡ Electrical
🧹 Cleaning
🔨 General Repairs
```

### Animations

```
Transitions:
- Default: 200ms ease-in-out
- Quick: 150ms ease-out
- Slow: 300ms ease-in-out

Loading States:
- Skeleton screens for content
- Spinner for actions
- Progress bars for multi-step flows

Micro-interactions:
- Button press: Scale down to 0.98
- Card hover: Subtle lift with shadow
- Success: Check mark animation
```

---

## Mobile-First Design Principles

1. **Touch Targets**: Minimum 44px x 44px
2. **Single Column Layout**: Stack elements vertically
3. **Progressive Disclosure**: Show essential info first
4. **Thumb Zone**: Important actions within easy reach
5. **Readable Font Sizes**: Minimum 16px for body text
6. **Clear Visual Hierarchy**: Use size, weight, color
7. **Minimal Text Input**: Use selectors and dropdowns
8. **Offline Support**: Cache critical data
9. **Fast Loading**: Optimize images, lazy load
10. **Native Gestures**: Swipe, pull-to-refresh

---

## Accessibility

- **WCAG 2.1 AA Compliance**
- **Color Contrast**: Minimum 4.5:1 for text
- **Screen Reader Support**: Proper ARIA labels
- **Keyboard Navigation**: Full keyboard access
- **Focus Indicators**: Clear visible focus states
- **Alt Text**: All images have descriptive alt text
- **Error Messages**: Clear, actionable messages
- **Font Sizing**: Respect user preferences

---

## Next Steps

1. Review wireframes with stakeholders
2. Create high-fidelity mockups
3. Build interactive prototype
4. Conduct user testing
5. Refine based on feedback
6. Begin frontend development

