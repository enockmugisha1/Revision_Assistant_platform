# Migration from Ollama to Groq

## Summary
This document describes the changes made to replace Ollama with Groq as the AI provider for the Revision Assistant Platform.

## Changes Made

### Backend Changes

1. **Package Installation**
   - Installed `groq-sdk` npm package

2. **Environment Variables** (`.env` and `.env.example`)
   - Replaced `OLLAMA_MODEL` with `GROQ_MODEL`
   - Replaced `OLLAMA_BASE_URL` with `GROQ_API_KEY`
   - Added Groq API key: `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`
   - Default model set to: `llama-3.1-70b-versatile`

3. **API Routes** (`backend/src/routes/aiRoutes.js`)
   - Removed Ollama-specific functions (`fetchOllamaModels`, `generateWithOllama`)
   - Added Groq-specific functions (`fetchGroqModels`, `generateWithGroq`)
   - Updated `getModels()` endpoint to return Groq providers instead of Ollama
   - Updated `getInstantFeedback()` to use Groq instead of Ollama
   - Removed axios dependency for Ollama API calls
   - Integrated Groq SDK for AI completions

### Frontend Changes

1. **New Service File**
   - Created `frontend/src/services/groqService.ts` to replace `ollamaService.ts`
   - Implements same interface but uses backend API instead of direct calls

2. **Service Updates**
   - `aiService.ts`: Changed provider type from `'ollama' | 'openai'` to `'groq' | 'openai'`

3. **Component Updates**
   - `Settings.tsx`: Import and use `GroqService` instead of `OllamaService`
   - `SettingsPage.tsx`: Updated provider type and UI labels from "Ollama" to "Groq"
   - `DraftPage.tsx`: Changed provider type from `ollama` to `groq`
   - `StudyAssistant.tsx`: Import and use `GroqService`
   - `AIGeneratedQuiz.tsx`: Import and use `GroqService`
   - `Dashboard.tsx`: Import and use `GroqService`
   - `EnhancedDashboard.tsx`: Import and use `GroqService`

4. **UI Updates**
   - Changed "Ollama (local)" to "Groq (cloud)" in settings
   - Updated help text from Ollama installation instructions to Groq info
   - Updated error messages from "Ollama is running" to "AI service is available"

## Groq Models Available

The following Groq models are now available:
- `llama-3.3-70b-versatile` (default - newest model)
- `llama-3.1-8b-instant` (fast, lightweight)
- `llama3-70b-8192` (good balance)
- `mixtral-8x7b-32768` (large context window)
- `gemma2-9b-it` (efficient)

## Benefits of Groq

1. **Cloud-based**: No need to run local AI models
2. **Fast inference**: Groq provides extremely fast AI inference
3. **No installation**: No need to install and manage Ollama locally
4. **Scalable**: Handles multiple concurrent requests
5. **API-based**: Simple REST API integration

## Testing

To test the changes:

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to Settings and verify Groq is listed as available
4. Try generating AI content (quiz, study guide, feedback, etc.)

## Rollback

If you need to rollback to Ollama, the old `ollamaService.ts` file is still present in the frontend. You would need to:
1. Revert the changes in `aiRoutes.js`
2. Update all component imports back to `ollamaService`
3. Reinstall Ollama locally
4. Update environment variables

## API Key Security

⚠️ **Important**: The Groq API key is currently stored in the `.env` file. For production:
- Never commit the `.env` file to version control
- Use environment variables in deployment platform (Render, Vercel, etc.)
- Rotate API keys regularly
- Monitor API usage to detect unauthorized access
