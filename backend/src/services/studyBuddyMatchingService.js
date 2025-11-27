import Groq from 'groq-sdk';
import User from '../models/User.js';

class StudyBuddyMatchingService {
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
   * Find study buddy matches for a user using AI
   */
  async findMatches(userId, preferences = {}) {
    try {
      const user = await User.findById(userId)
        .select('username subjects studyGoals timezone studySchedule level');
      
      if (!user) {
        throw new Error('User not found');
      }

      // Get potential matches
      const potentialMatches = await User.find({
        _id: { $ne: userId },
        isActive: true,
        // Match by subjects (at least one in common)
        subjects: { $in: user.subjects || [] }
      })
      .select('username subjects studyGoals timezone studySchedule level lastActive')
      .limit(50);

      // Score and rank matches using AI
      const scoredMatches = await this.scoreMatches(user, potentialMatches, preferences);
      
      return {
        success: true,
        matches: scoredMatches.slice(0, 10), // Top 10 matches
        totalFound: scoredMatches.length
      };
    } catch (error) {
      console.error('Study buddy matching error:', error);
      throw error;
    }
  }

  /**
   * Score matches based on compatibility
   */
  async scoreMatches(user, potentialMatches, preferences) {
    const scored = potentialMatches.map(match => {
      let score = 0;
      const reasons = [];

      // Subject overlap (30 points max)
      const commonSubjects = user.subjects?.filter(s => 
        match.subjects?.includes(s)
      ) || [];
      score += Math.min(commonSubjects.length * 10, 30);
      if (commonSubjects.length > 0) {
        reasons.push(`Studying ${commonSubjects.join(', ')}`);
      }

      // Similar level (20 points)
      if (user.level && match.level) {
        const levelDiff = Math.abs(user.level - match.level);
        if (levelDiff <= 1) {
          score += 20;
          reasons.push('Similar skill level');
        } else if (levelDiff <= 2) {
          score += 10;
        }
      }

      // Compatible timezone (15 points)
      if (user.timezone && match.timezone) {
        const tzDiff = Math.abs(
          this.getTimezoneOffset(user.timezone) - 
          this.getTimezoneOffset(match.timezone)
        );
        if (tzDiff <= 2) {
          score += 15;
          reasons.push('Similar timezone');
        } else if (tzDiff <= 4) {
          score += 8;
        }
      }

      // Similar study goals (20 points)
      if (user.studyGoals && match.studyGoals) {
        const commonGoals = user.studyGoals.filter(g => 
          match.studyGoals.includes(g)
        );
        if (commonGoals.length > 0) {
          score += 20;
          reasons.push('Similar goals');
        }
      }

      // Recently active (15 points)
      if (match.lastActive) {
        const hoursSinceActive = (Date.now() - new Date(match.lastActive)) / (1000 * 60 * 60);
        if (hoursSinceActive <= 24) {
          score += 15;
          reasons.push('Active recently');
        } else if (hoursSinceActive <= 72) {
          score += 8;
        }
      }

      return {
        user: {
          id: match._id,
          username: match.username,
          subjects: match.subjects,
          level: match.level,
          timezone: match.timezone
        },
        matchScore: score,
        matchReasons: reasons,
        commonSubjects
      };
    });

    // Sort by score (highest first)
    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Get timezone offset (simplified)
   */
  getTimezoneOffset(timezone) {
    const offsets = {
      'America/New_York': -5,
      'America/Chicago': -6,
      'America/Denver': -7,
      'America/Los_Angeles': -8,
      'Europe/London': 0,
      'Europe/Paris': 1,
      'Asia/Tokyo': 9,
      'Asia/Shanghai': 8,
      'Australia/Sydney': 10
    };
    return offsets[timezone] || 0;
  }

  /**
   * Send study buddy request
   */
  async sendBuddyRequest(fromUserId, toUserId, message = '') {
    try {
      // In a real app, create a BuddyRequest model
      // For now, just return success
      return {
        success: true,
        message: 'Study buddy request sent!',
        requestId: `${fromUserId}-${toUserId}-${Date.now()}`
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get AI study suggestions for a pair
   */
  async getSuggestions(userId1, userId2) {
    try {
      const [user1, user2] = await Promise.all([
        User.findById(userId1).select('subjects studyGoals'),
        User.findById(userId2).select('subjects studyGoals')
      ]);

      const commonSubjects = user1.subjects?.filter(s => 
        user2.subjects?.includes(s)
      ) || [];

      const groq = this.getGroqClient();
      if (!groq || commonSubjects.length === 0) {
        return {
          suggestions: [
            'Start with a simple topic review',
            'Create flashcards together',
            'Quiz each other on key concepts'
          ]
        };
      }

      const prompt = `Two students want to study together. They both study: ${commonSubjects.join(', ')}. 
      Suggest 3 specific collaborative study activities they can do together. Be brief and actionable.`;

      const response = await groq.chat.completions.create({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 200
      });

      const suggestions = response.choices[0].message.content
        .split('\n')
        .filter(s => s.trim())
        .slice(0, 3);

      return {
        success: true,
        suggestions,
        commonSubjects
      };
    } catch (error) {
      return {
        suggestions: [
          'Review lecture notes together',
          'Create a study guide',
          'Practice problems as a team'
        ]
      };
    }
  }
}

export default new StudyBuddyMatchingService();
