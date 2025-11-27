import { apiGet, apiPost } from './api';

export const aiService = {
  // Get available models
  models: async () => {
    const res = await apiGet('/ai/models');
    return res.data as any;
  },

  // Chat with AI (with optional streaming)
  chat: async (messages: Array<{role: string, content: string}>, model?: string, stream: boolean = false) => {
    if (stream) {
      // Return the fetch response for streaming handling
      const token = localStorage.getItem('accessToken');
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      return fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messages, model, stream: true })
      });
    } else {
      const res = await apiPost('/ai/chat', { messages, model, stream: false });
      return res.data as any;
    }
  },

  // Get AI analysis
  analysis: async () => {
    const res = await apiGet('/ai/analysis');
    return res.data as any;
  },

  // Get instant feedback on text
  feedback: async (text: string, provider?: 'groq' | 'openai', model?: string) => {
    const res = await apiPost('/ai/feedback', { text, provider, model });
    return res.data as any;
  },

  // Generate outline
  outline: async (topic: string) => {
    const res = await apiPost('/ai/outline', { topic });
    return res.data as any;
  },

  // Get genre prompts
  prompts: async (genre: string) => {
    const res = await apiGet(`/ai/prompts?genre=${encodeURIComponent(genre)}`);
    return res.data as any;
  },

  // Get teacher overview
  teacherOverview: async () => {
    const res = await apiGet('/ai/teacher-overview');
    return res.data as any;
  },

  // Generate quiz
  generateQuiz: async (params: {
    subject: string;
    topic: string;
    level?: string;
    questionCount?: number;
    difficulty?: string;
  }) => {
    const res = await apiPost('/ai/generate-quiz', params);
    return res.data as any;
  },

  // Generate study guide
  generateStudyGuide: async (params: {
    subject: string;
    topic: string;
    level?: string;
    format?: string;
    focusAreas?: string[];
  }) => {
    const res = await apiPost('/ai/generate-study-guide', params);
    return res.data as any;
  },

  // Explain concept
  explainConcept: async (params: {
    concept: string;
    subject: string;
    level?: string;
    context?: string;
  }) => {
    const res = await apiPost('/ai/explain-concept', params);
    return res.data as any;
  },

  // Generate study plan
  generateStudyPlan: async (params: {
    subjects: string[] | string;
    timeAvailable?: string;
    goals: string[] | string;
    deadline?: string;
    currentLevel?: string;
  }) => {
    const res = await apiPost('/ai/generate-study-plan', params);
    return res.data as any;
  },

  // Analyze progress
  analyzeProgress: async (params: {
    subject: string;
    scores?: number[];
    topics?: string[];
  }) => {
    const res = await apiPost('/ai/analyze-progress', params);
    return res.data as any;
  }
};

export default aiService;


