import Groq from 'groq-sdk';
import User from '../models/User.js';

class VoiceAssistantService {
  constructor() {
    this.groq = null; // Initialize lazily
    // Store conversation history in memory (in production, use Redis or database)
    this.conversationHistory = new Map();
  }

  // Lazy initialization of Groq client
  getGroqClient() {
    if (!this.groq && process.env.GROQ_API_KEY) {
      this.groq = new Groq({ 
        apiKey: process.env.GROQ_API_KEY 
      });
    }
    return this.groq;
  }

  /**
   * Get AI response for voice/text input
   */
  async getAIResponse(userId, userMessage, currentSubject = null) {
    try {
      const groq = this.getGroqClient();
      if (!groq) {
        throw new Error('Groq API key not configured');
      }

      // Get conversation history
      const history = this.conversationHistory.get(userId) || [];
      
      // Get user context if not provided
      if (!currentSubject) {
        try {
          const user = await User.findById(userId);
          currentSubject = user?.currentStudySession?.subject || 'general';
        } catch (err) {
          currentSubject = 'general';
        }
      }
      
      const messages = [
        {
          role: 'system',
          content: `You are a friendly AI study assistant helping a student with ${currentSubject}. 
                   Be encouraging, explain concepts clearly, and ask follow-up questions to check understanding.
                   Keep responses concise for voice output (2-3 sentences max unless asked for more detail).
                   Use simple language and provide examples when helpful.
                   If the student seems frustrated, offer encouragement and alternative approaches.`
        },
        ...history,
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      });

      const aiMessage = response.choices[0].message.content;

      // Update conversation history
      history.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiMessage }
      );
      
      // Keep last 20 messages (10 exchanges)
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }
      
      this.conversationHistory.set(userId, history);

      return {
        success: true,
        response: aiMessage,
        conversationLength: history.length / 2
      };
    } catch (error) {
      console.error('Voice Assistant Error:', error);
      throw new Error('Failed to get AI response: ' + error.message);
    }
  }

  /**
   * Get conversation history for a user
   */
  getConversationHistory(userId) {
    return this.conversationHistory.get(userId) || [];
  }

  /**
   * Clear conversation history
   */
  clearHistory(userId) {
    this.conversationHistory.delete(userId);
    return { success: true, message: 'Conversation history cleared' };
  }

  /**
   * Get all active conversations (for admin/debugging)
   */
  getActiveConversations() {
    return {
      count: this.conversationHistory.size,
      users: Array.from(this.conversationHistory.keys())
    };
  }

  /**
   * Generate study suggestions based on conversation
   */
  async generateStudySuggestions(userId) {
    const history = this.conversationHistory.get(userId);
    if (!history || history.length === 0) {
      return {
        suggestions: [
          'Start by asking me about a topic you want to study',
          'I can help explain difficult concepts',
          'Try asking me to create a quiz on any subject'
        ]
      };
    }

    // Analyze conversation to suggest next steps
    const lastMessages = history.slice(-6); // Last 3 exchanges
    const topics = lastMessages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ');

    try {
      const groq = this.getGroqClient();
      const response = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'Based on the conversation, suggest 3 specific study activities. Be brief and actionable.'
          },
          {
            role: 'user',
            content: `Recent conversation topics: ${topics}`
          }
        ],
        temperature: 0.8,
        max_tokens: 150
      });

      return {
        suggestions: response.choices[0].message.content.split('\n').filter(s => s.trim())
      };
    } catch (error) {
      return {
        suggestions: ['Continue practicing what we discussed', 'Try creating a summary', 'Test yourself with a quiz']
      };
    }
  }
}

export default new VoiceAssistantService();
