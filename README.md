# Coach App - AI-Powered Fitness & Nutrition Coach

A comprehensive React Native mobile app built with Expo that provides AI-powered fitness coaching, meal analysis, workout tracking, goal management, and real-time communication with coaches.

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 📱 **Today Dashboard** - Daily overview with tasks, quick actions, and progress widgets
- 📅 **Weekly Plan** - Interactive calendar with task tracking and completion
- 💪 **Workout Logging** - 9 workout types with metrics, RPE tracking, and photo evidence
- 📸 **Meal Logging** - Camera-first design with AI nutritional analysis
- 🎯 **Goal Management** - Set goals with milestones and track progress
- 📊 **Progress & Analytics** - Streaks, statistics, and weekly summaries
- 💬 **Coach Messaging** - Real-time chat with your fitness coach

### Advanced Features
- 🔔 **Push Notifications** - Customizable reminders and updates
- ⚡ **Real-time Updates** - WebSocket integration for live data sync
- 📴 **Offline Support** - Queue actions when offline, auto-sync when online
- 🌓 **Dark Mode** - Beautiful UI that adapts to light and dark themes
- ♿ **Accessibility** - Loading states, error handling, and empty states

## Quick Start

**Using Docker?** See [QUICK_START.md](./QUICK_START.md) for the fastest setup! 🚀

### 1. Start Backend

```bash
cd /path/to/backend
./vendor/bin/sail up -d
```

### 2. Start Frontend

```bash
docker-compose up -d
```

### 3. Test Connection

```bash
npm run test-connection
```

### 4. Open the App

View logs to see QR code:
```bash
docker logs coach-app-frontend
```

Or visit: http://localhost:19000

**Test Credentials:**
- Email: `test@test.com`
- Password: `11111111`

### Native Setup (Without Docker)

If not using Docker:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API**
   ```bash
   cp .env.example .env
   # Edit .env and set: EXPO_PUBLIC_API_URL=http://localhost:8000/api
   ```

3. **Create Test User**
   ```bash
   npm run reset-data
   ```
   
   **Note for Docker users:** If using Docker, run this inside the container:
   ```bash
   docker exec coach-app-frontend npm run reset-data
   ```

4. **Start App**
   ```bash
   npm start
   ```

## Get started (Alternative Methods)

### Option 1: Using Docker (Recommended)

The easiest way to set up the development environment is using Docker:

