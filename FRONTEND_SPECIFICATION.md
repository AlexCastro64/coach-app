# Frontend Specification - AI Fitness Coach Platform

**Version:** 1.0  
**Last Updated:** October 23, 2025  
**Backend:** Laravel 11 + Livewire 3  
**Target Frontend:** React Native / Flutter / React Web

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication Flow](#authentication-flow)
3. [Onboarding Flow](#onboarding-flow)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Screen Specifications](#screen-specifications)
7. [Features & Functionality](#features--functionality)
8. [UI/UX Guidelines](#uiux-guidelines)
9. [Technical Requirements](#technical-requirements)

---

## 🎯 Overview

### Product Description
AI-powered fitness coaching platform with **financial accountability**. Users deposit money upfront ($89/month subscription) and work with an AI coach through conversational chat. The system tracks workouts, meals, and daily check-ins, with automated deductions for non-compliance.

### Core Value Proposition
- **Real Financial Stakes** - Money on the line for accountability
- **AI-Powered Coaching** - Personalized plans + GPT-4 Vision meal analysis
- **Conversational Interface** - Chat-first experience, no forms
- **Automatic Tracking** - Strava integration for seamless workout logging
- **Daily Accountability** - Check-ins, streaks, and compliance tracking

### Tech Stack (Backend)
- Laravel 11 (PHP 8.3)
- PostgreSQL 15
- Redis (caching)
- OpenAI GPT-4o & GPT-4 Vision
- Stripe (payments)
- Strava API (OAuth)

---

## 🔐 Authentication Flow

### Registration
**Endpoint:** `POST /api/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "onboarding_completed": false
  },
  "token": "1|abc123..."
}
```

### Login
**Endpoint:** `POST /api/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "onboarding_completed": true,
    "role": "member"
  },
  "token": "2|xyz789..."
}
```

### Token Storage
- Store token securely (Keychain/Keystore)
- Include in all authenticated requests: `Authorization: Bearer {token}`
- Handle 401 responses (token expired/invalid)

---

## 🚀 Onboarding Flow

### Overview
**Two-phase onboarding:**
1. **Sales Questions (Steps 0-7)** - Motivation & commitment questions
2. **Payment (Step 8)** - Stripe checkout ($89/month)
3. **Conversational Profile (Chat)** - AI coach asks 7 questions via chat

### Phase 1: Sales Questions (Web-based)

Users complete these on the web before payment. **Frontend should redirect to web onboarding URL** if `onboarding_completed` is false.

**Steps:**
- Step 0: Main goal (tangible_goal)
- Step 1: Biggest challenge (current_struggle)
- Step 2: How long trying (how_long_trying)
- Step 3: Commitment level (dream_outcome_6months)
- Step 4: Motivation (what_shifted)
- Step 5: Desired feeling (success_feeling)
- Step 6: When to start (failure_feeling)
- Step 7: Ready to commit (willing_to_change, why_now_reason)
- Step 8: Payment redirect to Stripe

### Phase 2: Payment
- Stripe checkout session
- $89/month subscription
- After payment success → redirect to app inbox

### Phase 3: Conversational Profile (Mobile App)

After payment, users land in the **Inbox** where the AI coach asks 7 questions:

1. **Basic Info** - Name, location, timezone
2. **Physical Profile** - Age, height, weight, sex, injuries
3. **Goals** - Fitness goals (fat loss, muscle gain, etc.) + primary goal
4. **Equipment & Schedule** - Available equipment, workout days
5. **Current Routine** - Wake/sleep times, current habits, barriers
6. **Activity Preferences** - Preferred activities (running, gym, yoga, etc.)
7. **Schedule Preferences** - Morning/evening, location preferences

**User responds naturally in chat** - AI extracts structured data.

After all questions → AI generates 8-week action plan → Normal coaching begins

---

## 🔌 API Endpoints

### Base URL
```
https://api.yourapp.com/api
```

### Authentication

#### Register
`POST /register`
- Body: `{ name, email, password, password_confirmation }`
- Returns: `{ user, token }`

#### Login
`POST /login`
- Body: `{ email, password }`
- Returns: `{ user, token }`

#### Logout
`POST /logout` 🔒
- Headers: `Authorization: Bearer {token}`
- Returns: `{ message }`

#### Get Current User
`GET /me` 🔒
- Returns: Full user profile with wallet, streak, profile data

### Dashboard

#### Get Dashboard
`GET /dashboard` 🔒
- Returns: Comprehensive dashboard data
  - User info
  - Wallet balance
  - Current streak
  - Active plan
  - This week's workouts
  - Today's check-in status
  - Notifications
  - Recent deductions

### Workouts

#### Get Workouts
`GET /workouts?page=1` 🔒
- Returns: Paginated workout list

#### Get Upcoming Workouts
`GET /workouts/upcoming` 🔒
- Returns: Next 7 upcoming workouts

#### Complete Workout
`POST /workouts/{id}/complete` 🔒
- Body (multipart/form-data):
  - `duration_minutes`: integer
  - `distance_meters`: integer (optional)
  - `rpe`: integer (1-10)
  - `notes`: string (optional)
  - `evidence_photo`: file (optional)
- Returns: Updated workout + verification status

### Meals

#### Get Meals
`GET /meals?page=1` 🔒
- Returns: Paginated meal list with AI analysis

#### Log Meal
`POST /meals` 🔒
- Body (multipart/form-data):
  - `photo`: file (required)
  - `notes`: string (optional)
- Returns: Meal with GPT-4 Vision analysis
  - Food items
  - Estimated calories, protein, carbs, fats
  - Quality score
  - Feedback & suggestions

#### Get Today's Nutrition Totals
`GET /meals/today-totals` 🔒
- Returns: Aggregated nutrition for today

### Check-ins

#### Get Check-ins
`GET /checkins?page=1` 🔒
- Returns: Paginated check-in history

#### Submit Check-in
`POST /checkins` 🔒
- Body (multipart/form-data):
  - `weight_kg`: float
  - `front_photo`: file
  - `side_photo`: file
  - `back_photo`: file
  - `meals_compliant`: boolean
  - `workouts_compliant`: boolean
  - `water_compliant`: boolean
  - `sleep_hours`: float
  - `energy_level`: integer (1-10)
  - `notes`: string (optional)
- Returns: Check-in + compliance score + deduction (if any) + updated streak

### Messages (Chat)

**Note:** Messages API is not currently exposed. Chat functionality is web-based (Livewire). For mobile, you have two options:

1. **WebView** - Embed web chat interface
2. **Build Native Chat** - Request backend team to add Messages API endpoints

---

## 📊 Data Models

### User
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'member' | 'admin';
  timezone: string;
  country: string;
  onboarding_completed: boolean;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
}
```

### Profile
```typescript
interface Profile {
  id: number;
  user_id: number;
  date_of_birth: string;
  height_cm: number;
  weight_kg: number;
  sex_at_birth: 'male' | 'female';
  injuries: string[];
  goal: GoalType[];
  primary_goal: GoalType;
  equipment: EquipmentType[];
  schedule: DayOfWeek[];
  diet_preferences: string[];
  budget_level: 'low' | 'medium' | 'high';
  onboarding_data: OnboardingData;
  action_plan: ActionPlan;
  current_habits: CurrentHabits;
}

type GoalType = 'fat_loss' | 'muscle_gain' | 'endurance' | 'general_health' | 'strength' | 'flexibility' | 'sport_specific';
type EquipmentType = 'none' | 'dumbbells' | 'gym' | 'resistance_bands' | 'kettlebells';
type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
```

### Wallet
```typescript
interface Wallet {
  id: number;
  user_id: number;
  balance: number; // in dollars
  currency: 'AUD';
  locked_amount: number;
}
```

### Streak
```typescript
interface Streak {
  current: number;
  longest: number;
}
```

### Workout
```typescript
interface Workout {
  id: number;
  user_id: number;
  plan_id: number;
  scheduled_date: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'rest' | 'sport';
  intensity: 'low' | 'medium' | 'high';
  description: string;
  estimated_duration_minutes: number;
  verification_status: 'pending' | 'verified' | 'failed';
  source: 'manual' | 'strava' | 'system';
  completed_at: string | null;
  logged_duration_minutes: number | null;
  logged_distance_meters: number | null;
  rpe: number | null; // 1-10
  tss: number | null; // Training Stress Score
  notes: string | null;
  evidence_url: string | null;
}
```

### Meal
```typescript
interface Meal {
  id: number;
  user_id: number;
  captured_at: string;
  image_url: string;
  analysis_status: 'pending' | 'completed' | 'failed';
  ai_summary: {
    food_items: string[];
    description: string;
    estimated_calories: number;
    estimated_protein_g: number;
    estimated_carbs_g: number;
    estimated_fat_g: number;
    quality_score: number; // 1-10
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  };
  feedback_text: string;
  suggestion_text: string;
}
```

### Checkin
```typescript
interface Checkin {
  id: number;
  user_id: number;
  date: string;
  weight_kg: number;
  compliance_score: number; // 0-100
  energy_level: number; // 1-10
  sleep_hours: number;
  morning: {
    front_photo_url: string;
    side_photo_url: string;
    back_photo_url: string;
    weight_kg: number;
  };
  evening: {
    meals_compliant: boolean;
    workouts_compliant: boolean;
    water_compliant: boolean;
    notes: string;
  };
  created_at: string;
}
```

### Transaction
```typescript
interface Transaction {
  id: number;
  wallet_id: number;
  type: 'deposit' | 'deduction' | 'refund' | 'withdrawal';
  amount: number;
  description: string;
  metadata: {
    reason?: string;
    related_id?: number;
    related_type?: string;
  };
  created_at: string;
}
```

### Message
```typescript
interface Message {
  id: number;
  user_id: number;
  sender_type: 'user' | 'coach' | 'system';
  content: string;
  attachment_type: 'photo' | null;
  attachment_url: string | null;
  ai_analysis: MealAnalysis | WorkoutAnalysis | null;
  is_read: boolean;
  read_at: string | null;
  is_ai_generated: boolean;
  created_at: string;
}
```

---

## 📱 Screen Specifications

### 1. Login Screen
**Route:** `/login`

**Components:**
- Email input
- Password input
- Login button
- "Forgot password?" link
- "Don't have an account? Sign up" link

**Behavior:**
- POST to `/api/login`
- Store token securely
- Navigate to Dashboard if `onboarding_completed === true`
- Navigate to Onboarding if `onboarding_completed === false`

---

### 2. Register Screen
**Route:** `/register`

**Components:**
- Name input
- Email input
- Password input
- Password confirmation input
- Register button
- "Already have an account? Login" link

**Behavior:**
- POST to `/api/register`
- Store token
- Navigate to web onboarding (sales questions + payment)

---

### 3. Dashboard Screen
**Route:** `/dashboard` (Tab 1)

**Sections:**

#### Header
- User name + greeting
- Current streak 🔥 (e.g., "7 day streak!")
- Wallet balance (e.g., "$50.00")

#### Today's Summary
- Check-in status (✅ Completed / ⚠️ Not yet)
- Today's workouts (list)
- Today's meals count
- Quick action buttons:
  - "Check In"
  - "Log Meal"
  - "Log Workout"

#### This Week
- Progress bar (e.g., "3/4 workouts completed")
- Upcoming workouts (next 3)
- Weekly nutrition summary

#### Recent Activity
- Recent deductions (if any)
- Recent achievements
- Coach messages preview

**API Call:**
- `GET /api/dashboard`

---

### 4. Workouts Screen
**Route:** `/workouts` (Tab 2)

**Sections:**

#### Upcoming (Default Tab)
- List of upcoming workouts (next 7 days)
- Each card shows:
  - Date
  - Type (cardio/strength/etc.)
  - Duration
  - Description
  - "Complete" button

#### History (Tab)
- Paginated list of past workouts
- Filter by: All / Completed / Missed
- Each card shows:
  - Date
  - Type
  - Status (✅ Verified / ❌ Missed)
  - Duration, distance, RPE
  - Notes

**API Calls:**
- `GET /api/workouts/upcoming`
- `GET /api/workouts?page=1`

---

### 5. Complete Workout Screen
**Route:** `/workouts/:id/complete`

**Form Fields:**
- Duration (minutes) - number input
- Distance (meters) - number input (optional)
- RPE (1-10) - slider
- Notes - text area (optional)
- Evidence photo - camera/gallery picker (optional)

**Buttons:**
- "Submit" - POST to `/api/workouts/{id}/complete`
- "Cancel"

**Behavior:**
- Show success message
- Navigate back to Workouts screen
- Update workout status

---

### 6. Meals Screen
**Route:** `/meals` (Tab 3)

**Sections:**

#### Today's Nutrition
- Total calories
- Total protein, carbs, fats
- Progress bars vs targets
- "Log Meal" button (camera icon)

#### Meal History
- Paginated list of meals
- Each card shows:
  - Photo thumbnail
  - Time logged
  - Food items
  - Calories + macros
  - Quality score (1-10)
  - AI feedback

**API Calls:**
- `GET /api/meals/today-totals`
- `GET /api/meals?page=1`

---

### 7. Log Meal Screen
**Route:** `/meals/new`

**Components:**
- Camera preview / Photo picker
- "Take Photo" button
- "Choose from Gallery" button
- Notes input (optional)
- "Analyze Meal" button

**Behavior:**
- POST to `/api/meals` (multipart/form-data)
- Show loading state ("Analyzing with AI...")
- Display AI analysis result
- Navigate back to Meals screen

---

### 8. Check-in Screen
**Route:** `/checkin`

**Form Sections:**

#### Morning Check-in
- Weight input (kg)
- Progress photos:
  - Front photo (camera)
  - Side photo (camera)
  - Back photo (camera)

#### Evening Check-in
- Compliance checkboxes:
  - ✅ Followed meal plan
  - ✅ Completed workouts
  - ✅ Drank enough water
- Sleep hours (number)
- Energy level (1-10 slider)
- Notes (text area)

**Buttons:**
- "Submit Check-in"

**Behavior:**
- POST to `/api/checkins`
- Show compliance score
- Show deduction amount (if any)
- Update streak
- Navigate to Dashboard

---

### 9. Inbox/Chat Screen
**Route:** `/inbox` (Tab 4)

**Components:**
- Message list (scrollable)
- Each message shows:
  - Sender (User / Coach)
  - Content
  - Timestamp
  - Attachment (if any)
  - AI analysis (if meal/workout photo)
- Message input (bottom)
- Photo attachment button
- Send button

**Behavior:**
- **Option 1:** WebView embedding web chat
- **Option 2:** Native chat (requires Messages API)

**Note:** Currently, chat is Livewire-based (web). Recommend WebView for MVP.

---

### 10. Profile Screen
**Route:** `/profile` (Tab 5)

**Sections:**

#### Personal Info
- Name
- Email
- Timezone
- Country

#### Physical Profile
- Age
- Height
- Weight
- Sex
- Injuries

#### Goals & Preferences
- Primary goal
- All goals
- Equipment
- Schedule
- Diet preferences

#### Subscription
- Plan: $89/month
- Next billing date
- Payment method
- "Manage Subscription" (Stripe portal)

#### Actions
- "Edit Profile"
- "Reset Onboarding"
- "Logout"

**API Call:**
- `GET /api/me`

---

## ✨ Features & Functionality

### 1. Strava Integration
**Status:** Backend implemented, OAuth flow exists

**Flow:**
1. User taps "Connect Strava" in Profile
2. Redirect to Strava OAuth
3. After authorization, redirect back to app
4. Workouts auto-sync from Strava

**Note:** Requires deep linking setup in mobile app

---

### 2. Meal Analysis (GPT-4 Vision)
**How it works:**
1. User uploads meal photo
2. Backend sends to GPT-4 Vision API
3. AI analyzes:
   - Food items
   - Estimated calories, protein, carbs, fats
   - Quality score (1-10)
   - Feedback & suggestions
4. Results displayed in app

**UI Considerations:**
- Show loading state (3-5 seconds)
- Display analysis in card format
- Highlight quality score with color coding:
  - 8-10: Green (excellent)
  - 5-7: Yellow (okay)
  - 1-4: Red (poor)

---

### 3. Deduction System
**How it works:**
- Missed workout → Deduct $5
- Low compliance score → Deduct $3
- Missed check-in → Deduct $2

**UI Considerations:**
- Show deduction warnings before they happen
- Display recent deductions on Dashboard
- Show wallet balance prominently
- Transaction history screen

---

### 4. Streak System
**How it works:**
- Daily check-ins maintain streak
- Missed check-in breaks streak
- Longest streak tracked

**UI Considerations:**
- Display current streak with 🔥 emoji
- Celebrate milestones (7, 14, 30, 60, 90 days)
- Show streak calendar view

---

### 5. Notifications
**Types:**
- Daily check-in reminder
- Upcoming workout reminder
- Deduction warning
- Coach message
- Milestone achievement

**Implementation:**
- Push notifications (FCM/APNS)
- In-app notification center
- Backend sends via Laravel Notifications

---

## 🎨 UI/UX Guidelines

### Design Principles
1. **Mobile-first** - Optimize for one-handed use
2. **Conversational** - Chat is primary interface
3. **Motivational** - Positive reinforcement, celebrate wins
4. **Transparent** - Clear about deductions and accountability
5. **Fast** - Minimize taps, quick actions

### Color Palette (Suggested)
- **Primary:** #3B82F6 (Blue) - Trust, professionalism
- **Success:** #10B981 (Green) - Achievements, compliance
- **Warning:** #F59E0B (Orange) - Warnings
- **Danger:** #EF4444 (Red) - Deductions, missed items
- **Neutral:** #6B7280 (Gray) - Text, backgrounds

### Typography
- **Headers:** Bold, 24-32px
- **Body:** Regular, 16px
- **Captions:** Regular, 14px
- **Font:** System font (SF Pro / Roboto)

### Components
- **Cards:** Rounded corners (12px), subtle shadow
- **Buttons:** Rounded (8px), clear CTAs
- **Inputs:** Rounded (8px), clear labels
- **Photos:** Rounded corners (8px)

### Iconography
- Use consistent icon set (e.g., Heroicons, Feather Icons)
- 24px for primary actions
- 20px for secondary actions

---

## 🔧 Technical Requirements

### Authentication
- **Token Storage:** Secure storage (Keychain/Keystore)
- **Token Refresh:** Handle 401 responses
- **Logout:** Clear token and navigate to Login

### API Integration
- **Base URL:** Environment variable
- **Timeout:** 30 seconds
- **Retry Logic:** 3 retries for network errors
- **Error Handling:** User-friendly error messages

### File Uploads
- **Image Compression:** Compress before upload (max 2MB)
- **Supported Formats:** JPG, PNG, HEIF
- **Max Size:** 10MB (backend limit)

### Offline Support
- **Queue:** Queue API calls when offline
- **Sync:** Sync when back online
- **Cache:** Cache dashboard data for offline viewing

### Performance
- **Pagination:** Load 20 items per page
- **Image Loading:** Lazy load images
- **Caching:** Cache API responses (5 minutes)

### Platform-Specific
- **iOS:** iOS 14+
- **Android:** Android 8+
- **Deep Linking:** Support for Strava OAuth redirect

---

## 📦 Deliverables Checklist

### Phase 1: MVP (4-6 weeks)
- [ ] Authentication (Login/Register)
- [ ] Dashboard
- [ ] Workouts (List, Complete)
- [ ] Meals (List, Log with AI analysis)
- [ ] Check-ins (Submit)
- [ ] Profile
- [ ] WebView Chat (Inbox)

### Phase 2: Enhanced (2-3 weeks)
- [ ] Strava Integration
- [ ] Push Notifications
- [ ] Transaction History
- [ ] Streak Calendar View
- [ ] Offline Support

### Phase 3: Polish (1-2 weeks)
- [ ] Animations & Transitions
- [ ] Onboarding Tutorial
- [ ] Error Handling Improvements
- [ ] Performance Optimization

---

## 🔗 Additional Resources

- **API Documentation:** `API_DOCUMENTATION.md`
- **Chat Architecture:** `CHAT_ARCHITECTURE.md`
- **Onboarding Flow:** `COMPLETE_CONVERSATIONAL_ONBOARDING.md`
- **Backend README:** `README.md`

---

## 📞 Support & Questions

For backend API questions or issues:
1. Check `API_DOCUMENTATION.md`
2. Review backend code in `/app/Http/Controllers/Api/`
3. Contact backend team

For design assets:
- Request Figma designs
- Request logo and brand assets

---

**End of Specification**
