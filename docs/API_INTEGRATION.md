# API Integration Guide

## Overview

This document describes how the mobile app integrates with the Laravel backend API.

## Base Configuration

### Environment Variables
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
```

### API Client Setup
Located in `services/api.client.ts`:
- Base URL from environment
- Automatic token injection
- Request/response interceptors
- Error handling

## Authentication

### Login
```typescript
POST /api/login
Body: { email: string, password: string }
Response: { token: string, user: User }
```

### Register
```typescript
POST /api/register
Body: { name: string, email: string, password: string }
Response: { token: string, user: User }
```

### Logout
```typescript
POST /api/logout
Headers: { Authorization: Bearer {token} }
```

## Plans & Tasks

### Get Current Plan
```typescript
GET /api/plans/current
Response: Plan
```

### Get Week Tasks
```typescript
GET /api/tasks/week
Response: PlanTask[]
```

### Complete Task
```typescript
POST /api/tasks/{id}/complete
Response: PlanTask
```

## Workouts

### Create Workout
```typescript
POST /api/workouts
Body: { date: string, type: WorkoutType, actual: WorkoutActual }
Response: WorkoutLog
```

### Create Workout with Evidence
```typescript
POST /api/workouts/with-evidence
Body: FormData with workout data and image
Response: WorkoutLog
```

### Get Workouts
```typescript
GET /api/workouts
Query: { from?: string, to?: string }
Response: WorkoutLog[]
```

## Meals

### Upload Meal
```typescript
POST /api/meals/upload
Body: FormData with image, meal_type, description
Response: Meal
```

### Get Today's Meals
```typescript
GET /api/meals/today
Response: Meal[]
```

## Goals

### Get Goals
```typescript
GET /api/goals
Response: Goal[]
```

### Create Goal
```typescript
POST /api/goals
Body: { summary: string, description?: string, goal_type: string, target_date?: string }
Response: Goal
```

### Complete Goal
```typescript
POST /api/goals/{id}/complete
Response: Goal
```

### Get Goal Milestones
```typescript
GET /api/goals/{id}/milestones
Response: Milestone[]
```

## Analytics

### Get Dashboard Stats
```typescript
GET /api/analytics/dashboard
Response: DashboardStats
```

### Get Streak Info
```typescript
GET /api/analytics/streak
Response: StreakInfo
```

### Get Weekly Summary
```typescript
GET /api/analytics/weekly-summary/current
Response: WeeklySummary
```

## Messages

### Get Messages
```typescript
GET /api/messages
Response: Message[]
```

### Send Message
```typescript
POST /api/messages
Body: { content: string }
Response: Message
```

## Notifications

### Register Push Token
```typescript
POST /api/notifications/push-token
Body: { token: string }
```

### Get Notification Preferences
```typescript
GET /api/notifications/preferences
Response: NotificationPreferences
```

### Update Preferences
```typescript
PUT /api/notifications/preferences
Body: NotificationPreferences
Response: NotificationPreferences
```

## WebSocket

### Connection
```
WS /ws?token={auth_token}
```

### Events
```typescript
// Incoming events
message.new: { message: Message }
plan.updated: { plan: Plan }
task.updated: { task: PlanTask }
goal.updated: { goalId: string }
workout.feedback: { workoutId: string, feedback: string }
meal.feedback: { mealId: string, feedback: AIFeedback }
notification.new: { notification: Notification }

// Outgoing events
ping: {}
pong: {}
```

## Error Handling

### Standard Error Response
```typescript
{
  message: string,
  errors?: Record<string, string[]>
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

### Error Handling in App
```typescript
try {
  const data = await MyService.getData();
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || 'An error occurred';
    Alert.alert('Error', message);
  }
}
```

## File Uploads

### S3 Presigned URLs

The app uses S3 presigned URLs for secure file uploads:

1. **Request presigned URL** from backend
2. **Upload file** directly to S3
3. **Notify backend** of successful upload

Example flow for workout evidence:
```typescript
// 1. Get presigned URL
const { presigned_url, file_key } = await getPresignedUrl();

// 2. Upload to S3
await uploadToS3(presigned_url, file);

// 3. Create workout with file_key
await createWorkout({ ...data, evidence_key: file_key });
```

## Rate Limiting

Backend may implement rate limiting:
- Respect `Retry-After` header
- Implement exponential backoff
- Queue requests when rate limited

## Caching Strategy

### React Query Configuration
```typescript
{
  staleTime: 60_000,      // 1 minute
  gcTime: 5 * 60_000,     // 5 minutes
  retry: 2,
}
```

### Cache Invalidation
Automatic invalidation on:
- Mutations (create, update, delete)
- WebSocket events
- Pull-to-refresh
- App foreground

## Testing API Integration

### Using Postman/Insomnia

1. Import API collection
2. Set environment variables
3. Obtain auth token via login
4. Test endpoints with token

### Mock Data

For development without backend:
```typescript
// services/mock.service.ts
export class MockService {
  static async getData() {
    return Promise.resolve(mockData);
  }
}
```

## Troubleshooting

### Issue: 401 Unauthorized
- Check token is valid
- Verify token is being sent in headers
- Check token expiration

### Issue: CORS errors
- Ensure backend CORS is configured
- Check API URL is correct
- Verify request headers

### Issue: Timeout
- Check network connectivity
- Increase timeout in axios config
- Verify backend is responsive

### Issue: File upload fails
- Check file size limits
- Verify S3 configuration
- Check presigned URL expiration
