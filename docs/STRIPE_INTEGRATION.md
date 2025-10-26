# Stripe Integration Guide

This document explains how the Stripe checkout integration works in the coach app.

## Overview

The app uses Stripe Checkout for subscription payments during onboarding. The flow is:

1. User clicks "Start Your Transformation" on the payment page
2. App creates a Stripe Checkout session via backend API
3. App opens Stripe Checkout in a browser
4. User completes payment on Stripe
5. Stripe redirects back to the app with session ID
6. App verifies the payment and completes onboarding

## Frontend Implementation

### Files Modified

- **`app/onboarding/payment.tsx`**: Payment page with Stripe checkout integration
- **`services/subscription.service.ts`**: Service for Stripe API calls
- **`.env.example`**: Added Stripe publishable key configuration

### Key Features

1. **Deep Linking**: Uses `expo-linking` to create return URLs that bring users back to the app
2. **Browser Integration**: Uses `expo-web-browser` to open Stripe Checkout
3. **Session Verification**: Verifies checkout session with backend before completing onboarding
4. **Error Handling**: Handles cancelled payments and errors gracefully

## Backend Requirements

Your Laravel backend needs to implement these endpoints:

### 1. Create Checkout Session

**Endpoint**: `POST /api/subscription/checkout/create`

**Request Body**:
```json
{
  "priceId": "price_xxx", // Optional: Stripe Price ID
  "successUrl": "myapp://onboarding/payment?success=true&session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "myapp://onboarding/payment?success=false"
}
```

**Response**:
```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx"
}
```

**Implementation Notes**:
- Create a Stripe Checkout Session using the Stripe PHP SDK
- Use the provided `successUrl` and `cancelUrl` for redirects
- The `{CHECKOUT_SESSION_ID}` placeholder will be replaced by Stripe
- Return the session ID and checkout URL

### 2. Verify Checkout Session

**Endpoint**: `GET /api/subscription/checkout/verify/{sessionId}`

**Response**:
```json
{
  "success": true
}
```

**Implementation Notes**:
- Retrieve the Stripe session using the session ID
- Verify the payment status is "paid"
- Update the user's subscription in your database
- Return success status

### 3. Complete Onboarding (Already Implemented)

**Endpoint**: `POST /api/user/onboarding/complete`

**Response**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "onboarding_completed": true,
  ...
}
```

## Environment Variables

### Frontend (.env)

```bash
# Stripe publishable key (use test key for development)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Backend (.env)

```bash
# Stripe secret key (use test key for development)
STRIPE_SECRET_KEY=sk_test_your_key_here

# Stripe webhook secret (for webhook verification)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Testing

### Test Mode

1. Get test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Use test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires authentication: `4000 0025 0000 3155`

### Testing Flow

1. Start the app and go through onboarding
2. On the payment page, click "Start Your Transformation"
3. Browser should open with Stripe Checkout
4. Enter test card details
5. Complete payment
6. Should redirect back to app and navigate to inbox

## Webhooks (Recommended)

For production, implement Stripe webhooks to handle:

- `checkout.session.completed`: Confirm payment and activate subscription
- `customer.subscription.updated`: Handle subscription changes
- `customer.subscription.deleted`: Handle cancellations

**Webhook Endpoint**: `POST /api/webhooks/stripe`

## Security Notes

1. **Never expose secret keys**: Only use publishable keys in the frontend
2. **Verify sessions**: Always verify checkout sessions on the backend
3. **Use webhooks**: Don't rely solely on client-side confirmation
4. **HTTPS required**: Stripe requires HTTPS for production webhooks

## Troubleshooting

### Issue: Browser doesn't open

- Check that `expo-web-browser` is installed
- Verify the checkout URL is valid
- Check console logs for errors

### Issue: Redirect doesn't work

- Verify deep linking is configured in `app.json`
- Check that the URL scheme matches your app
- Test the redirect URLs manually

### Issue: Payment succeeds but onboarding doesn't complete

- Check backend logs for verification errors
- Verify the session ID is being passed correctly
- Ensure the `/user/onboarding/complete` endpoint works

## Next Steps

1. Implement the backend endpoints
2. Configure Stripe account and get API keys
3. Test the full flow with test cards
4. Set up webhooks for production
5. Switch to live keys when ready to launch
