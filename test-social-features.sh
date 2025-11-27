#!/bin/bash

# 🎉 Social Features Test Script
# Run this to test all the new social features

echo "================================="
echo "🚀 Social Features Test"
echo "================================="
echo ""

# Check if backend is running
echo "📡 Checking backend..."
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running"
    echo "   Please start it with: cd backend && npm start"
    exit 1
fi

echo ""
echo "================================="
echo "✅ System Ready!"
echo "================================="
echo ""
echo "🎯 Test these features:"
echo ""
echo "1. Study Groups:"
echo "   URL: http://localhost:3000/study-groups"
echo "   • Create a new group"
echo "   • Click 'Chat' to open WhatsApp-like chat"
echo "   • Click 'Video' to start video call"
echo "   • Click 'Invite' to send email invitation"
echo ""
echo "2. Group Chat Room:"
echo "   • Send messages (press Enter to send)"
echo "   • See typing indicators"
echo "   • Click video icon in header"
echo "   • Click menu to see members"
echo ""
echo "3. Video Calls (Jitsi):"
echo "   • FREE & Unlimited"
echo "   • Up to 75 participants"
echo "   • Screen sharing included"
echo ""
echo "4. Private Messaging:"
echo "   URL: http://localhost:3000/messages"
echo "   • Send email invitations"
echo "   • Real-time chat"
echo "   • Start video calls"
echo ""
echo "================================="
echo "📚 Documentation:"
echo "   See SOCIAL_FEATURES_COMPLETE.md"
echo "================================="
