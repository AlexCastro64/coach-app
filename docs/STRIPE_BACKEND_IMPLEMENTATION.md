# Stripe Backend Implementation Guide

This guide provides example Laravel backend code for the Stripe integration.

## Installation

First, install the Stripe PHP SDK:

```bash
composer require stripe/stripe-php
```

## Environment Configuration

Add to your `.env`:

```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Routes

Add to `routes/api.php`:

```php
// Subscription routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/subscription/checkout/create', [SubscriptionController::class, 'createCheckoutSession']);
    Route::get('/subscription/checkout/verify/{sessionId}', [SubscriptionController::class, 'verifyCheckoutSession']);
});

// Webhook route (no auth middleware)
Route::post('/webhooks/stripe', [WebhookController::class, 'handleStripe']);
```

## Controller: SubscriptionController

Create `app/Http/Controllers/SubscriptionController.php`:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a Stripe Checkout Session
     */
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'successUrl' => 'required|string',
            'cancelUrl' => 'required|string',
            'priceId' => 'nullable|string',
        ]);

        try {
            $user = $request->user();

            // Use provided price ID or default
            $priceId = $request->priceId ?? config('services.stripe.default_price_id');

            // Create Stripe Checkout Session
            $session = Session::create([
                'customer_email' => $user->email,
                'client_reference_id' => (string) $user->id,
                'line_items' => [[
                    'price' => $priceId,
                    'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'success_url' => $request->successUrl,
                'cancel_url' => $request->cancelUrl,
                'metadata' => [
                    'user_id' => $user->id,
                ],
            ]);

            return response()->json([
                'sessionId' => $session->id,
                'url' => $session->url,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create checkout session: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify a Stripe Checkout Session
     */
    public function verifyCheckoutSession(Request $request, string $sessionId)
    {
        try {
            $user = $request->user();

            // Retrieve the session from Stripe
            $session = Session::retrieve($sessionId);

            // Verify the session belongs to this user
            if ($session->client_reference_id !== (string) $user->id) {
                return response()->json([
                    'message' => 'Session does not belong to this user',
                ], 403);
            }

            // Verify payment was successful
            if ($session->payment_status !== 'paid') {
                return response()->json([
                    'message' => 'Payment not completed',
                ], 400);
            }

            // Update user subscription in database
            $user->subscriptions()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'stripe_customer_id' => $session->customer,
                    'stripe_subscription_id' => $session->subscription,
                    'tier' => 'basic', // or determine from price ID
                    'status' => 'active',
                    'current_period_start' => now(),
                    'current_period_end' => now()->addMonth(),
                ]
            );

            return response()->json([
                'success' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to verify session: ' . $e->getMessage(),
            ], 500);
        }
    }
}
```

## Controller: WebhookController

Create `app/Http/Controllers/WebhookController.php`:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Webhook;
use App\Models\User;

class WebhookController extends Controller
{
    /**
     * Handle Stripe webhook events
     */
    public function handleStripe(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $this->handleCheckoutCompleted($event->data->object);
                break;

            case 'customer.subscription.updated':
                $this->handleSubscriptionUpdated($event->data->object);
                break;

            case 'customer.subscription.deleted':
                $this->handleSubscriptionDeleted($event->data->object);
                break;

            default:
                // Unexpected event type
                return response()->json(['error' => 'Unexpected event type'], 400);
        }

        return response()->json(['success' => true]);
    }

    private function handleCheckoutCompleted($session)
    {
        $userId = $session->client_reference_id;
        $user = User::find($userId);

        if (!$user) {
            \Log::error('User not found for checkout session', ['user_id' => $userId]);
            return;
        }

        // Update or create subscription
        $user->subscriptions()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'stripe_customer_id' => $session->customer,
                'stripe_subscription_id' => $session->subscription,
                'tier' => 'basic',
                'status' => 'active',
                'current_period_start' => now(),
                'current_period_end' => now()->addMonth(),
            ]
        );

        \Log::info('Subscription activated', ['user_id' => $userId]);
    }

    private function handleSubscriptionUpdated($subscription)
    {
        $userSubscription = \App\Models\Subscription::where(
            'stripe_subscription_id',
            $subscription->id
        )->first();

        if ($userSubscription) {
            $userSubscription->update([
                'status' => $subscription->status,
                'current_period_start' => date('Y-m-d H:i:s', $subscription->current_period_start),
                'current_period_end' => date('Y-m-d H:i:s', $subscription->current_period_end),
                'cancel_at_period_end' => $subscription->cancel_at_period_end,
            ]);
        }
    }

    private function handleSubscriptionDeleted($subscription)
    {
        $userSubscription = \App\Models\Subscription::where(
            'stripe_subscription_id',
            $subscription->id
        )->first();

        if ($userSubscription) {
            $userSubscription->update([
                'status' => 'cancelled',
            ]);
        }
    }
}
```

## Configuration

Add to `config/services.php`:

```php
'stripe' => [
    'secret' => env('STRIPE_SECRET_KEY'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    'default_price_id' => env('STRIPE_DEFAULT_PRICE_ID', 'price_1234567890'),
],
```

## Database Migration

Create a migration for subscriptions if not exists:

```bash
php artisan make:migration add_stripe_fields_to_subscriptions_table
```

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('stripe_customer_id')->nullable()->after('user_id');
            $table->string('stripe_subscription_id')->nullable()->after('stripe_customer_id');
        });
    }

    public function down()
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['stripe_customer_id', 'stripe_subscription_id']);
        });
    }
};
```

## Middleware Exception

Add to `app/Http/Middleware/VerifyCsrfToken.php`:

```php
protected $except = [
    'api/webhooks/stripe',
];
```

## Testing

1. Create a product and price in Stripe Dashboard
2. Update `STRIPE_DEFAULT_PRICE_ID` in `.env`
3. Test with Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:8000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

## Production Checklist

- [ ] Switch to live API keys
- [ ] Configure webhook endpoint in Stripe Dashboard
- [ ] Verify webhook signature validation
- [ ] Set up monitoring for failed webhooks
- [ ] Test subscription lifecycle (create, update, cancel)
- [ ] Implement proper error handling and logging
