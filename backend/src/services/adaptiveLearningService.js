import Groq from 'groq-sdk';
import User from '../models/User.js';

class AdaptiveLearningService {
  constructor() {
    this.groq = null;
  }

  getGroqClient() {
    if (!this.groq && process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return this.groq;
  }

  /**
   * Analyze student's learning patterns and provide insights
   */
  async analyzeStudentProfile(userId) {
    try {
      const user = await User.findById(userId)
        .select('username subjects quizScores studyTime lastActive level');

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate learning metrics
      const metrics = this.calculateLearningMetrics(user);
      
      // Get AI insights
      const aiInsights = await this.getAIInsights(user, metrics);

      return {
        success: true,
        userId: user._id,
        username: user.username,
        metrics,
        insights: aiInsights,
        recommendations: this.generateRecommendations(metrics)
      };
    } catch (error) {
      console.error('Profile analysis error:', error);
      throw error;
    }
  }

  /**
   * Calculate learning metrics from user data
   */
  calculateLearningMetrics(user) {
    const now = new Date();
    const daysSinceActive = user.lastActive 
      ? Math.floor((now - new Date(user.lastActive)) / (1000 * 60 * 60 * 24))
      : 0;

    // Mock data for demonstration
    const metrics = {
      averageScore: 75,
      quizzesTaken: 12,
      totalStudyTime: 450, // minutes
      averageStudyTime: 37.5, // per session
      consistency: 0.7, // 0-1
      improvement: 0.15, // 15% improvement
      weakAreas: ['Advanced Math', 'Chemistry'],
      strongAreas: ['English', 'History'],
      learningVelocity: 0.8, // 0-1 (how fast they learn)
      retentionRate: 0.85, // 0-1
      engagementScore: 0.72, // 0-1
      burnoutRisk: 0.2, // 0-1 (low risk)
      optimalStudyTime: 'afternoon', // morning, afternoon, evening
      lastActiveDate: user.lastActive || now,
      daysSinceActive
    };

    return metrics;
  }

  /**
   * Get AI-powered insights using Groq
   */
  async getAIInsights(user, metrics) {
    const groq = this.getGroqClient();
    
    if (!groq) {
      return this.getFallbackInsights(metrics);
    }

    try {
      const prompt = `Analyze this student's learning profile and provide 3-4 specific, actionable insights:

Student: ${user.username}
Average Score: ${metrics.averageScore}%
Study Time: ${metrics.totalStudyTime} minutes total
Consistency: ${(metrics.consistency * 100).toFixed(0)}%
Improvement: ${(metrics.improvement * 100).toFixed(0)}%
Weak Areas: ${metrics.weakAreas.join(', ')}
Strong Areas: ${metrics.strongAreas.join(', ')}
Burnout Risk: ${(metrics.burnoutRisk * 100).toFixed(0)}%

Provide brief, encouraging insights focusing on:
1. Current performance assessment
2. Areas needing attention
3. Strengths to leverage
4. Personalized study suggestion

Be concise and motivating.`;

      const response = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      });

      const aiText = response.choices[0].message.content;
      
      // Parse insights
      const insights = aiText
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 4)
        .map(insight => insight.replace(/^\d+\.\s*/, '').trim());

