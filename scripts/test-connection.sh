#!/bin/bash

# Test API Connection Script
# This script tests the connection between frontend and backend containers

echo "🔍 Testing API Connection"
echo "═══════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if frontend container is running
echo "1. Checking frontend container..."
if docker ps | grep -q "coach-app-frontend"; then
    echo -e "${GREEN}✓${NC} Frontend container is running"
else
    echo -e "${RED}✗${NC} Frontend container is NOT running"
    echo "   Run: docker-compose up -d"
    exit 1
fi
echo ""

# Check if backend container is running
echo "2. Checking backend container..."
if docker ps | grep -q "coach-laravel.test"; then
    echo -e "${GREEN}✓${NC} Backend container is running"
else
    echo -e "${RED}✗${NC} Backend container is NOT running"
    echo "   Run: ./vendor/bin/sail up -d (from backend directory)"
    exit 1
fi
echo ""

# Check network connectivity
echo "3. Testing network connectivity..."
if docker exec coach-app-frontend ping -c 1 laravel.test > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend can reach backend (laravel.test)"
else
    echo -e "${RED}✗${NC} Frontend CANNOT reach backend"
    echo "   Check Docker network configuration"
    exit 1
fi
echo ""

# Test API endpoint
echo "4. Testing API endpoint..."
HTTP_CODE=$(docker exec coach-app-frontend wget -qO- --server-response http://laravel.test/api 2>&1 | grep "HTTP/" | tail -1 | awk '{print $2}')

if [ -n "$HTTP_CODE" ]; then
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "404" ]; then
        echo -e "${GREEN}✓${NC} API endpoint is reachable (HTTP $HTTP_CODE)"
    else
        echo -e "${YELLOW}⚠${NC} API endpoint returned HTTP $HTTP_CODE"
    fi
else
    echo -e "${RED}✗${NC} Could not reach API endpoint"
    exit 1
fi
echo ""

# Check environment variable
echo "5. Checking environment variable..."
API_URL=$(docker exec coach-app-frontend printenv EXPO_PUBLIC_API_URL 2>/dev/null)
if [ -n "$API_URL" ]; then
    echo -e "${GREEN}✓${NC} EXPO_PUBLIC_API_URL is set to: $API_URL"
else
    echo -e "${YELLOW}⚠${NC} EXPO_PUBLIC_API_URL is not set"
    echo "   Add it to docker-compose.yml environment section"
fi
echo ""

# Test from host machine
echo "6. Testing from host machine (for mobile devices)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost/api 2>/dev/null | grep -q "200\|404"; then
    echo -e "${GREEN}✓${NC} Backend is accessible from host machine (http://localhost/api)"
else
    echo -e "${YELLOW}⚠${NC} Backend may not be accessible from host machine"
    echo "   Mobile devices may have trouble connecting"
fi
echo ""

echo "═══════════════════════════════════════════════════════"
echo -e "${GREEN}✓ All connection tests passed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Open the Expo app on your device/simulator"
echo "  2. Try logging in with: test@test.com / 11111111"
echo "  3. If login fails, check backend logs:"
echo "     docker logs coach-laravel.test-1"
echo "═══════════════════════════════════════════════════════"
