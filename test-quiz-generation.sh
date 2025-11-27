#!/bin/bash

echo "🧪 Testing Quiz Generation Endpoint"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# First, login to get token
echo "📝 Step 1: Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed. Please check credentials or create a test account.${NC}"
  echo "Response: $LOGIN_RESPONSE"
  echo ""
  echo "To create a test account, register at http://localhost:5173/register"
  exit 1
else
  echo -e "${GREEN}✅ Login successful${NC}"
  echo "Token: ${TOKEN:0:20}..."
fi

echo ""
echo "🎯 Step 2: Testing Quiz Generation..."
echo ""

QUIZ_RESPONSE=$(curl -s -X POST http://localhost:5000/api/ai/generate-quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "subject": "Mathematics",
    "topic": "Addition",
    "level": "beginner",
    "questionCount": 3,
    "difficulty": "easy"
  }')

# Check if successful
if echo "$QUIZ_RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ Quiz generation successful!${NC}"
  echo ""
  echo "Quiz Details:"
  echo "$QUIZ_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$QUIZ_RESPONSE"
else
  echo -e "${RED}❌ Quiz generation failed${NC}"
  echo ""
  echo "Response:"
  echo "$QUIZ_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$QUIZ_RESPONSE"
  exit 1
fi

echo ""
echo "🎉 Test completed successfully!"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Login with your credentials"
echo "3. Navigate to Quizzes & AI page"
echo "4. Try generating a quiz with the form"
