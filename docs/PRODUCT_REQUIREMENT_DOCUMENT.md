
Fitness Accountability Platform — Updated PRD

Version: v2.0
Stack: Laravel (API + admin + web front end) | Expo React Native (mobile app)
Purpose: Combine real coaches with AI assistance to keep clients consistent and progressing toward their fitness goals through personalized plans, messaging, and adaptive feedback.

1. Product Vision

“Make personal coaching scalable and friction-free.”
Users don’t need discipline to start — their coach initiates contact, provides context-aware nudges, and the app makes logging and progress tracking effortless.
AI helps the coach craft precise messages, adapt plans, and identify next actions.

2. Core Objectives

Coach-Driven Accountability — the coach reaches out first; users respond in-app.

Goal Intelligence — capture users’ big goals and decompose them into measurable weekly milestones.

Adaptive Planning — auto-adjust workouts and nutrition guidance when users miss sessions or stall.

Simple Logging — one-tap workout and meal entry.

Human + AI Collaboration — AI drafts plans, checks adherence, and suggests coach prompts; coach reviews and sends.

(Financial stakes have been removed — motivation now comes through relationship and feedback.)

3. Key User Roles

Member / Client

Sets long-term goals & weekly habits.

Logs workouts, meals, and mood.

Chats with their coach.

Views plan, progress, and streaks.

Coach

Onboards clients.

Reviews AI-generated suggestions.

Sends or edits personalized messages.

Updates plans and tracks adherence.

Admin

Manages coaches, subscriptions, and compliance.

4. Primary Use Cases & Flows
   A. Onboarding

Client installs mobile app → creates account.

Guided intake (questions about goals, current level, schedule, injuries, nutrition habits).

Coach reviews profile, adjusts baseline metrics, approves initial plan.

B. Goal Breakdown & Planning

Client states high-level goal (“Run 5 km” or “Run 5 km < 20 min”).

AI helper generates progressive milestones (e.g. “Week 1: Run 2 km easy + cross-train 1×”).

Coach reviews/edits plan before confirming.

Each plan defines weekly tasks → aggregated to a cycle (block).

C. Messaging & Prompts

AI drafts message templates based on progress and plan status (e.g. missed workout → “Hey [name], want to adjust tomorrow or repeat today’s session?”).

Coach edits/sends manually.

Conversation history kept per user.

Push notifications when a new message arrives.

D. Progress & Adaptation

Client logs workouts/meals quickly (preset templates or photo upload).

Missed sessions flagged → AI proposes plan adjustments.

Coach approves adjustments (shortens next run, swaps rest days, etc.).

E. Data Entry Simplification

Workout logging: select type, distance/time, perceived effort, optional photo.

Meal logging: photo + optional note; AI tags macros for coach view.

5. Functional Requirements
   Client Mobile App (Expo)

Authentication (email + password | OAuth optional).

Onboarding wizard (multi-step, local state).

Chat interface (realtime, with typing indicator).

Daily/weekly plan view (calendar + checklist).

Workout logger & meal logger (camera access).

Progress graphs (completed workouts, weekly mileage, body metrics).

Push notifications (coach messages, reminders).

Coach Web App (Laravel)

Dashboard: list of clients + adherence summaries.

Client profile: goals, habits, history, chat feed.

Plan builder/editor: define blocks, weeks, workouts.

AI Assist panel: suggest next week plan, suggest message text.

Notification center: pending logs, missed sessions, AI recommendations.

Shared Backend (Laravel API)

REST/JSON or GraphQL endpoints for client + coach apps.

Auth (JWT + refresh tokens).

Chat system (WebSockets/Pusher/Laravel WebSockets).

AI micro-service endpoints:

/ai/message-suggestions

/ai/plan-builder

/ai/meal-analysis

Integrations (Phase 2): Strava / Fitbit sync, optional nutrition API.

6. Non-Functional Requirements

Performance: P95 API < 300 ms.

Security: JWT, signed S3 URLs for uploads, role-based policies.

Privacy: Compliant with Australian APPs; explicit consent for health data.

Availability: 99.9% uptime target.

Accessibility: WCAG 2.1 AA for coach web app.

