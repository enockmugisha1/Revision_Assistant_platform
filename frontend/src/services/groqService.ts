import { apiPost } from './api';

export interface GroqResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export interface QuizGenerationRequest {
  subject: string;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  questionTypes: ('multiple_choice' | 'true_false' | 'short_answer' | 'essay')[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudyGuideRequest {
  subject: string;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  format: 'outline' | 'detailed' | 'summary';
  focusAreas?: string[];
}

export interface ExplanationRequest {
  concept: string;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  context?: string;
}

export interface StudyPlanRequest {
  subjects: string[];
  timeAvailable: number;
  goals: string[];
  deadline?: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
}

class GroqService {
  async generateQuiz(request: QuizGenerationRequest): Promise<any> {
    const response = await apiPost('/ai/generate-quiz', request);
    return response.data;
  }

  async generateStudyGuide(request: StudyGuideRequest): Promise<any> {
    const response = await apiPost('/ai/generate-study-guide', request);
    return response.data;
  }

  async explainConcept(request: ExplanationRequest): Promise<any> {
    const response = await apiPost('/ai/explain-concept', request);
    return response.data;
  }

  async createStudyPlan(request: StudyPlanRequest): Promise<any> {
    const response = await apiPost('/ai/generate-study-plan', request);
    return response.data;
  }

  async generateFlashcards(subject: string, topic: string, count: number = 10): Promise<any> {
    const prompt = `Create ${count} flashcards for ${subject} - ${topic}.`;
    return this.callGroqAPI(prompt, 'flashcards');
  }

  async generatePracticeProblems(subject: string, topic: string, level: string, count: number = 5): Promise<any> {
    const prompt = `Generate ${count} practice problems for ${subject} - ${topic} at ${level} level.`;
    return this.callGroqAPI(prompt, 'practice_problems');
  }

  async analyzeLearningProgress(subject: string, scores: number[], topics: string[]): Promise<any> {
    const response = await apiPost('/ai/analyze-progress', { subject, scores, topics });
    return response.data;
  }

  async generateMotivationalMessage(achievement: string, subject: string): Promise<any> {
    const prompt = `Generate a motivational message for a student who just achieved: ${achievement} in ${subject}.`;
    return this.callGroqAPI(prompt, 'motivation');
  }

  private async callGroqAPI(prompt: string, type: string): Promise<any> {
    try {
      const response = await apiPost('/ai/feedback', { 
        text: prompt, 
        provider: 'groq' 
      });
      return this.parseResponse(response.data?.data?.holisticFeedback || '', type);
    } catch (error) {
      console.error('Groq service error:', error);
      throw new Error('Failed to connect to AI service.');
    }
  }

  private parseResponse(response: string, type: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { content: response, type };
    } catch {
      return { content: response, type };
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await apiPost('/ai/models', {});
      return response?.data?.success || false;
    } catch {
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await apiPost('/ai/models', {});
      return response?.data?.data?.providers?.groq?.models || [];
    } catch {
      return [];
    }
  }
}

export default new GroqService();