1. Make sure you have [Docker](https://docs.docker.com/get-docker/) installed

2. Build and start the development server:
   ```bash
   ./start.sh build
   ./start.sh start
   ```

3. Access Expo DevTools at http://localhost:19002

For detailed Docker setup instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

### Option 2: Native Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Backend Connection Testing

The app includes built-in tools to test and troubleshoot the connection to your backend API:

### Using the Connection Test UI

1. **Via the Explore Tab**:
   - Open the app and navigate to the "Explore" tab
   - Expand the "Backend Connection Test" section
   - Tap "Check Backend Connection" to test connectivity

2. **Dedicated Test Screen**:
   - Navigate to `/connection-test` in your app
   - View detailed connection diagnostics and troubleshooting steps

### Programmatic Usage

You can also use the health check service directly in your code:

```typescript
import { HealthService } from '@/services/health.service';

// Check backend health
const result = await HealthService.checkHealth();

if (result.status === 'success') {
  console.log('Backend is reachable!');
  console.log('Response time:', result.details.responseTime, 'ms');
} else {
  console.error('Connection failed:', result.message);
  console.log('Troubleshooting steps:', result.details.troubleshooting);
}
```

### Using the Connection Status Component

```typescript
import { ConnectionStatus } from '@/components/connection-status';

// Full version with troubleshooting
<ConnectionStatus showTroubleshooting={true} />

// Compact version
<ConnectionStatus compact={true} />

// Auto-check on mount
<ConnectionStatus autoCheck={true} />
```

### Backend Configuration

The backend API URL is configured via the `EXPO_PUBLIC_API_URL` environment variable:

1. Copy `.env.example` to `.env`
2. Set the appropriate API URL for your environment:
   - **Local development**: `http://localhost:8000/api`
   - **Android emulator**: `http://10.0.2.2:8000/api`
   - **iOS simulator**: `http://localhost:8000/api`
   - **Physical device**: `http://YOUR_COMPUTER_IP:8000/api`

3. Restart the Expo development server after changing `.env`

For more configuration details, use the connection test UI which provides environment-specific setup instructions.

## Project Structure

```
coach-app/
├── app/                    # App screens (file-based routing)
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Home screen
│   │   ├── inbox.tsx      # Chat with AI coach
│   │   └── explore.tsx    # Explore features
│   ├── _layout.tsx        # Root layout with auth
│   ├── index.tsx          # Landing page
│   ├── login.tsx          # Login screen
│   └── register.tsx       # Registration screen
├── components/            # Reusable components
│   ├── inbox/            # Chat components
│   ├── ui/               # UI components
│   └── themed-*.tsx      # Theme-aware components
├── services/             # API and business logic
│   ├── api.client.ts     # Axios HTTP client
│   ├── auth.service.ts   # Authentication service
│   └── token.service.ts  # Secure token storage
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication state
├── types/                # TypeScript types
└── constants/            # App constants

```

## Available Scripts

- `npm start` - Start the Expo dev server
- `npm run reset-data` - Create test user in backend (run inside Docker: `docker exec coach-app-frontend npm run reset-data`)
- `npm run test-connection` - Test backend connectivity (Docker only)
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

## 📚 Documentation

### Setup & Configuration
- [Quick Start Guide](./QUICK_START.md) - Fastest way to get started
- [API Setup Guide](./API_SETUP.md) - Connect to your Laravel backend
- [Docker Setup](./DOCKER_SETUP.md) - Run with Docker
- [Authentication Flow](./AUTHENTICATION.md) - How auth works

### Development
- [Mobile App Developer Guide](./docs/MOBILE_APP_GUIDE.md) - Complete development guide
- [API Integration Guide](./docs/API_INTEGRATION.md) - Backend API reference
- [Frontend Specification](./FRONTEND_SPECIFICATION.md) - UI/UX details

### Features
- [Stripe Setup](./STRIPE_SETUP.md) - Payment integration
- [Testing Stripe](./TESTING_STRIPE.md) - Test payment flows

## 🛠️ Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Navigation:** Expo Router (file-based routing)
- **State Management:** React Query (TanStack Query v5)
- **HTTP Client:** Axios
- **Real-time:** WebSockets
- **Offline Support:** AsyncStorage + Queue System
- **Push Notifications:** Expo Notifications
- **Image Handling:** Expo Image Picker
- **Network Detection:** @react-native-community/netinfo
- **TypeScript:** Full type safety throughout

## 🚀 Development

### Authentication

The app uses JWT token authentication with secure storage:

```typescript
// Register new user
await AuthService.register({ name, email, password, password_confirmation });

// Login
await AuthService.login({ email, password });

// Get current user
const user = await AuthService.getCurrentUser();

// Logout
await AuthService.logout();
```

### Making API Calls with React Query

Use React Query hooks for data fetching:

```typescript
import { useTodayTasks } from '@/hooks/use-plan';

function MyComponent() {
  const { data, isLoading, error, refetch } = useTodayTasks();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;
  
  return <TaskList tasks={data} />;
}
```

### Offline Support

Wrap mutations with offline support:

```typescript
import { useOfflineMutation } from '@/hooks/use-offline-queue';

const { mutate } = useOfflineMutation(
  WorkoutService.createWorkout,
  {
    type: 'workout',
    action: 'create',
    onSuccess: () => showToast('Workout saved!', 'success'),
  }
);
```

### Real-time Updates

Subscribe to WebSocket events:

```typescript
import { useRealtimeMessages } from '@/hooks/use-websocket';

function ChatComponent() {
  useRealtimeMessages((message) => {
    console.log('New message:', message);
    // Auto-refresh handled by React Query
  });
}
```

### UI Components

Use themed components for automatic dark mode support:

```tsx
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { EmptyState } from '@/components/ui/empty-state';

<ThemedView style={styles.container}>
  <ThemedText type="title">Hello World</ThemedText>
  {isLoading && <LoadingSpinner />}
  {error && <ErrorMessage message={error.message} onRetry={refetch} />}
  {data.length === 0 && (
    <EmptyState
      icon="folder"
      title="No items"
      message="Get started by adding your first item"
    />
  )}
</ThemedView>
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