7. Data Model (simplified)
   Table	Key Fields
   users	id (uuid), role (client/coach/admin), email, password, name
   profiles	user_id, height_cm, weight_kg, goals (jsonb), current_metrics (jsonb)
   plans	id, user_id, coach_id, goal_summary, status, weeks (jsonb)
   workouts	id, plan_id, date, type, target_metrics (jsonb), actual_metrics (jsonb), status
   meals	id, user_id, image_url, ai_feedback (jsonb), logged_at
   messages	id, sender_id, receiver_id, content, is_ai_suggested (bool), read_at
   habits	id, user_id, name, frequency, progress_count
   notifications	id, user_id, type, data (jsonb), read_at
   ai_logs	id, context, prompt, response, confidence_score
8. AI Integration Overview
   Feature	Input	Output
   Goal Breakdown	Goal text + current fitness	8-12 week progressive structure
   Message Suggestions	Plan status + adherence summary	1–3 personalized coach message drafts
   Meal Feedback	Meal photo + notes	Macro estimate + 1-line suggestion
   Plan Adjustment	Missed sessions + recovery data	Updated next week plan proposal

(All suggestions require coach review before sending to client.)

9. UI/UX Principles

Mobile (Client): calming, motivational palette; large CTA buttons (“Log Workout”, “Chat with Coach”).

Web (Coach): data-dense but simple; sortable tables; chat pane with “AI Assist” sidebar.

Feedback Loop: every client action visible to coach in near-real-time.

10. MVP Scope (3 months)

✅ Core Auth
✅ Client onboarding + goals intake
✅ Coach dashboard + chat
✅ Plan creation + weekly tasks
✅ Workout/meal logging
✅ AI message suggestions (OpenAI API)
✅ Push notifications (Expo + Laravel WebPush)
✅ Basic analytics dashboard

11. Future Phases

Phase 2: wearable integrations, nutrition macros tracking, group coaching
Phase 3: video check-ins, progress media library, advanced analytics
Phase 4: marketplace for certified coaches, AI co-coach auto-responders

12. Success Metrics (MVP)

70 % of clients respond to ≥ 3 messages/week.

≥ 80 % of logged workouts receive coach feedback within 24 h.

85 % coach satisfaction with AI message suggestions (rated “helpful”).




Expo Mobile App — Technical Spec (Client)
1) High-level architecture

Framework: Expo (React Native, TypeScript)

Navigation: Expo Router (file-based)

State: React Query (server state) + Zustand (light client state)

Auth: JWT (short-lived) + refresh token; SecureStore for secrets

Networking: Axios + interceptors; retry w/ exponential backoff

Realtime: Laravel WebSockets/Pusher for chat + plan events

Uploads: S3 pre-signed URLs (images for meals, workout evidence)

Notifications: expo-notifications (device token → Laravel)

Analytics: PostHog or Amplitude (events + screen views)

Offline: Request queue (SQLite/MMKV) for message & upload retries

2) Directory tree (Expo Router)
   app/
   _layout.tsx                    # global layout + providers
   (auth)/
   login.tsx
   register.tsx
   onboarding.tsx
   (tabs)/
   _layout.tsx                  # Tab navigator
   index.tsx                    # Dashboard (Today)
   plan.tsx                     # Weekly plan (calendar/list)
   log.tsx                      # Log actions hub (Workout/Meal)
   chat.tsx                     # Chat with Coach
   profile.tsx                  # Profile & settings
   workout/
   [id].tsx                     # Workout detail + log
   meal/
   upload.tsx                   # Camera + upload flow
   history.tsx
   notifications/
   index.tsx                    # Notification center (optional)

assets/
icons/ ...
images/ ...

lib/
api.ts                         # axios instance + interceptors
endpoints.ts                   # URL builders
auth.ts                        # token helpers
ws.ts                          # websockets connector
notifications.ts               # push setup & handlers
uploads.ts                     # S3 presigned URL helpers
analytics.ts                   # tracking wrapper
validators.ts                  # zod/yup schemas (optional)

state/
useAuth.ts                     # user/session
useUploadQueue.ts              # offline queue
usePrefs.ts                    # UI prefs, theme, tz

