import express from 'express';
import axios from 'axios';
import Groq from 'groq-sdk';
import { protect } from '../middleware/authMiddleware.js';
import {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  addRating,
  toggleBookmark,
  recordDownload
} from '../controllers/resourceController.js';

const router = express.Router();

// Lazy-load Groq client
let groqClient = null;
const getGroqClient = () => {
  if (groqClient === null && process.env.GROQ_API_KEY) {
    try {
      groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
      console.log('✅ Groq client initialized for resources');
    } catch (error) {
      console.error('❌ Failed to initialize Groq client:', error.message);
      groqClient = false;
    }
  }
  return groqClient || null;
};

// Resource CRUD routes
router.get('/', protect, getResources);
router.get('/:id', protect, getResource);
router.post('/', protect, createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);

// Resource actions
router.post('/:id/ratings', protect, addRating);
router.post('/:id/bookmark', protect, toggleBookmark);
router.post('/:id/download', protect, recordDownload);

// AI-powered resource features  
router.post('/:id/ai/explain', protect, async (req, res) => {
  try {
    const Resource = (await import('../models/Resource.js')).default;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const client = getGroqClient();
    if (!client) {
      return res.status(503).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    const prompt = `Provide a comprehensive, deep explanation of the following educational resource:

Title: ${resource.title}
Subject: ${resource.subject}
Level: ${resource.level}
Description: ${resource.description || 'Not provided'}
Type: ${resource.type}

Please provide:
1. A detailed overview explaining what this resource covers
2. Key concepts and learning objectives
3. How to best use this resource for studying
4. Related topics students should explore
5. Prerequisites students should know before using this resource
6. Tips for maximizing learning from this resource

Format the response as JSON with keys: overview, keyConcepts, howToUse, relatedTopics, prerequisites, studyTips`;

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048
    });

    const content = completion.choices[0]?.message?.content || '';
    
    let explanation;
    try {
      let cleanedContent = content.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/```\n?/g, '');
      }
      explanation = JSON.parse(cleanedContent);
    } catch {
      explanation = {
        overview: content,
        keyConcepts: [],
        howToUse: 'Study this resource carefully and take notes on key points.',
        relatedTopics: [],
        prerequisites: [],
        studyTips: ['Review regularly', 'Practice actively', 'Connect to real examples']
      };
    }

    // Update resource with deep explanation
    resource.deepExplanation = JSON.stringify(explanation);
    if (explanation.relatedTopics) resource.relatedTopics = explanation.relatedTopics;
    if (explanation.prerequisites) resource.prerequisites = explanation.prerequisites;
    if (explanation.keyConcepts) resource.learningObjectives = explanation.keyConcepts;
    await resource.save();

    res.json({
      success: true,
      message: 'Deep explanation generated successfully',
      data: {
        resourceId: resource._id,
        explanation
      }
    });
  } catch (error) {
    console.error('Deep explanation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate explanation'
    });
  }
});

// RapidAPI: Balancing Studies proxy
router.get('/balancing-studies', protect, async (req, res) => {
  try {
    const apiKey = process.env.RAPIDAPI_BALANCING_STUDIES_KEY || process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Missing RAPIDAPI_BALANCING_STUDIES_KEY' });
    }

    // Forward optional path and query to RapidAPI
    const { path = '', ...query } = req.query || {};
    const url = `https://balancing-studies.p.rapidapi.com/${String(path).replace(/^\//, '')}`;

    const response = await axios.get(url, {
      params: query,
      headers: {
        'x-rapidapi-host': 'balancing-studies.p.rapidapi.com',
        'x-rapidapi-key': apiKey
      },
      timeout: 15000
    });

    return res.json({ success: true, data: response.data });
  } catch (error) {
    const status = error.response?.status || 502;
    const message = error.response?.data?.message || error.message || 'Upstream API error';
    return res.status(status).json({ success: false, message });
  }
});

export default router;
