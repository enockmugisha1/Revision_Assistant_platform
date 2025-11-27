import express from 'express';
import adaptiveLearning from '../services/adaptiveLearningService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/adaptive/profile - Get student's learning profile analysis
router.get('/profile', protect, async (req, res) => {
  try {
    const analysis = await adaptiveLearning.analyzeStudentProfile(req.user.id);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/adaptive/exam-readiness/:subject - Predict exam readiness
router.get('/exam-readiness/:subject', protect, async (req, res) => {
  try {
    const readiness = await adaptiveLearning.predictExamReadiness(
      req.user.id,
      req.params.subject
    );
    res.json(readiness);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/adaptive/schedule - Get optimal study schedule
router.get('/schedule', protect, async (req, res) => {
  try {
    const schedule = await adaptiveLearning.getOptimalSchedule(req.user.id);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST /api/adaptive/adjust-difficulty - Adjust difficulty based on performance
router.post('/adjust-difficulty', protect, async (req, res) => {
  try {
    const { currentDifficulty, recentScore } = req.body;
    
    const adjustment = await adaptiveLearning.adjustDifficulty(
      req.user.id,
      currentDifficulty,
      recentScore
    );
    
    res.json(adjustment);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/adaptive/knowledge-gaps/:subject - Detect knowledge gaps
router.get('/knowledge-gaps/:subject', protect, async (req, res) => {
  try {
    const gaps = await adaptiveLearning.detectKnowledgeGaps(
      req.user.id,
      req.params.subject
    );
    res.json(gaps);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;
