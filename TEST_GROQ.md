# Testing Groq Integration

## Quick Test Commands

### 1. Test Groq API Directly
```bash
cd backend
node -e "
import('groq-sdk').then(Groq => {
  const client = new Groq.default({ 
    apiKey: process.env.GROQ_API_KEY 
  });
  client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: 'Explain photosynthesis in 2 sentences' }],
    temperature: 0.2,
    max_tokens: 100
  }).then(r => {
    console.log('✅ Response:', r.choices[0].message.content);
  }).catch(e => console.error('❌ Error:', e.message));
});
"
```

### 2. Test Backend API Endpoint
```bash
# First, get an auth token by logging in
# Then test the AI models endpoint:
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/ai/models
```

### 3. Test AI Feedback Endpoint
```bash
curl -X POST http://localhost:5000/api/ai/feedback \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "The quick brown fox jumps over the lazy dog.", "provider": "groq"}'
```

## Expected Results

### Models Endpoint Response:
```json
{
  "success": true,
  "message": "AI providers and models",
  "data": {
    "providers": {
      "groq": {
        "available": true,
        "models": [
          "llama-3.3-70b-versatile",
          "llama-3.1-8b-instant",
          "llama3-70b-8192",
          "mixtral-8x7b-32768",
          "gemma2-9b-it"
        ]
      },
      "openai": {
        "available": false,
        "models": []
      }
    },
    "defaults": {
      "provider": "groq",
      "model": "llama-3.3-70b-versatile"
    }
  }
}
```

### Feedback Endpoint Response:
```json
{
  "success": true,
  "message": "Instant feedback",
  "data": {
    "sentenceFeedback": [...],
    "holisticFeedback": "..."
  }
}
```

## Frontend Testing

1. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Login/Register

4. Go to Settings → AI Configuration
   - Should see "Groq (cloud)" as available
   - Should list available models

5. Try AI features:
   - Draft feedback
   - Generate quiz
   - Study assistant
   - Concept explanations

## Troubleshooting

### Error: "Groq is not available"
- Check `.env` file has `GROQ_API_KEY` set
- Restart backend server

### Error: "model_decommissioned"
- Model has been deprecated
- Check available models at https://console.groq.com/docs/models
- Update model name in code

### Error: "rate_limit_exceeded"
- Groq has rate limits on free tier
- Wait a few seconds and try again
- Consider upgrading Groq plan

## Verification Checklist

- [ ] Backend starts without errors
- [ ] `/api/ai/models` returns Groq as available
- [ ] AI feedback generates responses
- [ ] Frontend shows Groq in settings
- [ ] Quiz generation works
- [ ] Study guide generation works
- [ ] Concept explanations work
