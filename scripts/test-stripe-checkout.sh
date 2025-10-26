#!/bin/bash

# Test Stripe Checkout Endpoint
# This script tests if your backend's checkout/create endpoint is working

echo "🧪 Testing Stripe Checkout Endpoint"
echo "===================================="
echo ""

# Get API URL from .env
API_URL=$(grep EXPO_PUBLIC_API_URL .env | cut -d '=' -f2)
echo "📍 API URL: $API_URL"
echo ""

# You'll need to replace this with a valid auth token
# Get it by logging in through the app and checking the console logs
echo "⚠️  Note: You need a valid auth token to test this endpoint"
echo "   Get your token by logging into the app and checking console logs"
echo ""

read -p "Enter your auth token (or press Enter to skip): " AUTH_TOKEN

if [ -z "$AUTH_TOKEN" ]; then
    echo ""
    echo "❌ No token provided. Cannot test authenticated endpoint."
    echo ""
    echo "To get your token:"
    echo "1. Run the app: npm start"
    echo "2. Log in"
    echo "3. Check the console for 'API Request' logs"
    echo "4. Copy the Bearer token from the Authorization header"
    exit 1
fi

echo ""
echo "🔄 Calling POST $API_URL/subscription/checkout/create"
echo ""

# Make the API call
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "successUrl": "coachapp://onboarding/payment?success=true&session_id={CHECKOUT_SESSION_ID}",
    "cancelUrl": "coachapp://onboarding/payment?success=false"
  }' \
  "$API_URL/subscription/checkout/create")

# Split response body and status code
HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

echo "📊 Response Status: $HTTP_CODE"
echo ""
echo "📄 Response Body:"
echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
echo ""

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Success! Checkout session created."
    
    # Try to extract the URL
    CHECKOUT_URL=$(echo "$HTTP_BODY" | jq -r '.url' 2>/dev/null)
    if [ "$CHECKOUT_URL" != "null" ] && [ -n "$CHECKOUT_URL" ]; then
        echo ""
        echo "🌐 Stripe Checkout URL:"
        echo "$CHECKOUT_URL"
        echo ""
        echo "You can open this URL in a browser to test the checkout flow."
    fi
else
    echo "❌ Failed to create checkout session."
    echo ""
    echo "Common issues:"
    echo "- Invalid or expired auth token"
    echo "- Backend not running"
    echo "- Stripe not configured in backend"
    echo "- Wrong API URL in .env"
fi
