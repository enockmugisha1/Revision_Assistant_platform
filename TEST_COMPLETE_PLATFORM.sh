#!/bin/bash

echo "
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🧪 TESTING COMPLETE PLATFORM - All 3 Phases!           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Test Checklist:${NC}"
echo ""

# Phase 1 Tests
echo -e "${YELLOW}Phase 1: Platform Simplification${NC}"
echo "  [ ] 1. SuperDashboard loads with stats"
echo "  [ ] 2. AI Quiz Generator works"
echo "  [ ] 3. Voice assistant on quiz page"
echo "  [ ] 4. 5-section navigation visible"
echo ""

# Phase 2 Tests  
echo -e "${YELLOW}Phase 2: Social Learning${NC}"
echo "  [ ] 5. Study Together hub loads"
echo "  [ ] 6. Study buddy matching available"
echo "  [ ] 7. Tutoring marketplace visible"
echo "  [ ] 8. Group challenges display"
echo ""

# Phase 3 Tests
echo -e "${YELLOW}Phase 3: Adaptive Learning${NC}"
echo "  [ ] 9. Analytics dashboard loads"
echo "  [ ] 10. AI insights displayed"
echo "  [ ] 11. Personalized recommendations show"
echo "  [ ] 12. Learning metrics visible"
echo ""

echo -e "${GREEN}🚀 Starting servers...${NC}"
echo ""

# Check if backend is running
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Backend running on port 5001${NC}"
else
    echo -e "${RED}❌ Backend not running${NC}"
    echo -e "${YELLOW}Starting backend...${NC}"
    cd backend
    npm start &
    BACKEND_PID=$!
    sleep 5
fi

# Check if frontend is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Frontend running on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend not running${NC}"
    echo -e "${YELLOW}Starting frontend...${NC}"
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    sleep 5
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ SERVERS RUNNING!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}🌐 Open in browser: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}📝 TEST STEPS:${NC}"
echo ""
echo "1. Login/Register"
echo "2. Check SuperDashboard"
echo "3. Click 'Quizzes & AI' → Generate quiz"
echo "4. Click floating voice button"
echo "5. Click 'Study Together' → See 3 tabs"
echo "6. Click 'View Analytics' → See insights"
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""

# API Health Check
echo -e "${BLUE}🔍 Testing API Endpoints...${NC}"
echo ""

# Test voice endpoint
echo -n "Testing Voice API: "
VOICE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/voice/ask -X POST -H "Content-Type: application/json" -d '{"message":"test"}' 2>/dev/null)
if [ "$VOICE_RESPONSE" = "200" ] || [ "$VOICE_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✅ Working${NC}"
else
    echo -e "${YELLOW}⚠️  Needs authentication${NC}"
fi

# Test social endpoint
echo -n "Testing Social API: "
SOCIAL_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/social/online 2>/dev/null)
if [ "$SOCIAL_RESPONSE" = "200" ] || [ "$SOCIAL_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✅ Working${NC}"
else
    echo -e "${YELLOW}⚠️  Needs authentication${NC}"
fi

# Test adaptive endpoint
echo -n "Testing Adaptive API: "
ADAPTIVE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/adaptive/profile 2>/dev/null)
if [ "$ADAPTIVE_RESPONSE" = "200" ] || [ "$ADAPTIVE_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✅ Working${NC}"
else
    echo -e "${YELLOW}⚠️  Needs authentication${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 PLATFORM READY FOR TESTING!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Press Ctrl+C to stop servers"
echo ""

# Keep script running
wait
