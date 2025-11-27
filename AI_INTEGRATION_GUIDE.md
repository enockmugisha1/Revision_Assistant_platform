# AI Integration Guide - Groq Implementation

This guide shows how to use the Groq AI integration in the Revision Assistant Platform.

## 🔑 API Key Configuration

The Groq API key is already configured in `/backend/.env`:
```
GROQ_API_KEY=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
GROQ_MODEL=llama-3.3-70b-versatile
```

## 🚀 Available Models

- `llama-3.3-70b-versatile` (default) - Best for general tasks
- `llama-3.1-8b-instant` - Fast responses
- `llama3-70b-8192` - Large context window
- `mixtral-8x7b-32768` - Very large context
- `gemma2-9b-it` - Efficient model

## 📡 Backend API Endpoints

### 1. Chat (with Streaming Support)
```javascript
POST /api/ai/chat

// Request
{
  "messages": [
    { "role": "user", "content": "Explain photosynthesis" },
    { "role": "assistant", "content": "Previous response..." },
    { "role": "user", "content": "Tell me more" }
  ],
  "model": "llama-3.3-70b-versatile",  // optional
  "stream": true  // Enable streaming
}

// Streaming Response (Server-Sent Events)
data: {"content": "Photosynthesis"}
data: {"content": " is the"}
data: {"content": " process..."}
data: [DONE]
```

### 2. Get Instant Feedback
```javascript
POST /api/ai/feedback

{
  "text": "Your essay or writing text here",
  "provider": "groq",
  "model": "llama-3.3-70b-versatile"
}

// Response
{
  "success": true,
  "data": {
    "sentenceFeedback": ["Suggestion 1", "Suggestion 2"],
    "holisticFeedback": "Overall feedback paragraph"
  }
}
```

### 3. Generate Quiz
```javascript
POST /api/ai/generate-quiz

{
  "subject": "Biology",
  "topic": "Photosynthesis",
  "level": "intermediate",
  "questionCount": 5,
  "difficulty": "moderate"
}

// Response
{
  "success": true,
  "data": {
    "title": "Biology - Photosynthesis Quiz",
    "questions": [
      {
        "question": "What is...",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "A",
        "explanation": "Because...",
        "points": 1
      }
    ]
  }
}
```

### 4. Generate Study Guide
```javascript
POST /api/ai/generate-study-guide

{
  "subject": "Mathematics",
  "topic": "Calculus",
  "level": "advanced",
  "format": "detailed"
}
```

### 5. Explain Concept
```javascript
POST /api/ai/explain-concept

{
  "concept": "Derivatives",
  "subject": "Mathematics",
  "level": "intermediate",
  "context": "In calculus class"
}
```

### 6. Generate Study Plan
```javascript
POST /api/ai/generate-study-plan

{
  "subjects": ["Math", "Physics", "Chemistry"],
  "timeAvailable": "2 hours per day",
  "goals": ["Pass exams", "Understand concepts"],
  "deadline": "2024-12-31",
  "currentLevel": "intermediate"
}
```

### 7. Get Available Models
```javascript
GET /api/ai/models

// Response
{
  "success": true,
  "data": {
    "providers": {
      "groq": {
        "available": true,
        "models": ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", ...]
      }
    },
    "defaults": {
      "provider": "groq",
      "model": "llama-3.3-70b-versatile"
    }
  }
}
```

## 💻 Frontend Usage Examples

### Simple Chat Request
```typescript
import aiService from './services/aiService';

// Non-streaming chat
const response = await aiService.chat([
  { role: 'user', content: 'Hello!' }
], 'llama-3.3-70b-versatile', false);

console.log(response.data.content);
```

### Streaming Chat
```typescript
// Streaming chat
const stream = await aiService.chat([
  { role: 'user', content: 'Explain quantum physics' }
], 'llama-3.3-70b-versatile', true);

if (stream instanceof Response) {
  const reader = stream.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') break;
        
        const parsed = JSON.parse(data);
        console.log(parsed.content); // Stream content
      }
    }
  }
}
```

### Generate Quiz
```typescript
const quiz = await aiService.generateQuiz({
  subject: 'History',
  topic: 'World War II',
  level: 'intermediate',
  questionCount: 10,
  difficulty: 'moderate'
});

console.log(quiz.data);
```

### Explain Concept
```typescript
const explanation = await aiService.explainConcept({
  concept: 'Machine Learning',
  subject: 'Computer Science',
  level: 'beginner'
});

console.log(explanation.data.explanation);
```

### Get Feedback
```typescript
const feedback = await aiService.feedback(
  'Your essay text here...',
  'groq',
  'llama-3.3-70b-versatile'
);

console.log(feedback.data.holisticFeedback);
```

## 🧪 Testing

Run the test script:
```bash
cd backend
node test-groq.js
```

This will test:
- Simple chat completion
- Streaming responses
- Multi-turn conversations

## 🎨 UI Component

The AI Assistant is available at:
- **Component**: `frontend/src/components/ai/SimpleAIAssistant.tsx`
- **Features**:
  - Real-time streaming responses
  - Multiple modes: chat, feedback, quiz, explain
  - Clean message interface
  - Quick action buttons

## 🔧 Environment Variables

Make sure these are set in `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

## 📝 Notes

1. **Streaming** provides real-time responses as they're generated
2. **Non-streaming** returns complete responses at once
3. All endpoints require authentication (JWT token)
4. Rate limiting is applied per the server configuration
5. Groq is fast and cost-effective for educational use cases

## 🎯 Best Practices

1. Use streaming for long responses (essays, explanations)
2. Use non-streaming for structured data (quizzes, outlines)
3. Choose appropriate models:
   - `llama-3.3-70b-versatile` for quality
   - `llama-3.1-8b-instant` for speed
4. Always handle errors gracefully
5. Provide user feedback during AI operations

## 🚦 Status

✅ Groq SDK installed
✅ API routes configured
✅ Streaming support implemented
✅ Frontend service updated
✅ UI component with streaming
✅ Multiple AI features integrated
✅ Environment variables configured
✅ Tests passing

## 🔗 Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Groq API Reference](https://console.groq.com/docs/api-reference)
- Backend Routes: `/backend/src/routes/aiRoutes.js`
- Frontend Service: `/frontend/src/services/aiService.ts`
- UI Component: `/frontend/src/components/ai/SimpleAIAssistant.tsx`
