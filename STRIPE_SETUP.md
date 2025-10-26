# Stripe Checkout Setup - Quick Start

## What Was Implemented

✅ **Frontend Changes**:
- Created `services/subscription.service.ts` for Stripe API calls
- Updated `app/onboarding/payment.tsx` to integrate Stripe Checkout
- Added deep linking support for return from Stripe
- Added Stripe configuration to `.env.example`

✅ **Documentation**:
- `docs/STRIPE_INTEGRATION.md` - Complete integration guide
- `docs/STRIPE_BACKEND_IMPLEMENTATION.md` - Backend code examples

## How It Works

1. User clicks "Start Your Transformation" on payment page
2. App creates checkout session via your backend API
3. Stripe Checkout opens in browser
4. User completes payment
5. Stripe redirects back to app with session ID
6. App verifies payment and completes onboarding
7. User is redirected to inbox

## Setup Steps

### 1. Frontend Setup (Already Done ✅)

The frontend is ready! Just add your Stripe key to `.env`:

```bash
cp .env.example .env
# Edit .env and add:
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 2. Backend Setup (You Need To Do)

Your Laravel backend needs these endpoints:

**Required Endpoints**:
- `POST /api/subscription/checkout/create` - Creates Stripe checkout session
- `GET /api/subscription/checkout/verify/{sessionId}` - Verifies payment

**Optional But Recommended**:
- `POST /api/webhooks/stripe` - Handles Stripe webhooks

See `docs/STRIPE_BACKEND_IMPLEMENTATION.md` for complete Laravel code examples.

### 3. Stripe Account Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from https://dashboard.stripe.com/test/apikeys
3. Create a product and price in the Stripe Dashboard
4. Note the Price ID (starts with `price_`)

### 4. Configuration

**Frontend** (`.env`):
```bash
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Backend** (`.env`):
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_DEFAULT_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_... # For webhooks
```

## Testing

See **`TESTING_STRIPE.md`** for complete testing instructions.

Quick test:
1. Use Stripe test mode keys (start with `pk_test_` and `sk_test_`)
2. Click "Start Your Transformation" on payment page
3. Browser should open with Stripe Checkout
4. Test card: `4242 4242 4242 4242`
5. Complete payment and verify redirect back to app

Test backend directly:
```bash
./scripts/test-stripe-checkout.sh
```

## What Happens After Payment

The onboarding loop issue will be fixed because:

1. After successful payment, the app calls `UserService.completeOnboarding()`
2. This updates the user's `onboarding_completed` flag in the database
3. The app then refreshes user data with `refreshUser()`
4. Finally navigates to inbox with `router.replace('/(tabs)/inbox')`

The key is that the backend must properly update the user's onboarding status when the checkout session is verified.

## Troubleshooting

**Issue**: "Failed to create checkout session"
- Check that backend endpoint is implemented
- Verify API URL in `.env` is correct
- Check backend logs for errors

**Issue**: Payment succeeds but stuck in onboarding
- Verify `/user/onboarding/complete` endpoint works
- Check that it updates `onboarding_completed` to `true`
- Ensure `refreshUser()` fetches updated user data

**Issue**: Browser doesn't open
- Verify `expo-web-browser` is installed (already in package.json)
- Check console logs for errors

## Next Steps

1. **Implement backend endpoints** - See `docs/STRIPE_BACKEND_IMPLEMENTATION.md`
2. **Get Stripe API keys** - From Stripe Dashboard
3. **Configure environment variables** - Both frontend and backend
4. **Test the flow** - Use test cards
5. **Set up webhooks** - For production reliability

## Need Help?

- Frontend docs: `docs/STRIPE_INTEGRATION.md`
- Backend examples: `docs/STRIPE_BACKEND_IMPLEMENTATION.md`
- Stripe docs: https://stripe.com/docs/checkout
- Stripe test cards: https://stripe.com/docs/testing
