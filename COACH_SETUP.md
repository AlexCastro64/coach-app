# Coach Mobile App - Setup Guide

This mobile app provides a chat interface to communicate with your Coach backend.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Coach backend running (from AlexCastro64/Coach repository)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your backend URL:
   ```
   EXPO_PUBLIC_API_URL=http://your-backend-url:3000
   ```

## Connecting to the Backend

### Backend API Configuration

The app expects the following API endpoints from your Coach backend:

1. **Send Message** (POST `/api/chat`)
   - Request body:
     ```json
     {
       "content": "user message",
       "sessionId": "optional-session-id"
     }
     ```
   - Response:
     ```json
     {
       "message": {
         "id": "message-id",
         "content": "coach response",
         "role": "coach",
         "timestamp": "2025-10-22T12:00:00Z"
       },
       "sessionId": "session-id"
     }
     ```

2. **Get Chat History** (GET `/api/chat/:sessionId`)
   - Response:
     ```json
     {
       "messages": [
         {
           "id": "message-id",
           "content": "message content",
           "role": "user|coach",
           "timestamp": "2025-10-22T12:00:00Z"
         }
       ]
     }
     ```

### Updating the API Service

The API service is located in `/services/coach-api.ts`. Currently, it uses a mock function for testing. To connect to your actual backend:

1. Make sure your backend is running and accessible
2. Update the `EXPO_PUBLIC_API_URL` in your `.env` file
3. In `/app/(tabs)/chat.tsx`, uncomment the real API call and comment out the mock:

   ```typescript
   // Change from:
   const coachResponse = await coachAPI.sendMessageMock(content);

   // To:
   const response = await coachAPI.sendMessage({
     content,
     sessionId: sessionId || undefined,
   });
   setSessionId(response.sessionId);
   setMessages((prev) => [...prev, response.message]);
   ```

## Running the App

Start the development server:

```bash
npm start
```

Then choose your platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser
- Scan the QR code with Expo Go app on your physical device

## Features

- Real-time chat interface with the Coach
- Message history
- Dark mode support
- Responsive design for iOS and Android
- Loading and error states
- Session management

## Customization

### Styling

- Update colors and themes in `/constants/theme.ts`
- Modify chat bubble styles in `/components/chat/chat-message.tsx`
- Customize input styles in `/components/chat/message-input.tsx`

### API Integration

- API service: `/services/coach-api.ts`
- Type definitions: `/types/chat.ts`
- Chat screen: `/app/(tabs)/chat.tsx`

## Troubleshooting

### Cannot connect to backend

1. Ensure your backend is running
2. Check that the URL in `.env` is correct
3. For iOS simulator, use `http://localhost:3000`
4. For Android emulator, use `http://10.0.2.2:3000` (Android's special alias for localhost)
5. For physical devices, use your computer's local IP address (e.g., `http://192.168.1.100:3000`)

### Messages not sending

1. Check the browser/device console for error messages
2. Verify the backend API is responding correctly
3. Check that the request/response format matches the expected schema

## Next Steps

1. Connect to your Coach backend by updating the `.env` file
2. Update the API calls in `chat.tsx` to use real endpoints
3. Test the chat functionality
4. Customize the UI to match your branding
5. Add additional features like:
   - Message persistence
   - User authentication
   - File uploads
   - Voice messages
   - Push notifications

## Support

For issues with the mobile app, check the logs in the Expo dev tools.
For backend issues, refer to the AlexCastro64/Coach repository documentation.