      return insights.length > 0 ? insights : this.getFallbackInsights(metrics);
    } catch (error) {
      console.error('AI insights error:', error);
      return this.getFallbackInsights(metrics);
    }
  }

  /**
   * Fallback insights when AI is unavailable
   */
  getFallbackInsights(metrics) {
    const insights = [];

    if (metrics.averageScore >= 80) {
      insights.push('🌟 Excellent performance! You\'re mastering the material.');
    } else if (metrics.averageScore >= 60) {
      insights.push('📈 Good progress! Keep consistent and you\'ll improve further.');
    } else {
      insights.push('💪 Focus time! Let\'s work on strengthening your foundation.');
    }

    if (metrics.consistency > 0.7) {
      insights.push('🔥 Great consistency! Regular study habits are your superpower.');
    } else {
      insights.push('📅 Try studying at the same time daily to build stronger habits.');
    }

    if (metrics.weakAreas.length > 0) {
      insights.push(`🎯 Focus on ${metrics.weakAreas[0]} - targeted practice will help!`);
    }

    if (metrics.burnoutRisk > 0.6) {
      insights.push('⚠️ Take breaks! Rest is essential for long-term success.');
    } else {
      insights.push('💚 Your learning pace is healthy - keep it balanced!');
    }

    return insights;
  }

  /**
   * Generate personalized recommendations
   */
  generateRecommendations(metrics) {
    const recommendations = [];

    // Study time recommendation
    if (metrics.averageStudyTime < 30) {
      recommendations.push({
        type: 'study_time',
        title: 'Increase Study Sessions',
        description: 'Aim for 45-60 minutes per session for optimal learning',
        priority: 'high',
        icon: '⏰'
      });
    }

    // Weak areas focus
    if (metrics.weakAreas.length > 0) {
      recommendations.push({
        type: 'weak_areas',
        title: `Focus on ${metrics.weakAreas[0]}`,
        description: 'Dedicate extra time to challenging subjects',
        priority: 'high',
        icon: '🎯'
      });
    }

    // Consistency boost
    if (metrics.consistency < 0.6) {
      recommendations.push({
        type: 'consistency',
        title: 'Build a Study Routine',
        description: 'Study at the same time daily to form strong habits',
        priority: 'medium',
        icon: '📅'
      });
    }

    // Burnout prevention
    if (metrics.burnoutRisk > 0.6) {
      recommendations.push({
        type: 'burnout',
        title: 'Take Strategic Breaks',
        description: 'Use the Pomodoro technique: 25 min study, 5 min break',
        priority: 'high',
        icon: '🌴'
      });
    }

    // Study buddy suggestion
    if (metrics.engagementScore < 0.6) {
      recommendations.push({
        type: 'social',
        title: 'Find a Study Buddy',
        description: 'Learning with others can boost motivation and understanding',
        priority: 'medium',
        icon: '👥'
      });
    }

    // Leverage strengths
    if (metrics.strongAreas.length > 0) {
      recommendations.push({
        type: 'strengths',
        title: `Excel in ${metrics.strongAreas[0]}`,
        description: 'Build confidence by deepening your strong subjects',
        priority: 'low',
        icon: '⭐'
      });
    }

    return recommendations;
  }

  /**
   * Predict exam readiness for a subject
   */
  async predictExamReadiness(userId, subject) {
    try {
      const user = await User.findById(userId);
      const metrics = this.calculateLearningMetrics(user);

      // Simple prediction model (in real app, use ML model)
      const readiness = {
        subject,
        predictedScore: Math.min(100, metrics.averageScore + (metrics.improvement * 100)),
        confidence: metrics.consistency * metrics.retentionRate,
        readinessLevel: 'moderate',
        recommendedStudyHours: 10,
        examDate: null,
        weakTopics: metrics.weakAreas,
        strengthTopics: metrics.strongAreas
      };

      // Determine readiness level
      if (readiness.predictedScore >= 85 && readiness.confidence >= 0.7) {
        readiness.readinessLevel = 'high';
        readiness.recommendedStudyHours = 5;
      } else if (readiness.predictedScore >= 70 && readiness.confidence >= 0.5) {
        readiness.readinessLevel = 'moderate';
        readiness.recommendedStudyHours = 10;
      } else {
        readiness.readinessLevel = 'low';
        readiness.recommendedStudyHours = 20;
      }

      return {
        success: true,
        readiness
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get optimal study schedule based on performance patterns
   */
  async getOptimalSchedule(userId) {
    try {
      const user = await User.findById(userId);
      const metrics = this.calculateLearningMetrics(user);

      const schedule = {
        bestTimes: [
          { day: 'Monday', time: '14:00-15:30', reason: 'High focus period' },
          { day: 'Wednesday', time: '14:00-15:30', reason: 'Peak performance day' },
          { day: 'Friday', time: '10:00-11:30', reason: 'Fresh start to end week strong' }
        ],
        sessionDuration: metrics.averageStudyTime > 45 ? 60 : 45,
        breakFrequency: 25, // minutes
        recommendedDays: ['Monday', 'Wednesday', 'Friday'],
        totalWeeklyHours: Math.ceil(metrics.averageStudyTime * 3 / 60)
      };

      return {
        success: true,
        schedule
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adjust quiz difficulty based on performance
   */
  async adjustDifficulty(userId, currentDifficulty, recentScore) {
    // Adaptive difficulty algorithm
    let newDifficulty = currentDifficulty;

    if (recentScore >= 90) {
      // Student is doing very well, increase difficulty
      if (currentDifficulty === 'beginner') newDifficulty = 'intermediate';
      else if (currentDifficulty === 'intermediate') newDifficulty = 'advanced';
    } else if (recentScore < 60) {
      // Student struggling, decrease difficulty
      if (currentDifficulty === 'advanced') newDifficulty = 'intermediate';
      else if (currentDifficulty === 'intermediate') newDifficulty = 'beginner';
    }

    return {
      success: true,
      currentDifficulty,
      recommendedDifficulty: newDifficulty,
      reason: recentScore >= 90 ? 'Excellent performance! Try harder challenges.' :
              recentScore < 60 ? 'Let\'s build confidence with easier content.' :
              'Current difficulty is perfect for you!'
    };
  }

  /**
   * Detect knowledge gaps using AI
   */
  async detectKnowledgeGaps(userId, subject) {
    const groq = this.getGroqClient();
    
    if (!groq) {
      return {
        success: true,
        gaps: [
          { topic: 'Advanced concepts', severity: 'medium' },
          { topic: 'Problem solving', severity: 'low' }
        ]
      };
    }

    try {
      const prompt = `For a student studying ${subject}, identify 3-4 common knowledge gaps or challenging topics that students typically struggle with. List them briefly.`;

      const response = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      });

      const gaps = response.choices[0].message.content
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 4)
        .map(gap => ({
          topic: gap.replace(/^\d+\.\s*/, '').trim(),
          severity: 'medium'
        }));

      return {
        success: true,
        gaps: gaps.length > 0 ? gaps : [
          { topic: 'Core concepts', severity: 'medium' },
          { topic: 'Application problems', severity: 'low' }
        ]
      };
    } catch (error) {
      return {
        success: true,
        gaps: [
          { topic: 'Core concepts', severity: 'medium' }
        ]
      };
    }
  }
}

export default new AdaptiveLearningService();