components/
ui/                            # atomic components (Button, Card, etc.)
charts/                        # progress rings, mini charts
forms/                         # reusable form inputs
tiles/                         # Today tiles (Workout, Steps, Meals)
chat/
MessageBubble.tsx
Composer.tsx
SuggestionChips.tsx

hooks/
useChat.ts                     # chat channel & events
usePlan.ts                     # plan queries & mutations
useMeals.ts
useWorkouts.ts
useRealtime.ts                 # subscribe/unsubscribe helpers

types/
dto.ts                         # DTOs from API
models.ts                      # app-level types
api-responses.ts

config/
constants.ts
env.ts                         # read from process.env / app.json

scripts/
make-icons.sh                  # maskable icons, etc.

app.config.ts                    # Expo config
eas.json                         # build profiles

3) Core data types (TypeScript)
   // types/models.ts
   export type Role = 'client' | 'coach' | 'admin';

export interface User {
id: string;
name: string;
email: string;
role: Role;
tz?: string;
}

export interface Goal {
id: string;
summary: string;       // "Run 5k under 20 min"
targetDate?: string;   // ISO
}

export interface Plan {
id: string;
userId: string;
coachId: string;
status: 'active' | 'paused';
goalSummary: string;
weekNumber: number;
weeks: PlanWeek[];
}

export interface PlanWeek {
weekIndex: number;
tasks: PlanTask[];
}

export type WorkoutType = 'run' | 'ride' | 'strength' | 'pilates' | 'other';

export interface PlanTask {
id: string;
date: string; // ISO
kind: 'workout' | 'habit';
title: string;
target?: {
type?: WorkoutType;
distanceKm?: number;
durationMin?: number;
paceMinPerKm?: number;
rpe?: number;
};
status: 'scheduled' | 'completed' | 'missed';
}

export interface WorkoutLog {
id: string;
planTaskId: string;
date: string;
type: WorkoutType;
actual: {
durationMin?: number;
distanceKm?: number;
rpe?: number;
notes?: string;
evidenceUrl?: string;
};
}

export interface Meal {
id: string;
imageUrl: string;
loggedAt: string;
aiFeedback?: {
macroEstimate?: { protein: number; carbs: number; fat: number; kcal: number };
suggestion?: string;
confidence?: number;
};
}

export interface Message {
id: string;
senderId: string;
receiverId: string;
content: string;
createdAt: string;
isAiSuggested?: boolean;
}

4) API contract (Laravel ↔️ Expo)

Auth

POST /api/auth/login → { accessToken, refreshToken, user }

POST /api/auth/refresh → { accessToken }

POST /api/auth/logout → 204

Profile & Goals

GET /api/me → User

GET /api/me/goals → Goal[]

POST /api/me/goals → create/update goal

Plan & Tasks

GET /api/me/plan/current → Plan

POST /api/me/plan/acknowledge → mark seen

POST /api/me/tasks/:id/complete → complete a workout/habit

POST /api/me/workouts → create WorkoutLog (manual log)

Meals

POST /api/uploads/presign → { url, fields } (S3 form fields)

POST /api/me/meals → { imageKey } (after S3 upload) → returns Meal

GET /api/me/meals?from=&to= → Meal[]

Chat

GET /api/chat/threads → list threads

GET /api/chat/:threadId/messages → Message[]

POST /api/chat/:threadId/messages → send message

Realtime: WebSocket events message.created, plan.updated, task.status

Notifications

POST /api/push/register → register Expo push token { token }

AI Assistance (server-side, not called directly from client)

/ai/message-suggestions (Laravel calls model and returns suggestions to coach UI)

5) Axios instance + token refresh
   // lib/api.ts
   import axios from 'axios';
   import * as SecureStore from 'expo-secure-store';
   import Constants from 'expo-constants';

const api = axios.create({
baseURL: Constants.expoConfig?.extra?.API_BASE_URL,
timeout: 12000,
});

let isRefreshing = false;
let queue: Array<(t: string) => void> = [];

api.interceptors.request.use(async (config) => {
const token = await SecureStore.getItemAsync('accessToken');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});

