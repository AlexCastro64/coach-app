# API Setup Guide

This guide explains how to connect the Coach mobile app to your Laravel backend API.

## Quick Start

### 1. Configure API URL

Copy the example environment file and configure your API URL:

```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:

```bash
# For local Laravel development server
EXPO_PUBLIC_API_URL=http://localhost:8000/api

# For Docker/Nginx on port 80
EXPO_PUBLIC_API_URL=http://localhost/api

# For Android emulator (special localhost)
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api

# For physical devices (use your computer's IP)
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api
```

### 2. Start Your Backend

Make sure your Laravel backend is running:

```bash
# Standard Laravel development server
cd /path/to/backend
php artisan serve

# Or with Docker
docker-compose up -d
```

### 3. Create Test User

Run the reset-data script to create a test user:

```bash
npm run reset-data
```

This will create a test user with:
- **Email:** test@test.com
- **Password:** 11111111

### 4. Start the App

```bash
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

## API Configuration Details

### Environment Variables

The app uses `EXPO_PUBLIC_API_URL` to configure the backend API endpoint. This variable is:

- Defined in `.env` file (not committed to git)
- Accessed via `process.env.EXPO_PUBLIC_API_URL`
- Used by the `apiClient` service

### API Client

The app uses Axios for HTTP requests with automatic:

- **Authentication:** Bearer token automatically added to requests
- **Token Management:** Stored securely using `expo-secure-store`
- **Error Handling:** 401 responses automatically clear invalid tokens
- **Timeout:** 30 second timeout for all requests

See `services/api.client.ts` for implementation details.

## Authentication Flow

### Registration

1. User fills out registration form (`app/register.tsx`)
2. App calls `AuthService.register()` with credentials
3. Backend validates and creates user
4. Backend returns user object and JWT token
5. Token is saved to secure storage
6. User is automatically logged in

### Login

1. User enters email and password (`app/login.tsx`)
2. App calls `AuthService.login()` with credentials
3. Backend validates credentials
4. Backend returns user object and JWT token
5. Token is saved to secure storage
6. User is redirected to main app

### Token Storage

Tokens are stored securely using `expo-secure-store`:

```typescript
// Save token
await TokenService.saveToken(token);

// Get token
const token = await TokenService.getToken();

// Remove token (logout)
await TokenService.removeToken();
```

## API Endpoints

The app expects these endpoints from your Laravel backend:

### Auth Endpoints

- `POST /api/register` - Register new user
  - Body: `{ name, email, password, password_confirmation }`
  - Returns: `{ user, token }`

- `POST /api/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ user, token }`

- `POST /api/logout` - Logout user
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ message }`

- `GET /api/me` - Get current user
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ id, name, email, ... }`

### Future Endpoints (Planned)

- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message
- `POST /api/meals` - Upload meal photo
- `GET /api/workouts` - Get workouts
- `POST /api/workouts` - Log workout

## Troubleshooting

### Cannot Connect to Backend

**Problem:** App shows "Connection Error" or "Network Error"

**Solutions:**

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Check API URL in .env:**
   - Make sure `EXPO_PUBLIC_API_URL` is correct
   - Restart Expo dev server after changing .env

3. **For Android Emulator:**
   - Use `http://10.0.2.2:8000/api` instead of `localhost`
   - Android emulator's localhost points to the emulator, not your computer

4. **For Physical Devices:**
   - Use your computer's IP address (e.g., `http://192.168.1.100:8000/api`)
   - Make sure device and computer are on same WiFi network
   - Check firewall isn't blocking connections

### Registration Fails with 422 Error

**Problem:** "User already exists" or validation errors

**Solutions:**

1. **User already exists:**
   - Try logging in instead
   - Or use a different email address

2. **Password too short:**
   - Password must be at least 8 characters

3. **Passwords don't match:**
   - Make sure password and confirmation match

### Token Expired or Invalid

**Problem:** App shows "Unauthorized" or automatically logs out

**Solutions:**

1. **Token expired:**
   - Login again to get a new token
   - Check backend token expiration settings

2. **Clear stored token:**
   ```bash
   # Uninstall and reinstall app
   # Or use device settings to clear app data
   ```

### CORS Errors (Web Only)

**Problem:** Browser shows CORS policy errors

**Solutions:**

1. **Configure Laravel CORS:**
   ```php
   // config/cors.php
   'paths' => ['api/*'],
   'allowed_origins' => ['*'],
   'allowed_methods' => ['*'],
   'allowed_headers' => ['*'],
   ```

2. **Install Laravel CORS package:**
   ```bash
   composer require fruitcake/laravel-cors
   ```

## Development Tips

### Testing API Calls

Use the reset-data script to test API connectivity:

```bash
npm run reset-data
```

This will:
- Show the API URL being used
- Attempt to create a test user
- Display detailed error messages if it fails

### Viewing API Requests

Enable Axios logging in development:

```typescript
// In services/api.client.ts
this.client.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

this.client.interceptors.response.use((response) => {
  console.log('API Response:', response.status, response.config.url);
  return response;
});
```

### Clearing App Data

To start fresh:

```bash
# Option 1: Logout in app
# Option 2: Uninstall and reinstall
# Option 3: Clear app data in device settings
```

## Security Notes

1. **Never commit .env file** - It's in .gitignore
2. **Use HTTPS in production** - HTTP is only for local development
3. **Tokens are stored securely** - Using expo-secure-store
4. **Validate all inputs** - Both frontend and backend
5. **Use strong passwords** - Minimum 8 characters

## Next Steps

1. ✅ Configure `.env` with your API URL
2. ✅ Start your backend server
3. ✅ Run `npm run reset-data` to create test user
4. ✅ Start the app with `npm start`
5. ✅ Test registration and login
6. 🔄 Implement additional API endpoints as needed

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the console logs in Expo dev tools
3. Check your backend logs
4. Verify API endpoints are working with Postman/curl
