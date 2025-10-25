# API Register Endpoint Documentation

## Overview
This document provides comprehensive details about the `/api/register` endpoint to help frontend developers integrate user registration properly.

---

## Endpoint Details

**URL:** `/api/register`  
**Method:** `POST`  
**Authentication:** None (Public endpoint)  
**Content-Type:** `application/json`

---

## Request Format

### Required Fields

| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| `name` | string | Required, max 255 chars | User's full name |
| `email` | string | Required, valid email, max 255 chars, unique | User's email address |
| `password` | string | Required, min 8 chars, confirmed | User's password |
| `password_confirmation` | string | Required, must match password | Password confirmation |

### Example Request

```json
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### cURL Example

```bash
curl -X POST https://your-api.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### JavaScript/Fetch Example

```javascript
const response = await fetch('https://your-api.com/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    password_confirmation: 'password123',
  }),
});

const data = await response.json();

if (response.ok) {
  // Store token securely
  localStorage.setItem('auth_token', data.token);
  // Navigate based on onboarding status
  if (!data.user.onboarding_completed) {
    // Redirect to web onboarding
    window.location.href = 'https://your-app.com/onboarding';
  } else {
    // Navigate to dashboard
    window.location.href = '/dashboard';
  }
} else {
  // Handle validation errors
  console.error('Registration failed:', data.errors);
}
```

