#!/bin/bash

echo "🎤 Starting Voice AI Assistant Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Kill existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# Start Backend
echo ""
echo -e "${BLUE}🔧 Starting Backend...${NC}"
cd /home/enock/Revision_Assistant_platform/backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:5000${NC}"
else
    echo "❌ Backend failed to start. Check logs above."
    exit 1
fi

# Start Frontend
echo ""
echo -e "${PURPLE}🎨 Starting Frontend...${NC}"
cd /home/enock/Revision_Assistant_platform/frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "⏳ Waiting for frontend to start..."
sleep 8

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Voice AI Assistant is READY!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "🎤 To test the Voice Assistant:"
echo "   1. Open http://localhost:3000"
echo "   2. Login to your account"
echo "   3. Look for the purple floating button (bottom-right)"
echo "   4. Click it and start talking!"
echo ""
echo "💡 Try saying: 'Explain photosynthesis to me'"
echo ""
echo "🛑 To stop: Press Ctrl+C"
echo ""

# Keep script running
wait