api.interceptors.response.use(
(r) => r,
async (error) => {
const original = error.config;
if (error?.response?.status === 401 && !original._retry) {
original._retry = true;
if (isRefreshing) {
return new Promise((resolve) => {
queue.push((t) => {
original.headers.Authorization = `Bearer ${t}`;
resolve(api(original));
});
});
}
isRefreshing = true;
try {
const refreshToken = await SecureStore.getItemAsync('refreshToken');
const { data } = await axios.post(
`${Constants.expoConfig?.extra?.API_BASE_URL}/auth/refresh`,
{ refreshToken }
);
await SecureStore.setItemAsync('accessToken', data.accessToken);
queue.forEach((cb) => cb(data.accessToken));
queue = [];
original.headers.Authorization = `Bearer ${data.accessToken}`;
return api(original);
} finally {
isRefreshing = false;
}
}
return Promise.reject(error);
}
);

export default api;

6) React Query setup & sample hooks
   // app/_layout.tsx
   import { Stack } from 'expo-router';
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
   import { AuthProvider } from '@/state/useAuth';

const client = new QueryClient();

export default function Layout() {
return (
<QueryClientProvider client={client}>
<AuthProvider>
<Stack screenOptions={{ headerShown: false }} />
</AuthProvider>
</QueryClientProvider>
);
}

// hooks/usePlan.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plan } from '@/types/models';

export function useCurrentPlan() {
return useQuery<Plan>({
queryKey: ['plan', 'current'],
queryFn: async () => (await api.get('/me/plan/current')).data,
staleTime: 30_000,
});
}

export function useCompleteTask() {
const qc = useQueryClient();
return useMutation({
mutationFn: (taskId: string) => api.post(`/me/tasks/${taskId}/complete`),
onSuccess: () => qc.invalidateQueries({ queryKey: ['plan', 'current'] }),
});
}

7) Chat essentials
   // hooks/useChat.ts
   import { useEffect } from 'react';
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import api from '@/lib/api';

export function useMessages(threadId: string) {
return useQuery({
queryKey: ['chat', threadId],
queryFn: async () => (await api.get(`/chat/${threadId}/messages`)).data,
refetchInterval: 5000, // replaced by WS when available
});
}

export function useSendMessage(threadId: string) {
const qc = useQueryClient();
return useMutation({
mutationFn: (content: string) =>
api.post(`/chat/${threadId}/messages`, { content }),
onSuccess: () => qc.invalidateQueries({ queryKey: ['chat', threadId] }),
});
}

// components/chat/Composer.tsx
import { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';

export default function Composer({ onSend }: { onSend: (t: string) => void }) {
const [txt, setTxt] = useState('');
return (
<View className="flex-row items-center p-2 border-t border-gray-200">
<TextInput
className="flex-1 bg-white p-3 rounded-xl border"
value={txt}
onChangeText={setTxt}
placeholder="Message your coach..."
/>
<Pressable
className="ml-2 px-4 py-3 rounded-xl bg-black"
onPress={() => {
if (!txt.trim()) return;
onSend(txt.trim());
setTxt('');
}}
>
<Text className="text-white font-semibold">Send</Text>
</Pressable>
</View>
);
}

8) Meal upload (camera → S3 presigned)
   // lib/uploads.ts
   import api from './api';

export async function getPresigned(keyHint: string) {
const { data } = await api.post('/uploads/presign', { keyHint });
return data as { url: string; fields: Record<string, string> };
}

export async function uploadToS3(url: string, fields: Record<string, string>, file: Blob) {
const form = new FormData();
Object.entries(fields).forEach(([k, v]) => form.append(k, v));
form.append('file', file);
const res = await fetch(url, { method: 'POST', body: form });
if (!res.ok) throw new Error('S3 upload failed');
}

// app/meal/upload.tsx
import * as ImagePicker from 'expo-image-picker';
import { getPresigned, uploadToS3 } from '@/lib/uploads';
import api from '@/lib/api';

export default function MealUpload() {
const pick = async () => {
const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
if (res.canceled) return;
const asset = res.assets[0];
const blob = await (await fetch(asset.uri)).blob();
const keyHint = `meals/${Date.now()}`;
const { url, fields } = await getPresigned(keyHint);
await uploadToS3(url, fields, blob);
await api.post('/me/meals', { imageKey: fields.key }); // server links & triggers AI
};
// render button calling pick()
}

