#!/bin/bash

echo "🧪 Testing AI Endpoints..."
echo ""

# First, login to get token
echo "1. Getting authentication token..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token. Creating test user first..."
  curl -s -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"student"}'
  
  LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}')
  
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')
fi

if [ -z "$TOKEN" ]; then
  echo "❌ Still no token. Please check backend."
  exit 1
fi

echo "✅ Got authentication token"
echo ""

# Test 2: Get available models
echo "2. Testing /api/ai/models..."
curl -s -X GET http://localhost:5000/api/ai/models \
  -H "Authorization: Bearer $TOKEN" | jq '.' 2>/dev/null || echo "Response received"
echo ""

# Test 3: Chat endpoint (non-streaming)
echo "3. Testing /api/ai/chat (non-streaming)..."
curl -s -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say hello in one sentence"}],"stream":false}' | jq '.' 2>/dev/null || echo "Response received"
echo ""

# Test 4: Generate quiz
echo "4. Testing /api/ai/generate-quiz..."
curl -s -X POST http://localhost:5000/api/ai/generate-quiz \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Math","topic":"Algebra","level":"beginner","questionCount":3}' | jq '.data.title' 2>/dev/null || echo "Response received"
echo ""

# Test 5: Explain concept
echo "5. Testing /api/ai/explain-concept..."
curl -s -X POST http://localhost:5000/api/ai/explain-concept \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"concept":"Photosynthesis","subject":"Biology","level":"beginner"}' | jq '.data.explanation.definition' 2>/dev/null || echo "Response received"
echo ""

# Test 6: Feedback
echo "6. Testing /api/ai/feedback..."
curl -s -X POST http://localhost:5000/api/ai/feedback \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a short essay about science. Science is important because it helps us understand the world.","provider":"groq"}' | jq '.data.holisticFeedback' 2>/dev/null || echo "Response received"
echo ""

echo "✅ All AI endpoint tests completed!"
