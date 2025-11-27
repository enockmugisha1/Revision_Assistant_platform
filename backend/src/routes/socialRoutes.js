import express from 'express';
import studyBuddyMatching from '../services/studyBuddyMatchingService.js';
import peerTutoring from '../services/peerTutoringService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ============ STUDY BUDDY MATCHING ============

// GET /api/social/buddies/matches - Find study buddy matches
router.get('/buddies/matches', protect, async (req, res) => {
  try {
    const preferences = {
      subjects: req.query.subjects?.split(','),
      timezone: req.query.timezone
    };

    const matches = await studyBuddyMatching.findMatches(req.user.id, preferences);
    res.json(matches);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST /api/social/buddies/request - Send buddy request
router.post('/buddies/request', protect, async (req, res) => {
  try {
    const { toUserId, message } = req.body;
    
    const result = await studyBuddyMatching.sendBuddyRequest(
      req.user.id,
      toUserId,
      message
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/social/buddies/suggestions - Get AI study suggestions
router.get('/buddies/suggestions/:buddyId', protect, async (req, res) => {
  try {
    const suggestions = await studyBuddyMatching.getSuggestions(
      req.user.id,
      req.params.buddyId
    );
    
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============ PEER TUTORING ============

// GET /api/social/tutors - Find tutors
router.get('/tutors', protect, async (req, res) => {
  try {
    const { subject, minRating, maxRate, availability } = req.query;
    
    const tutors = await peerTutoring.findTutors(subject, {
      minRating: minRating ? parseFloat(minRating) : undefined,
      maxRate: maxRate ? parseFloat(maxRate) : undefined,
      availability
    });
    
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST /api/social/tutors/become - Become a tutor
router.post('/tutors/become', protect, async (req, res) => {
  try {
    const result = await peerTutoring.becomeTutor(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST /api/social/tutors/book - Book a session
router.post('/tutors/book', protect, async (req, res) => {
  try {
    const { tutorId, subject, date, duration } = req.body;
    
    const session = await peerTutoring.bookSession(
      req.user.id,
      tutorId,
      { subject, date, duration }
    );
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST /api/social/tutors/rate - Rate a session
router.post('/tutors/rate', protect, async (req, res) => {
  try {
    const { sessionId, rating, review } = req.body;
    
    const result = await peerTutoring.rateSession(sessionId, rating, review);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/social/tutors/:tutorId/stats - Get tutor stats
router.get('/tutors/:tutorId/stats', protect, async (req, res) => {
  try {
    const stats = await peerTutoring.getTutorStats(req.params.tutorId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============ ONLINE USERS ============

// GET /api/social/online - Get online users
router.get('/online', protect, async (req, res) => {
  try {
    // In real app, use Socket.IO presence
    // For now, return mock data
    res.json({
      success: true,
      onlineUsers: [],
      count: 0
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;
