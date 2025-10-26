# Testing Stripe Checkout Integration

## ✅ Current Status

Your setup is ready:
- ✅ Frontend code implemented
- ✅ Backend endpoints created
- ✅ `.env` file configured
- ✅ Enhanced logging added

## 🧪 Testing Steps

### Step 1: Verify Backend is Running

Make sure your Laravel backend is running and accessible at `http://localhost/api`

```bash
# Test if backend is reachable
curl http://localhost/api/health
```

### Step 2: Start the App

```bash
npm start
```

### Step 3: Test the Flow

1. **Open the app** on your device/simulator
2. **Navigate to** the onboarding payment page
3. **Click** "Start Your Transformation"
4. **Watch the console** for these logs:

```
🚀 handleSubscribe called
📱 Redirect URLs: { ... }
🔄 Calling backend to create checkout session...
API Request: POST /subscription/checkout/create
API Response: 200 /subscription/checkout/create
✅ Checkout session created: { sessionId: '...', url: '...' }
🌐 Opening Stripe checkout URL: https://checkout.stripe.com/...
```

5. **Browser should open** with Stripe Checkout page
6. **Complete payment** using test card: `4242 4242 4242 4242`
7. **Browser should redirect** back to the app
8. **App should navigate** to inbox

## 🔍 What to Look For

### Success Indicators

- ✅ Console shows "Checkout session created"
- ✅ Browser opens with Stripe page
- ✅ After payment, redirects back to app
- ✅ App navigates to inbox
- ✅ User's onboarding is marked complete

### Common Issues

#### Issue 1: "Failed to create checkout session"

**Console shows:**
```
❌ Payment error: Failed to create checkout session
Error details: { status: 500, ... }
```

**Solutions:**
- Check backend logs for errors
- Verify Stripe is configured in backend `.env`
- Ensure you have a valid Stripe Price ID
- Check that backend endpoint returns correct format:
  ```json
  {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
  ```

#### Issue 2: "Network Error"

**Console shows:**
```
API Network Error: No response received
```

**Solutions:**
- Verify backend is running
- Check `EXPO_PUBLIC_API_URL` in `.env`
- For Android emulator, use `http://10.0.2.2/api`
- For physical device, use your computer's IP

#### Issue 3: Browser doesn't open

**Console shows:**
```
✅ Checkout session created
🌐 Opening Stripe checkout URL: https://...
```
But browser doesn't open.

**Solutions:**
- Restart the Expo dev server
- Try on a different device/simulator
- Check if `expo-web-browser` is installed

#### Issue 4: Payment succeeds but stuck in onboarding

**After completing payment, app doesn't navigate to inbox.**

**Solutions:**
- Check that `/subscription/checkout/verify/{sessionId}` endpoint works
- Verify `/user/onboarding/complete` endpoint updates the database
- Check console for errors in the useEffect hook
- Ensure `refreshUser()` fetches updated user data

## 🛠️ Manual Testing Script

You can test the backend endpoint directly:

```bash
./scripts/test-stripe-checkout.sh
```

This will help you verify the backend is working before testing in the app.

## 📊 Expected API Flow

### 1. Create Checkout Session

**Request:**
```http
POST /api/subscription/checkout/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "successUrl": "coachapp://onboarding/payment?success=true&session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "coachapp://onboarding/payment?success=false"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6",
  "url": "https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4e5f6"
}
```

### 2. User Completes Payment on Stripe

Stripe redirects to:
```
coachapp://onboarding/payment?success=true&session_id=cs_test_a1b2c3d4e5f6
```

### 3. Verify Checkout Session

**Request:**
```http
GET /api/subscription/checkout/verify/cs_test_a1b2c3d4e5f6
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true
}
```

### 4. Complete Onboarding

**Request:**
```http
POST /api/user/onboarding/complete
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "onboarding_completed": true,
  ...
}
```

## 🎯 Quick Checklist

Before testing, verify:

- [ ] Backend is running
- [ ] Stripe is configured in backend (API keys, Price ID)
- [ ] `.env` has correct `EXPO_PUBLIC_API_URL`
- [ ] App is running (`npm start`)
- [ ] You're logged in to the app
- [ ] You can reach the payment page

## 🐛 Debug Mode

For extra debugging, check these logs:

1. **Frontend Console** (Expo dev tools)
   - Look for emoji logs: 🚀 🔄 ✅ ❌
   - Check API request/response logs

2. **Backend Logs** (Laravel)
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Network Tab** (if using web)
   - Open browser dev tools
   - Check Network tab for API calls

## 📞 Need Help?

If you're still stuck:

1. Share the console logs (especially the error details)
2. Check backend logs for errors
3. Verify Stripe dashboard for any issues
4. Test the backend endpoint directly with the test script

## 🎉 Success!

When everything works, you should see:

1. Button click → Console logs → Browser opens
2. Stripe checkout page loads
3. Enter test card → Complete payment
4. Redirect back to app
5. Navigate to inbox
6. Onboarding complete! 🎊
