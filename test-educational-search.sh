#!/bin/bash

echo "========================================"
echo "📚 Educational Resources Test Script"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running!${NC}"
else
    echo -e "${RED}❌ Backend is not running!${NC}"
    echo "Starting backend..."
    cd backend
    npm run dev &
    echo "Waiting 10 seconds for backend to start..."
    sleep 10
    cd ..
fi

echo ""
echo "========================================"
echo "📊 Testing Configuration"
echo "========================================"
curl -s "http://localhost:5000/api/educational-resources/test-config" | python3 -m json.tool

echo ""
echo "========================================"
echo "🧪 Test 1: Search Photosynthesis"
echo "========================================"
curl -s "http://localhost:5000/api/educational-resources/search?query=photosynthesis" | python3 -m json.tool | head -50

echo ""
echo "========================================"
echo "🧪 Test 2: Search Quadratic Equations"
echo "========================================"
curl -s "http://localhost:5000/api/educational-resources/search?query=quadratic%20equations%20class%2010" | python3 -m json.tool | head -50

echo ""
echo "========================================"
echo "🧪 Test 3: Search in French"
echo "========================================"
curl -s "http://localhost:5000/api/educational-resources/search?query=équations%20linéaires&language=fr" | python3 -m json.tool | head -50

echo ""
echo "========================================"
echo "✅ Tests Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. If YouTube/Notes are disabled, add your Google API key to backend/.env"
echo "2. Get your free API key: https://console.cloud.google.com/"
echo "3. See GET_GOOGLE_API_KEY.md for detailed instructions"
echo ""
echo "Open test page in browser:"
echo "  file://$(pwd)/test-educational-resources.html"
echo ""
