import express from 'express';
import voiceAssistant from '../services/voiceAssistantService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/voice/ask - Send text message, get AI response
router.post('/ask', protect, async (req, res) => {
  try {
    const { message, subject } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }
    
    const result = await voiceAssistant.getAIResponse(
      req.user.id, 
      message,
      subject
    );
    
    res.json(result);
  } catch (error) {
    console.error('Voice ask error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/voice/history - Get conversation history
router.get('/history', protect, (req, res) => {
  try {
    const history = voiceAssistant.getConversationHistory(req.user.id);
    res.json({
      success: true,
      history,
      count: history.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// DELETE /api/voice/history - Clear conversation history
router.delete('/history', protect, (req, res) => {
  try {
    const result = voiceAssistant.clearHistory(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/voice/suggestions - Get study suggestions
router.get('/suggestions', protect, async (req, res) => {
  try {
    const suggestions = await voiceAssistant.generateStudySuggestions(req.user.id);
    res.json({
      success: true,
      ...suggestions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET /api/voice/stats - Get conversation stats (admin)
router.get('/stats', protect, (req, res) => {
  try {
    const stats = voiceAssistant.getActiveConversations();
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default router;