9) Push notifications
   // lib/notifications.ts
   import * as Notifications from 'expo-notifications';
   import * as Device from 'expo-device';

export async function registerForPushToken() {
if (!Device.isDevice) return null;
const { status: existingStatus } = await Notifications.getPermissionsAsync();
let finalStatus = existingStatus;
if (existingStatus !== 'granted') {
const { status } = await Notifications.requestPermissionsAsync();
finalStatus = status;
}
if (finalStatus !== 'granted') return null;
const token = (await Notifications.getExpoPushTokenAsync()).data;
return token;
}


On login success:

// state/useAuth.ts (after storing tokens)
const token = await registerForPushToken();
if (token) await api.post('/push/register', { token });


Handle foreground:

Notifications.setNotificationHandler({
handleNotification: async () => ({
shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false
}),
});

10) Realtime (nice-to-have MVP → Phase 2)

Use Laravel WebSockets with Pusher protocol.

Client subscribes to private-user-{id}.

Events: message.created, plan.updated, task.status.

Fallback to polling (as shown) until WS is wired.

11) Offline queue (for reliability)

Store pending actions in SQLite/MMKV: { kind, payload, retryCount, nextAttemptAt }

A background task (app resume / interval) flushes queue.

Use it for:

chat messages when offline

meal uploads after S3 success but API confirm failed

task completion taps

Skeleton:

// state/useUploadQueue.ts (pseudo)
addJob({ kind: 'completeTask', payload: { taskId } });
processJobs(); // on app focus / network regain

12) Navigation & deep links

myapp://chat opens chat tab.

Tap notification with data.route = "/(tabs)/chat" to route user directly.

Expo Router’s Linking.createURL('/') for consistent prefixes.

13) Theming & UI

Tailwind-RN (e.g. NativeWind) or className-style utilities for consistent design.

Big CTAs on the Today screen: “Check Plan”, “Log Workout”, “Upload Meal”, “Message Coach”.

Small progress widgets (rings) for weekly tasks completed.

14) Error handling & UX guardrails

Global toast for API errors (e.g., react-native-toast-message).

Empty states with single CTA (“No plan yet — message your coach”).

Validate inputs with zod (optional).

Safe-areas, keyboard-avoiding views in forms/chat.

15) Testing

Unit: hooks & utils (usePlan, uploads.ts) with Jest

Component: RN Testing Library for chat composer, log forms

E2E: Detox (basic auth + log workout + send message flow)

16) Config & secrets

app.config.ts

export default {
expo: {
name: "CoachClient",
slug: "coach-client",
scheme: "myapp",
extra: {
API_BASE_URL: process.env.API_BASE_URL,
SENTRY_DSN: process.env.SENTRY_DSN,
},
ios: { supportsTablet: false },
android: { adaptiveIcon: { foregroundImage: "./assets/icons/adaptive.png" } },
plugins: ["expo-notifications"],
},
};


.env (EAS secrets)

API_BASE_URL=https://api.yourdomain.com/api
SENTRY_DSN=...

17) Minimal screen responsibilities

(tabs)/index.tsx (Today)

Fetch useCurrentPlan()

Show next task, quick actions (Log workout/meal, Message)

(tabs)/plan.tsx

Week list/calendar; tap task → /workout/[id]

workout/[id].tsx

Show prescription; one-tap “Complete”; optional RPE & notes

meal/upload.tsx

Camera → S3 → POST /me/meals

(tabs)/chat.tsx

Messages list + Composer; optionally show AI suggestion chips returned by server for the coach (client sees normal chat)

18) Analytics events

auth_login_success

onboarding_complete

plan_viewed, task_completed, task_missed

meal_uploaded

message_sent, message_received

push_token_registered

Tie user properties: goal_primary, experience_level, coach_id

19) Release flow (EAS)

Channels: beta, production

Build profiles: eas.json

Use OTA updates for minor UI changes; bump native for permissions/capabilities.

20) Nice touches to ship fast

Skeleton loaders on Today/Plan screens

Pull-to-refresh in Chat & Plan

Sticky composer in Chat

“Quick log” presets (e.g., “2 km easy”, “30 min walk”)

Accessibility: large tap targets, VoiceOver labels