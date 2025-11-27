# 🚀 Groq AI - Quick Start Guide

## ✅ Status: WORKING & TESTED

### Quick Test
```bash
cd backend
node test-groq.js
```

### Start Server
```bash
cd backend
npm start
```

### Environment Variables
```env
# backend/.env
GROQ_API_KEY=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
GROQ_MODEL=llama-3.3-70b-versatile
```

### Quick API Test
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpass"}' | jq -r '.data.accessToken')

# Test Chat
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}],"stream":false}'
```

### Frontend Usage
```typescript
import aiService from './services/aiService';

// Simple chat
const response = await aiService.chat([
  { role: 'user', content: 'Hello!' }
]);

// Generate quiz
const quiz = await aiService.generateQuiz({
  subject: 'Math',
  topic: 'Algebra',
  questionCount: 5
});

// Explain concept
const explanation = await aiService.explainConcept({
  concept: 'Photosynthesis',
  subject: 'Biology'
});
```

### Available Endpoints
- `POST /api/ai/chat` - Chat (streaming supported)
- `GET /api/ai/models` - Get models
- `POST /api/ai/feedback` - Writing feedback
- `POST /api/ai/generate-quiz` - Generate quiz
- `POST /api/ai/explain-concept` - Explain concept
- `POST /api/ai/generate-study-guide` - Study guide
- `POST /api/ai/generate-study-plan` - Study plan

### Models Available
- `llama-3.3-70b-versatile` (default) - Best quality
- `llama-3.1-8b-instant` - Fastest
- `mixtral-8x7b-32768` - Largest context

### Files
- **Backend Routes**: `backend/src/routes/aiRoutes.js`
- **Frontend Service**: `frontend/src/services/aiService.ts`
- **UI Component**: `frontend/src/components/ai/SimpleAIAssistant.tsx`
- **Test Script**: `backend/test-groq.js`

### Troubleshooting
```bash
# If Groq not working, restart server
pkill -f "node.*server.js"
cd backend && npm start

# Check logs
tail -f /tmp/backend.log

# Test environment
cd backend && node test-groq.js
```

### Status: ✅ READY TO USE
