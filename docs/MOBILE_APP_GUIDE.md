# Mobile App Developer Guide

## Overview

This is a React Native mobile app built with Expo for a fitness coaching platform. The app provides comprehensive fitness tracking, meal logging, goal management, and real-time communication with coaches.

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Navigation:** Expo Router (file-based routing)
- **State Management:** React Query (TanStack Query)
- **HTTP Client:** Axios
- **Real-time:** WebSockets
- **Offline Support:** AsyncStorage + Queue System
- **Push Notifications:** Expo Notifications
- **Image Handling:** Expo Image Picker
- **Network Detection:** @react-native-community/netinfo
- **TypeScript:** Full type safety

## Project Structure

```
coach-app/
├── app/                    # Screens (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── today.tsx      # Dashboard
│   │   ├── plan.tsx       # Weekly plan
│   │   ├── log.tsx        # Activity logging hub
│   │   ├── inbox.tsx      # Coach messages
│   │   └── profile.tsx    # User profile
│   ├── workout/           # Workout screens
│   │   └── log.tsx        # Workout logging
│   ├── meal/              # Meal screens
│   │   ├── log.tsx        # Meal logging
│   │   └── history.tsx    # Meal history
│   ├── goals/             # Goal screens
│   │   ├── index.tsx      # Goals list
│   │   └── [id].tsx       # Goal details
│   ├── progress/          # Analytics screens
│   │   └── index.tsx      # Progress dashboard
│   └── settings/          # Settings screens
│       └── notifications.tsx
├── components/            # Reusable components
│   ├── ui/               # UI primitives
│   ├── plan/             # Plan-specific components
│   ├── workout/          # Workout components
│   ├── meal/             # Meal components
│   ├── goals/            # Goal components
│   └── analytics/        # Analytics components
├── hooks/                # Custom React hooks
├── services/             # API and business logic
├── contexts/             # React contexts
├── types/                # TypeScript types
└── constants/            # App constants

```

## Key Features

### 1. Authentication
- Email/password login
- Secure token storage (expo-secure-store)
- Auto-login on app launch
- Onboarding flow for new users

### 2. Today Dashboard
- Daily task overview
- Quick action buttons
- Progress widgets
- Upcoming workouts

### 3. Weekly Plan
- Calendar view with week navigation
- Task list by day
- Task completion tracking
- Plan progress visualization

### 4. Workout Logging
- 9 workout types (run, ride, swim, strength, yoga, pilates, HIIT, walk, other)
- Metrics input (duration, distance, RPE, calories)
- Photo evidence upload
- Quick presets for common workouts

### 5. Meal Logging
- Camera-first design
- AI nutritional analysis
- Meal type selection (breakfast, lunch, dinner, snack)
- Macro estimates display

### 6. Goal Management
- Goal creation and tracking
- Milestone system
- Progress visualization
- Complete/pause/resume actions

### 7. Progress & Analytics
- Streak tracking
- Overall statistics
- Weekly summaries
- Achievement system

### 8. Push Notifications
- Task reminders
- Workout reminders
- Meal reminders
- Coach messages
- Goal updates
- Customizable preferences

### 9. Real-time Updates
- WebSocket connection
- Live message updates
- Plan/task updates
- Goal updates
- AI feedback notifications

### 10. Offline Support
- Action queuing when offline
- Auto-sync when online
- Persistent queue storage
- Retry logic with exponential backoff

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Backend API running (see QUICK_START.md)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Create `.env` file:
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_DISABLE_AUTH=false
```

3. **Start development server:**
```bash
npm start
```

4. **Run on device:**
- iOS: Press `i` or scan QR code with Camera app
- Android: Press `a` or scan QR code with Expo Go app

## Development Workflow

### Adding a New Screen

1. Create file in `app/` directory:
```typescript
// app/my-screen.tsx
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function MyScreen() {
  return (
    <ThemedView>
      <ThemedText>My Screen</ThemedText>
    </ThemedView>
  );
}
```

2. Navigate to it:
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/my-screen');
```

### Adding a New API Service

1. Create service in `services/`:
```typescript
// services/my.service.ts
import { apiClient } from './api.client';

export class MyService {
  static async getData() {
    const response = await apiClient.get('/api/my-data');
    return response.data;
  }
}
```

2. Create React Query hook:
```typescript
// hooks/use-my-data.ts
import { useQuery } from '@tanstack/react-query';
import { MyService } from '@/services/my.service';

export function useMyData() {
  return useQuery({
    queryKey: ['myData'],
    queryFn: MyService.getData,
  });
}
```

3. Use in component:
```typescript
import { useMyData } from '@/hooks/use-my-data';

function MyComponent() {
  const { data, isLoading, error } = useMyData();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  
  return <View>{/* Render data */}</View>;
}
```

### Adding Offline Support

Wrap mutations with offline support:
```typescript
import { useOfflineMutation } from '@/hooks/use-offline-queue';

const { mutate } = useOfflineMutation(
  MyService.createItem,
  {
    type: 'custom',
    action: 'create',
    onSuccess: () => console.log('Success'),
  }
);
```

## Testing

### Manual Testing Checklist

- [ ] Login/logout flow
- [ ] Onboarding completion
- [ ] Today dashboard loads
- [ ] Weekly plan navigation
- [ ] Workout logging with photo
- [ ] Meal logging with camera
- [ ] Goal creation and completion
- [ ] Progress analytics display
- [ ] Push notification reception
- [ ] WebSocket real-time updates
- [ ] Offline queue functionality
- [ ] Network reconnection handling

### Testing Offline Mode

1. Enable airplane mode on device
2. Perform actions (log workout, complete task)
3. Verify actions are queued
4. Disable airplane mode
5. Verify actions auto-sync

### Testing Push Notifications

1. Ensure physical device (not simulator)
2. Grant notification permissions
3. Trigger notification from backend
4. Verify notification appears
5. Tap notification and verify navigation

## Common Issues

### Issue: "Network request failed"
**Solution:** Ensure backend API is running and `EXPO_PUBLIC_API_URL` is correct.

### Issue: Push notifications not working
**Solution:** Must use physical device. Simulators don't support push notifications.

### Issue: Images not uploading
**Solution:** Check camera/library permissions. Verify S3 configuration in backend.

### Issue: WebSocket not connecting
**Solution:** Ensure WebSocket endpoint is accessible. Check token authentication.

### Issue: Offline queue not processing
**Solution:** Check network connectivity. Verify queue service is initialized.

## Performance Optimization

### React Query Configuration
- Stale time: 1 minute
- Cache time: 5 minutes
- Retry: 2 attempts
- Refetch on window focus: enabled

### Image Optimization
- Quality: 0.8
- Allow editing: true
- Aspect ratio: maintained

### WebSocket
- Ping interval: 30 seconds
- Reconnect attempts: 5
- Exponential backoff: enabled

## Security Best Practices

1. **Token Storage:** Use expo-secure-store for auth tokens
2. **API Communication:** Always use HTTPS in production
3. **Sensitive Data:** Never log tokens or passwords
4. **Permissions:** Request only necessary permissions
5. **Input Validation:** Validate all user inputs

## Deployment

### iOS

1. Configure app.json with bundle identifier
2. Build: `eas build --platform ios`
3. Submit to App Store: `eas submit --platform ios`

### Android

1. Configure app.json with package name
2. Build: `eas build --platform android`
3. Submit to Play Store: `eas submit --platform android`

## Support

For issues or questions:
- Check existing documentation in `/docs`
- Review API documentation in backend
- Check Expo documentation: https://docs.expo.dev
