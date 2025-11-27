import User from '../models/User.js';

class PeerTutoringService {
  /**
   * Find tutors for a subject
   */
  async findTutors(subject, filters = {}) {
    try {
      const query = {
        'tutorProfile.isActive': true,
        'tutorProfile.subjects': subject
      };

      // Apply filters
      if (filters.minRating) {
        query['tutorProfile.rating'] = { $gte: filters.minRating };
      }

      if (filters.maxRate) {
        query['tutorProfile.hourlyRate'] = { $lte: filters.maxRate };
      }

      if (filters.availability) {
        query['tutorProfile.availability'] = { $elemMatch: { day: filters.availability } };
      }

      const tutors = await User.find(query)
        .select('username tutorProfile avatar')
        .limit(20)
        .sort({ 'tutorProfile.rating': -1, 'tutorProfile.sessionsCompleted': -1 });

      return {
        success: true,
        tutors: tutors.map(t => ({
          id: t._id,
          username: t.username,
          avatar: t.avatar,
          subjects: t.tutorProfile.subjects,
          rating: t.tutorProfile.rating || 0,
          hourlyRate: t.tutorProfile.hourlyRate || 0,
          sessionsCompleted: t.tutorProfile.sessionsCompleted || 0,
          bio: t.tutorProfile.bio,
          availability: t.tutorProfile.availability
        })),
        total: tutors.length
      };
    } catch (error) {
      console.error('Find tutors error:', error);
      throw error;
    }
  }

  /**
   * Become a tutor
   */
  async becomeTutor(userId, tutorData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.tutorProfile = {
        isActive: true,
        subjects: tutorData.subjects || [],
        hourlyRate: tutorData.hourlyRate || 0,
        bio: tutorData.bio || '',
        availability: tutorData.availability || [],
        qualifications: tutorData.qualifications || [],
        rating: 0,
        sessionsCompleted: 0
      };

      await user.save();

      return {
        success: true,
        message: 'You are now a tutor!',
        tutorProfile: user.tutorProfile
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Book a tutoring session
   */
  async bookSession(studentId, tutorId, sessionData) {
    try {
      // In a real app, create TutoringSession model
      // For now, return success
      const session = {
        id: `session-${Date.now()}`,
        student: studentId,
        tutor: tutorId,
        subject: sessionData.subject,
        date: sessionData.date,
        duration: sessionData.duration || 60,
        status: 'pending',
        meetingLink: `https://meet.example.com/${Date.now()}`
      };

      return {
        success: true,
        message: 'Session booked! Tutor will confirm shortly.',
        session
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Rate a tutoring session
   */
  async rateSession(sessionId, rating, review) {
    try {
      // Update tutor rating
      // In real app, update TutoringSession and User models
      
      return {
        success: true,
        message: 'Thank you for your feedback!'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get tutor stats
   */
  async getTutorStats(tutorId) {
    try {
      const tutor = await User.findById(tutorId).select('tutorProfile');
      
      if (!tutor || !tutor.tutorProfile) {
        throw new Error('Tutor not found');
      }

      return {
        success: true,
        stats: {
          rating: tutor.tutorProfile.rating || 0,
          sessionsCompleted: tutor.tutorProfile.sessionsCompleted || 0,
          subjects: tutor.tutorProfile.subjects || [],
          earnings: (tutor.tutorProfile.sessionsCompleted || 0) * (tutor.tutorProfile.hourlyRate || 0)
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new PeerTutoringService();
