# Authentication Implementation

This document describes the authentication implementation for the Coach App.

## Overview

The app uses token-based authentication with the Laravel backend. Tokens are stored securely using Expo SecureStore (iOS Keychain / Android Keystore).

## Architecture

### Components

1. **Authentication Types** (`types/auth.ts`)
   - `User`: User profile interface
   - `AuthResponse`: Login/register response
   - `LoginCredentials`: Login payload
   - `RegisterCredentials`: Registration payload
   - `AuthContextType`: Auth context interface

2. **Token Service** (`services/token.service.ts`)
   - Secure token storage using Expo SecureStore
   - Methods: `saveToken()`, `getToken()`, `removeToken()`, `hasToken()`

3. **API Client** (`services/api.client.ts`)
   - Axios-based HTTP client
   - Automatic token injection via interceptors
   - Handles 401 responses (token expiry)

4. **Auth Service** (`services/auth.service.ts`)
   - `register()`: Create new user account
   - `login()`: Authenticate user
   - `logout()`: End user session
   - `getCurrentUser()`: Fetch current user profile
   - `isAuthenticated()`: Check auth status

5. **Auth Context** (`contexts/AuthContext.tsx`)
   - Global authentication state management
   - Provides auth methods to the entire app
   - Auto-initializes on app launch

6. **Auth Screens**
   - `app/login.tsx`: Login screen
   - `app/register.tsx`: Registration screen

7. **Protected Routes** (`app/_layout.tsx`)
   - Auth guards redirect unauthenticated users to login
   - Authenticated users redirected to tabs

## Setup

### 1. Environment Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Update the API URL in `.env`:

```env
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
```

### 2. Backend Requirements

The backend must implement these endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout (authenticated)
- `GET /api/me` - Get current user (authenticated)

### 3. Dependencies

The following packages are required (already installed):

- `expo-secure-store`: Secure token storage
- `axios`: HTTP client

## Usage

### Using the Auth Hook

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Check if user is logged in
  if (!isAuthenticated) {
    return <Text>Please log in</Text>;
  }

  // Display user info
  return <Text>Welcome, {user.name}!</Text>;
}
```

### Login Flow

1. User opens app
2. If not authenticated, redirected to `/login`
3. User enters credentials
4. `login()` is called, which:
   - Sends credentials to `/api/login`
   - Receives token and user data
   - Stores token securely
   - Updates auth context
5. User is redirected to `/(tabs)` (home)

### Register Flow

1. User taps "Sign up" on login screen
2. Navigates to `/register`
3. User fills in name, email, password, password confirmation
4. `register()` is called, which:
   - Sends data to `/api/register`
   - Receives token and user data
   - Stores token securely
   - Updates auth context
5. User is redirected to tabs or onboarding (based on `onboarding_completed`)

### Logout Flow

1. User taps "Logout" button
2. Confirmation alert shown
3. `logout()` is called, which:
   - Calls `/api/logout` endpoint
   - Removes token from secure storage
   - Clears auth context
4. User is redirected to `/login`

## Security

### Token Storage

- Tokens are stored in Expo SecureStore
- iOS: Uses Keychain
- Android: Uses Keystore
- Web: Falls back to encrypted localStorage (not recommended for production)

### API Security

- All authenticated requests include `Authorization: Bearer {token}` header
- 401 responses automatically clear invalid tokens
- HTTPS should be used in production

### Validation

- Email format validation
- Password minimum length (8 characters)
- Password confirmation matching
- User-friendly error messages

## Onboarding Integration

After registration or login, the app checks `user.onboarding_completed`:

- `false`: User should complete web-based onboarding + payment
- `true`: User can access the app normally

Currently, users are redirected to tabs regardless. In production, you should:

1. Check `onboarding_completed` in `app/_layout.tsx`
2. Open web onboarding URL in browser if `false`
3. Redirect to tabs only after completion

## Error Handling

### Network Errors

- Display user-friendly error messages
- Retry logic in API client (can be enhanced)

### Token Expiry

- Automatically detected via 401 responses
- Token is cleared
- User is redirected to login

### Validation Errors

- Client-side validation before API calls
- Server errors displayed via alerts

## Testing

### Manual Testing

1. **Registration**
   - Open app
   - Tap "Sign up"
   - Fill in valid credentials
   - Verify account creation and auto-login

2. **Login**
   - Logout if logged in
   - Enter valid credentials
   - Verify successful login and navigation

3. **Logout**
   - Tap logout button
   - Confirm logout
   - Verify redirect to login screen

4. **Protected Routes**
   - Logout
   - Try to access `/(tabs)` directly
   - Verify redirect to login

5. **Token Persistence**
   - Login
   - Close app completely
   - Reopen app
   - Verify user is still logged in

### Unit Testing

Consider adding tests for:

- `TokenService` methods
- `AuthService` methods
- Auth context state changes
- Navigation guards

## Future Enhancements

1. **Forgot Password**: Add password reset flow
2. **Email Verification**: Verify email addresses
3. **Biometric Auth**: Add Face ID / Touch ID support
4. **Refresh Tokens**: Implement token refresh mechanism
5. **Social Login**: Add OAuth (Google, Apple, etc.)
6. **Multi-device Management**: Track active sessions
7. **2FA**: Two-factor authentication

## Troubleshooting

### "Network Error"

- Check `EXPO_PUBLIC_API_URL` in `.env`
- Verify backend is running
- Check network connectivity

### "401 Unauthorized"

- Token may be expired
- Try logging in again
- Check backend authentication logic

### "SecureStore not available"

- Expo SecureStore requires a native runtime
- Use Expo Go or build a development client
- Not supported in web without polyfill

## API Reference

See `FRONTEND_SPECIFICATION.md` for complete API documentation.

## File Structure

```
/coach-app
├── types/
│   └── auth.ts                 # Authentication types
├── services/
│   ├── token.service.ts       # Token storage
│   ├── api.client.ts          # HTTP client
│   └── auth.service.ts        # Auth API calls
├── contexts/
│   └── AuthContext.tsx        # Auth state management
├── app/
│   ├── _layout.tsx            # Root layout with auth guards
│   ├── login.tsx              # Login screen
│   ├── register.tsx           # Register screen
│   └── (tabs)/
│       └── index.tsx          # Home screen (protected)
├── .env.example               # Environment template
└── AUTHENTICATION.md          # This file
```
