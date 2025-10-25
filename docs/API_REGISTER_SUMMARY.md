# API Register Endpoint - Summary for Frontend Team

## Quick Reference

**Endpoint:** `POST /api/register`  
**Status:** ✅ Fully tested and working  
**Tests:** 23 tests passing (83 assertions)

---

## What You Need to Know

### 1. Request Format

```javascript
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### 2. Success Response (201 Created)

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

### 3. What to Do After Registration

```javascript
// 1. Store the token securely
await AsyncStorage.setItem('auth_token', data.token);

// 2. Check onboarding status
if (!data.user.onboarding_completed) {
  // Redirect to web onboarding (sales questions + payment)
  window.location.href = 'https://your-app.com/onboarding';
} else {
  // Navigate to dashboard (shouldn't happen for new users)
  navigateTo('/dashboard');
}
```

### 4. Using the Token

Include in all authenticated requests:

```javascript
fetch('/api/me', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/json',
  }
})
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| **name** | Required, max 255 characters |
| **email** | Required, valid email format, max 255 characters, must be unique |
| **password** | Required, minimum 8 characters, must be confirmed |
| **password_confirmation** | Required, must match password |

---

## Common Errors

### 422 Validation Error

```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

**Handle it:**
```javascript
if (response.status === 422) {
  const errors = data.errors;
  // Display errors to user
  Object.keys(errors).forEach(field => {
    showError(field, errors[field][0]);
  });
}
```

---

## Testing Checklist

The backend has been tested for:

- ✅ Successful registration with valid data
- ✅ Name validation (required, max 255 chars)
- ✅ Email validation (required, valid format, max 255 chars, unique)
- ✅ Password validation (required, min 8 chars, confirmed, matching)
- ✅ Password is hashed (never stored in plain text)
- ✅ Default role is set to 'member'
- ✅ Onboarding status is false for new users
- ✅ Sanctum token is created and returned
- ✅ Token can be used for authentication immediately
- ✅ Login endpoint works with registered credentials
- ✅ Logout endpoint revokes tokens
- ✅ `/api/me` endpoint returns user data with token

---

## Complete Documentation

For detailed documentation including:
- cURL examples
- React Native examples
- Error handling patterns
- Security considerations
- Troubleshooting guide

See: **`API_REGISTER_ENDPOINT.md`**

---

## Test Results

All 23 tests passing:

```
✓ it can register a new user
✓ registration requires name
✓ registration requires email
✓ registration requires valid email
✓ registration requires unique email
✓ registration requires password
✓ registration requires minimum password length
✓ registration requires password confirmation
✓ registration requires matching password confirmation
✓ registration hashes password
✓ registration sets default role to member
✓ registration sets onboarding completed to false
✓ registration creates sanctum token
✓ registration token can be used for authentication
✓ registration rejects name over 255 characters
✓ registration rejects email over 255 characters
✓ it can login with valid credentials
✓ login fails with invalid credentials
✓ login deletes old tokens
✓ it can logout
✓ logout requires authentication
✓ it can get current user
✓ get current user requires authentication
```

---

## Issues Fixed

During testing, we identified and fixed:

1. **SQLite compatibility** - Updated migrations to work with both PostgreSQL and SQLite
2. **User model relationship** - Added `streak()` singular relationship for API responses
3. **Sanctum installation** - Ensured Laravel Sanctum is properly installed

---

## Next Steps for Frontend

1. **Implement registration form** with client-side validation
2. **Handle success response** - Store token securely
3. **Redirect to web onboarding** - After successful registration
4. **Implement error handling** - Display validation errors to users
5. **Test with actual API** - Use the examples in `API_REGISTER_ENDPOINT.md`

---

## Support

If you encounter issues:

1. Check `API_REGISTER_ENDPOINT.md` for detailed examples
2. Check `FRONTEND_SPECIFICATION.md` for complete API documentation
3. Run tests locally: `php artisan test --filter=AuthControllerTest`
4. Contact backend team with specific error messages

---

**Created:** October 24, 2025  
**Backend:** Laravel 11 + Sanctum  
**Tests Location:** `tests/Feature/Api/AuthControllerTest.php`
