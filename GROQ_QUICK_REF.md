# Quick Reference - Groq Integration

## ⚡ Quick Start

```bash
# Backend
cd backend && npm start

# Frontend (new terminal)
cd frontend && npm run dev
```

## 🔑 Environment Variables

Located in: `backend/.env`

```env
GROQ_API_KEY=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
GROQ_MODEL=llama-3.3-70b-versatile
```

## 🤖 Models

| Model | Speed | Capability | Use Case |
|-------|-------|------------|----------|
| llama-3.3-70b-versatile | Medium | High | Default - best quality |
| llama-3.1-8b-instant | Fast | Good | Quick responses |
| llama3-70b-8192 | Medium | High | Balanced |
| mixtral-8x7b-32768 | Slow | High | Long documents |
| gemma2-9b-it | Fast | Good | General tasks |

## 📍 Key Files Changed

### Backend
- `src/routes/aiRoutes.js` - Main AI logic
- `.env` - Configuration

### Frontend
- `services/groqService.ts` - New service
- `services/aiService.ts` - Updated types
- All components importing AI services

## 🧪 Quick Test

```bash
cd backend
node -e "import('groq-sdk').then(Groq => {
  new Groq.default({ apiKey: process.env.GROQ_API_KEY })
    .chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Hi!' }]
    }).then(r => console.log(r.choices[0].message.content));
});"
```

## 📝 Features Using Groq

All AI features:
- Writing feedback
- Quiz generation
- Study guides
- Concept explanations
- Study plans
- Progress analysis

## ⚠️ Important Notes

1. **API Key Security**: Never commit `.env` to git
2. **Rate Limits**: Groq has rate limits on free tier
3. **Model Selection**: Users can choose model in Settings
4. **Fallback**: If Groq fails, basic fallback responses are provided

## 🔗 Useful Links

- Groq Console: https://console.groq.com
- Groq Docs: https://console.groq.com/docs
- Model Info: https://console.groq.com/docs/models

## 📖 Full Documentation

- `MIGRATION_SUMMARY.md` - Complete overview
- `GROQ_MIGRATION.md` - Detailed technical changes
- `TEST_GROQ.md` - Testing procedures

---

**Status**: ✅ Production Ready
**Migration Date**: November 20, 2025