### React Native Example

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const register = async (name, email, password, passwordConfirmation) => {
  try {
    const response = await fetch('https://your-api.com/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token securely
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      
      return { success: true, data };
    } else {
      return { success: false, errors: data.errors };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

## Success Response

**Status Code:** `201 Created`

### Response Structure

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "onboarding_completed": false
  },
  "token": "1|abc123xyz789..."
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `user.id` | integer | Unique user identifier |
| `user.name` | string | User's full name |
| `user.email` | string | User's email address |
| `user.onboarding_completed` | boolean | Whether user has completed onboarding (always `false` for new registrations) |
| `token` | string | Sanctum API token for authentication |

### Important Notes

1. **Token Storage**: Store the token securely:
   - **Web**: Use `localStorage` or `sessionStorage` (be aware of XSS risks)
   - **Mobile**: Use secure storage (Keychain on iOS, Keystore on Android)
   - **Never** store tokens in plain text files or unsecured locations

2. **Onboarding Flow**: 
   - New users will have `onboarding_completed: false`
   - Frontend should redirect to web onboarding URL
   - After payment, users will access the mobile app inbox

3. **Token Usage**:
   - Include token in all authenticated requests
   - Header format: `Authorization: Bearer {token}`
   - Token name: `mobile-app`

---

## Error Responses

### Validation Errors

**Status Code:** `422 Unprocessable Entity`

```json
{
  "message": "The email has already been taken. (and 1 more error)",
  "errors": {
    "email": [
      "The email has already been taken."
    ],
    "password": [
      "The password field confirmation does not match."
    ]
  }
}
```

### Common Validation Errors

| Field | Error | Cause |
|-------|-------|-------|
| `name` | "The name field is required." | Missing name field |
| `name` | "The name field must not be greater than 255 characters." | Name too long |
| `email` | "The email field is required." | Missing email field |
| `email` | "The email field must be a valid email address." | Invalid email format |
| `email` | "The email has already been taken." | Email already registered |
| `email` | "The email field must not be greater than 255 characters." | Email too long |
| `password` | "The password field is required." | Missing password field |
| `password` | "The password field must be at least 8 characters." | Password too short |
| `password` | "The password field confirmation does not match." | Password confirmation doesn't match |

### Server Errors

**Status Code:** `500 Internal Server Error`

```json
{
  "message": "Server Error"
}
```

---

## Frontend Implementation Checklist

### Required Validations (Client-Side)

Before sending the request, validate:

- [ ] Name is not empty
- [ ] Name is 255 characters or less
- [ ] Email is not empty
- [ ] Email is valid format (use regex or validation library)
- [ ] Email is 255 characters or less
- [ ] Password is not empty
- [ ] Password is at least 8 characters
- [ ] Password confirmation matches password

### Example Validation (JavaScript)

```javascript
const validateRegistration = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (formData.name.length > 255) {
    errors.name = 'Name must be 255 characters or less';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  } else if (formData.email.length > 255) {
    errors.email = 'Email must be 255 characters or less';
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  // Password confirmation validation
  if (formData.password !== formData.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

### Error Handling

```javascript
const handleRegistrationError = (response, data) => {
  if (response.status === 422) {
    // Validation errors
    const errors = data.errors;
    
    // Display errors to user
    Object.keys(errors).forEach(field => {
      const errorMessages = errors[field];
      // Show error message for each field
      console.error(`${field}: ${errorMessages.join(', ')}`);
    });
  } else if (response.status === 500) {
    // Server error
    alert('An unexpected error occurred. Please try again later.');
  } else {
    // Other errors
    alert('Registration failed. Please try again.');
  }
};
```

### Post-Registration Flow

```javascript
const handleSuccessfulRegistration = async (data) => {
  // 1. Store token securely
  await secureStorage.setItem('auth_token', data.token);
  
  // 2. Store user data
  await secureStorage.setItem('user', JSON.stringify(data.user));
  
  // 3. Check onboarding status
  if (!data.user.onboarding_completed) {
    // Redirect to web onboarding (sales questions + payment)
    // This is typically a web URL that handles the full onboarding flow
    window.location.href = 'https://your-app.com/onboarding';
  } else {
    // This shouldn't happen for new registrations, but handle it
    navigateTo('/dashboard');
  }
};
```

---

## Security Considerations

### Password Requirements

- Minimum 8 characters (enforced by backend)
- Consider adding client-side recommendations:
  - Mix of uppercase and lowercase letters
  - Include numbers
  - Include special characters
  - Avoid common passwords

### HTTPS Only

- **Always** use HTTPS in production
- Never send credentials over HTTP
- Validate SSL certificates

### Token Security

- Store tokens in secure storage
- Never log tokens to console in production
- Clear tokens on logout
- Handle token expiration (401 responses)

### Rate Limiting

- Backend may implement rate limiting
- Handle 429 (Too Many Requests) responses
- Implement exponential backoff for retries

---

## Testing the Endpoint

### Manual Testing with cURL

```bash
# Successful registration
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Test validation error (missing name)
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Test duplicate email
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Another User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Using the Token

After registration, use the token for authenticated requests:

```bash
# Get current user
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer 1|abc123xyz789..." \
  -H "Accept: application/json"
```

---

## Common Issues & Troubleshooting

### Issue: "The email has already been taken"

**Cause:** Email is already registered in the system  
**Solution:** 
- Use a different email address
- If user forgot they registered, direct them to login
- Implement "forgot password" flow

### Issue: "The password field confirmation does not match"

**Cause:** `password` and `password_confirmation` don't match  
**Solution:**
- Ensure both fields have identical values
- Check for trailing spaces or case sensitivity issues

### Issue: 401 Unauthorized when using token

**Cause:** Token is invalid, expired, or malformed  
**Solution:**
- Verify token is correctly stored and retrieved
- Check Authorization header format: `Bearer {token}`
- Token may have been revoked (user logged out)
- Re-authenticate user

### Issue: CORS errors

**Cause:** Cross-Origin Resource Sharing not configured  
**Solution:**
- Backend must allow your frontend domain
- Check Laravel CORS configuration
- Ensure proper headers are sent

### Issue: Network request failed

**Cause:** Cannot reach API server  
**Solution:**
- Verify API URL is correct
- Check network connectivity
- Verify server is running
- Check firewall/security settings

---

## Backend Implementation Details

For reference, here's what happens on the backend:

1. **Validation**: Request is validated against rules
2. **User Creation**: New user record is created with:
   - Hashed password (using bcrypt)
   - Default role: `member`
   - `onboarding_completed_at`: `null`
3. **Token Generation**: Sanctum token is created with name `mobile-app`
4. **Response**: User data and token are returned

### Database Schema

```sql
users table:
- id (bigint, primary key)
- name (varchar 255)
- email (varchar 255, unique)
- password (varchar 255, hashed)
- role (varchar, default: 'member')
- onboarding_completed_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## Related Endpoints

After registration, users will typically use:

- **POST /api/login** - Login with credentials
- **GET /api/me** - Get current user profile
- **POST /api/logout** - Logout and revoke token

See `FRONTEND_SPECIFICATION.md` for complete API documentation.

---

## Support

If you encounter issues:

1. Check this documentation
2. Review `FRONTEND_SPECIFICATION.md`
3. Check backend logs for detailed error messages
4. Contact backend team with:
   - Request payload (remove sensitive data)
   - Response received
   - Expected behavior
   - Steps to reproduce

---

**Last Updated:** October 24, 2025  
**API Version:** 1.0  
**Backend:** Laravel 11 + Sanctum
