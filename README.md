# Welcome to your Expo app

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

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

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
