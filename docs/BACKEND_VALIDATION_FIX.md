# Backend Validation Fix for Custom URL Schemes

## Problem

Laravel's default `url` validation rule doesn't accept custom URL schemes like `coachapp://`, which are needed for deep linking in mobile apps.

## Error

```
The success url field must be a valid URL.
```

## Solution

Update your Laravel validation in `SubscriptionController.php`:

### Option 1: Accept Any String (Simple)

```php
public function createCheckoutSession(Request $request)
{
    $request->validate([
        'success_url' => 'required|string',  // Changed from 'url'
        'cancel_url' => 'required|string',   // Changed from 'url'
        'price_id' => 'nullable|string',
    ]);

    // ... rest of your code
}
```

### Option 2: Custom Regex Validation (More Secure)

```php
public function createCheckoutSession(Request $request)
{
    $request->validate([
        'success_url' => ['required', 'string', 'regex:/^(https?|coachapp):\/\/.+/'],
        'cancel_url' => ['required', 'string', 'regex:/^(https?|coachapp):\/\/.+/'],
        'price_id' => 'nullable|string',
    ]);

    // ... rest of your code
}
```

This regex allows:
- `http://` URLs
- `https://` URLs
- `coachapp://` URLs (your app's custom scheme)

### Option 3: Custom Validation Rule (Most Flexible)

Create a custom validation rule:

```bash
php artisan make:rule ValidRedirectUrl
```

```php
<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ValidRedirectUrl implements Rule
{
    public function passes($attribute, $value)
    {
        // Allow http, https, and custom app schemes
        return preg_match('/^(https?|[a-z][a-z0-9+.-]*):\/\/.+/i', $value);
    }

    public function message()
    {
        return 'The :attribute must be a valid URL or deep link.';
    }
}
```

Then use it:

```php
use App\Rules\ValidRedirectUrl;

public function createCheckoutSession(Request $request)
{
    $request->validate([
        'success_url' => ['required', new ValidRedirectUrl],
        'cancel_url' => ['required', new ValidRedirectUrl],
        'price_id' => 'nullable|string',
    ]);

    // ... rest of your code
}
```

## Why This Is Needed

Mobile apps use custom URL schemes (like `coachapp://`) for deep linking. When Stripe redirects after payment, it needs to use this custom scheme to bring the user back to your app.

The URL format will be:
```
coachapp://onboarding/payment?success=true&session_id=cs_test_...
```

Laravel's default `url` validation only accepts `http://` and `https://` schemes, so we need to customize it.

## Recommended Approach

Use **Option 2** (regex validation) as it provides a good balance between security and flexibility. It explicitly allows your app's custom scheme while still validating the URL structure.

## After Fixing

Once you update the backend validation, the checkout flow will work:

1. Frontend sends `coachapp://` URLs ✅
2. Backend accepts them ✅
3. Stripe uses them for redirect ✅
4. User returns to app after payment ✅
