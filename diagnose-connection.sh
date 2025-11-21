#!/bin/bash

echo "🔍 Diagnosing Connection Issue..."
echo "=================================="
echo ""

BACKEND="https://revision-assistant-platform.onrender.com"
FRONTEND="https://revision-assistant-platform.vercel.app"

# Test 1: Backend Health
echo "1️⃣  Testing Backend Health..."
HEALTH=$(curl -s -w "\n%{http_code}" "$BACKEND/api/health" 2>&1)
HTTP_CODE=$(echo "$HEALTH" | tail -n1)
RESPONSE=$(echo "$HEALTH" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Backend is UP and responding"
    echo "   Response: $RESPONSE"
else
    echo "   ❌ Backend returned HTTP $HTTP_CODE"
    echo "   This might mean:"
    echo "   - Backend is sleeping (wait 30-60 seconds)"
    echo "   - Backend has an error"
    echo "   Response: $RESPONSE"
fi
echo ""

# Test 2: Register Endpoint
echo "2️⃣  Testing Register Endpoint..."
REGISTER=$(curl -s -w "\n%{http_code}" "$BACKEND/api/auth/register" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND" \
  -d '{"test":"data"}' 2>&1)
REG_CODE=$(echo "$REGISTER" | tail -n1)
REG_RESPONSE=$(echo "$REGISTER" | head -n-1)

echo "   HTTP Status: $REG_CODE"
if [ "$REG_CODE" = "400" ] || [ "$REG_CODE" = "422" ]; then
    echo "   ✅ Endpoint exists (400/422 = validation error, which is expected)"
elif [ "$REG_CODE" = "404" ]; then
    echo "   ❌ Endpoint NOT FOUND (404)"
    echo "   This means the backend route doesn't exist or isn't loaded"
else
    echo "   Status: $REG_CODE"
fi
echo "   Response: $REG_RESPONSE"
echo ""

# Test 3: CORS
echo "3️⃣  Testing CORS Configuration..."
CORS=$(curl -s -o /dev/null -w "%{http_code}" \
  -X OPTIONS \
  -H "Origin: $FRONTEND" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  "$BACKEND/api/auth/register" 2>&1)

if [ "$CORS" = "200" ] || [ "$CORS" = "204" ]; then
    echo "   ✅ CORS is configured correctly"
else
    echo "   ⚠️  CORS might not be configured (HTTP $CORS)"
    echo "   Make sure FRONTEND_URLS is set on Render with value:"
    echo "   $FRONTEND"
fi
echo ""

# Summary
echo "=================================="
echo "📊 DIAGNOSIS SUMMARY"
echo "=================================="
echo ""
echo "Backend URL: $BACKEND"
echo "Frontend URL: $FRONTEND"
echo ""

if [ "$HTTP_CODE" = "200" ] && ([ "$REG_CODE" = "400" ] || [ "$REG_CODE" = "422" ]); then
    echo "✅ Everything looks good!"
    echo ""
    echo "If you're still getting 404 in browser:"
    echo "1. Clear browser cache (Ctrl+Shift+Delete)"
    echo "2. Check browser console for the EXACT URL being called"
    echo "3. Make sure you updated FRONTEND_URLS on Render"
    echo "4. Wait 2-3 minutes after updating env vars"
elif [ "$HTTP_CODE" != "200" ]; then
    echo "⚠️  Backend might be sleeping or having issues"
    echo ""
    echo "Action: Wait 30-60 seconds and try again"
    echo "The backend (Render free tier) sleeps after inactivity"
else
    echo "⚠️  Possible issues detected"
    echo ""
    echo "Actions:"
    echo "1. Update FRONTEND_URLS on Render"
    echo "2. Check Render logs for errors"
    echo "3. Verify backend is deployed correctly"
fi
echo ""
