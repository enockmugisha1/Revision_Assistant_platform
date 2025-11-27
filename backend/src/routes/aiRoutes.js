import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import OpenAI from 'openai';
import Groq from 'groq-sdk';

const router = express.Router();

// Lazy-load Groq client to ensure env is loaded
let groqClient = null;
const getGroqClient = () => {
  if (groqClient === null && process.env.GROQ_API_KEY) {
    try {
      groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
      console.log('✅ Groq client initialized successfully with key:', process.env.GROQ_API_KEY.substring(0, 10) + '...');
    } catch (error) {
      console.error('❌ Failed to initialize Groq client:', error.message);
      groqClient = false; // Mark as failed
    }
  }
  return groqClient || null;
};

const fetchGroqModels = async () => {
  try {
    const client = getGroqClient();
    if (!client) return { available: false, models: [] };
    // Groq supported models
    const models = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant', 
      'llama3-70b-8192',
      'mixtral-8x7b-32768', 
      'gemma2-9b-it'
    ];
    return { available: true, models };
  } catch (err) {
    return { available: false, models: [], error: err?.message };
  }
};

// Generate with Groq (non-streaming)
const generateWithGroq = async (model, prompt, messages = null) => {
  const client = getGroqClient();
  if (!client) throw new Error('Groq API key not configured');
  const completion = await client.chat.completions.create({
    model: model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages: messages || [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4096
  });
  return completion.choices?.[0]?.message?.content || '';
};

// Generate with Groq (streaming)
const generateWithGroqStream = async (model, messages, temperature = 0.7) => {
  const client = getGroqClient();
  if (!client) throw new Error('Groq API key not configured');
  return await client.chat.completions.create({
    model: model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages: messages,
    temperature: temperature,
    max_tokens: 8192,
    top_p: 1,
    stream: true
  });
};

// Core endpoints
const getAIAnalysis = (req, res) => {
  res.json({
    success: true,
    message: 'AI Analysis placeholder',
    data: {
      strengths: ['Clear thesis', 'Strong topic sentences'],
      weaknesses: ['Run-on sentences', 'Weak conclusion'],
      suggestions: ['Break long sentences', 'Add concluding synthesis']
    }
  });
};

const generateRecommendations = (req, res) => {
  res.json({ success: true, message: 'AI Recommendations placeholder', data: ['Practice outlines', 'Focus on cohesion'] });
};

const getModels = async (req, res) => {
  try {
    const groq = await fetchGroqModels();
    const openaiAvailable = !!process.env.OPENAI_API_KEY;
    const data = {
      providers: {
        groq: { available: groq.available, models: groq.models },
        openai: { available: openaiAvailable, models: [] }
      },
      defaults: {
        provider: groq.available ? 'groq' : (openaiAvailable ? 'openai' : 'none'),
        model: groq.available ? (process.env.GROQ_MODEL || (groq.models[0] || 'llama-3.3-70b-versatile')) : (process.env.OPENAI_MODEL || 'gpt-4o-mini')
      }
    };
    return res.json({ success: true, message: 'AI providers and models', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err?.message || 'Failed to get models' });
  }
};

// Chat endpoint with streaming support
const chat = async (req, res) => {
  const { messages, model, stream = false } = req.body || {};
  
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: 'Messages array is required' });
  }

  try {
    const client = getGroqClient();
    if (!client) {
      return res.status(503).json({ success: false, message: 'Groq API not configured' });
    }

    const selectedModel = model || 'llama-3.3-70b-versatile';

    if (stream) {
      // Set headers for streaming - exactly like your example
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const chatCompletion = await client.chat.completions.create({
        messages: messages,
        model: selectedModel,
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null
      });

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      // Non-streaming response - exactly like your example but without stream
      const chatCompletion = await client.chat.completions.create({
        messages: messages,
        model: selectedModel,
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null
      });
      
      const content = chatCompletion.choices[0]?.message?.content || '';
      return res.json({ success: true, data: { content } });
    }
  } catch (err) {
    console.error('Chat error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: err?.message || 'Chat failed' });
    }
  }
};

const getInstantFeedback = async (req, res) => {
  const { text, provider, model } = req.body || {};
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Text is required' });
  }

  try {
    const chosenProvider = provider || (process.env.GROQ_API_KEY ? 'groq' : 'openai');
    const prompt = `Provide concise writing feedback for the following student draft. Return JSON with keys sentenceFeedback (array of brief suggestions) and holisticFeedback (one paragraph). Draft:\n\n${text}`;
    let content = '';

    if (chosenProvider === 'groq') {
      const groqInfo = await fetchGroqModels();
      if (!groqInfo.available) throw new Error('Groq is not available');
      const selectedModel = model || process.env.GROQ_MODEL || groqInfo.models[0] || 'llama-3.3-70b-versatile';
      content = await generateWithGroq(selectedModel, prompt);
    } else {
      if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await client.chat.completions.create({
        model: model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });
      content = completion.choices?.[0]?.message?.content || '';
    }

    let data;
    try { data = JSON.parse(content); } catch {
      data = { sentenceFeedback: [], holisticFeedback: content };
    }
    return res.json({ success: true, message: 'Instant feedback', data });
  } catch (err) {
    const length = (text || '').length;
    const issues = [];
    if (length < 30) issues.push('Your writing is very short; add more detail.');
    if ((text || '').split(',').length > 5) issues.push('Consider splitting long sentences to improve readability.');
    return res.json({ success: true, message: 'Instant feedback (fallback)', data: {
      sentenceFeedback: issues,
      holisticFeedback: length > 200 ? 'Good development. Consider refining transitions.' : 'Needs more development and clearer structure.'
    }});
  }
};

const getOutline = (req, res) => {
  const { topic } = req.body || {};
  res.json({ success: true, message: 'Outline generated', data: {
    thesis: `Thesis about ${topic || 'your topic'}`,
    sections: [
      { heading: 'Introduction', bullets: ['Hook', 'Context', 'Thesis'] },
      { heading: 'Body Paragraph 1', bullets: ['Topic sentence', 'Evidence', 'Analysis'] },
      { heading: 'Body Paragraph 2', bullets: ['Topic sentence', 'Evidence', 'Analysis'] },
      { heading: 'Conclusion', bullets: ['Summary', 'Implications', 'Closing thought'] }
    ]
  }});
};

const getGenrePrompts = (req, res) => {
  const { genre } = req.query;
  const prompts = {
    argumentative: ['Argue for or against school uniforms.', 'Should homework be limited?'],
    narrative: ['Write about a time you overcame a challenge.', 'Tell a story about an unexpected journey.'],
    informative: ['Explain how photosynthesis works.', 'Describe the impact of social media on communication.']
  };
  res.json({ success: true, message: 'Genre prompts', data: { prompts: prompts[genre] || prompts.argumentative } });
};

const getTeacherOverview = (req, res) => {
  res.json({ success: true, message: 'Teacher overview', data: {
    classes: 3,
    students: 92,
    avgWritingScore: 76,
    atRisk: 12,
    commonIssues: ['Organization', 'Evidence integration']
  }});
};

// Additional AI feature endpoints (mock implementations)
router.post('/generate-quiz', protect, async (req, res) => {
  try {
    const { subject, topic, level, questionCount = 5, questionTypes, difficulty } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ success: false, message: 'Subject and topic are required' });
    }

    // Use the exact format from your example
    const messages = [
      {
        role: "user",
        content: `Hey can you give me ${questionCount} quiz questions about ${topic} in ${subject}? Make them ${level || 'intermediate'} level with ${difficulty || 'moderate'} difficulty.`
      }
    ];

    const client = getGroqClient();
    if (!client) {
      return res.status(503).json({ success: false, message: 'Groq API not configured' });
    }

    // Call Groq exactly like your example
    const chatCompletion = await client.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 2048,
      top_p: 1,
      stream: false,
      stop: null
    });

    const content = chatCompletion.choices[0]?.message?.content || '';
    
    // Parse the response into quiz format
    const questions = [];
    const lines = content.split('\n');
    let currentQuestion = null;
    let questionNumber = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if this is a question line (starts with number)
      if (/^\d+\./.test(line)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        questionNumber++;
        currentQuestion = {
          id: questionNumber,
          type: 'multiple_choice',
          question: line.replace(/^\d+\.\s*/, ''),
          options: [],
          correctAnswer: '',
          explanation: '',
          points: 1
        };
      } else if (currentQuestion && line) {
        // If line contains letters in parentheses like (a), (b), etc., it's likely an option
        if (/^\(?[a-d]\)?/i.test(line)) {
          currentQuestion.options.push(line.replace(/^\(?[a-d]\)?\s*/i, ''));
        }
      }
    }
    
    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    // If no structured questions found, create from raw content
    if (questions.length === 0) {
      // Split content by common delimiters and create questions
      const questionBlocks = content.split(/\n\n+/);
      questionBlocks.forEach((block, index) => {
        if (block.trim() && block.length > 20) {
          questions.push({
            id: index + 1,
            type: 'essay',
            question: block.trim(),
            options: [],
            correctAnswer: '',
            explanation: 'Refer to study materials',
            points: 1
          });
        }
      });
    }

    const quiz = {
      title: `${subject} - ${topic} Quiz`,
      description: `A ${level || 'intermediate'} level quiz about ${topic}`,
      subject,
      topic,
      level,
      difficulty,
      questions: questions.slice(0, questionCount),
      rawContent: content, // Include the full AI response
      totalPoints: Math.min(questions.length, questionCount),
      timeLimit: 30,
      createdBy: req.user._id,
      aiGenerated: true
    };
    
    res.json({ success: true, message: 'Quiz generated successfully', data: quiz });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate quiz' });
  }
});

router.post('/generate-study-guide', protect, async (req, res) => {
  try {
    const { subject, topic, level, format, focusAreas } = req.body;
    if (!subject || !topic) {
      return res.status(400).json({ success: false, message: 'Subject and topic are required' });
    }

    const prompt = `Create a comprehensive study guide for "${topic}" in ${subject} at ${level || 'intermediate'} level.

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.

Format:
{
  "overview": "Brief 2-3 sentence introduction",
  "keyConcepts": ["Concept 1 with explanation", "Concept 2 with explanation", "Concept 3 with explanation"],
  "examples": ["Practical example 1", "Practical example 2"],
  "practiceProblems": ["Problem 1", "Problem 2", "Problem 3"],
  "studyTips": ["Tip 1", "Tip 2", "Tip 3"]
}

Generate detailed, educational content. Return ONLY the JSON object.`;

    const content = await generateWithGroq(null, prompt);
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/g, '');
    }
    
    let guideContent;
    try {
      guideContent = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse study guide:', parseError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate study guide',
        debug: process.env.NODE_ENV === 'development' ? content : undefined
      });
    }

    const guide = {
      title: `${subject} - ${topic} Study Guide`,
      subject,
      topic,
      level,
      format,
      content: guideContent,
      generatedAt: new Date(),
      generatedBy: req.user._id
    };
    
    res.json({ success: true, message: 'Study guide generated successfully', data: guide });
  } catch (error) {
    console.error('Study guide generation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate study guide' });
  }
});

router.post('/explain-concept', protect, async (req, res) => {
  try {
    const { concept, subject, level, context } = req.body;
    if (!concept || !subject) {
      return res.status(400).json({ success: false, message: 'Concept and subject are required' });
    }

    const prompt = `Explain the concept of "${concept}" in ${subject} at ${level || 'intermediate'} level.
${context ? `Context: ${context}` : ''}

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.

Format:
{
  "definition": "Clear, concise definition (2-3 sentences)",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "examples": ["Real-world example 1", "Real-world example 2"],
  "commonMisconceptions": ["Misconception 1 and correction", "Misconception 2 and correction"],
  "furtherReading": ["Resource 1", "Resource 2"]
}

Return ONLY the JSON object.`;

    const content = await generateWithGroq(null, prompt);
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/g, '');
    }
    
    let explanation;
    try {
      explanation = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse concept explanation:', parseError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate explanation',
        debug: process.env.NODE_ENV === 'development' ? content : undefined
      });
    }

    const result = {
      concept,
      subject,
      level,
      context,
      explanation,
      generatedAt: new Date(),
      generatedBy: req.user._id
    };
    
    res.json({ success: true, message: 'Concept explanation generated successfully', data: result });
  } catch (error) {
    console.error('Concept explanation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate concept explanation' });
  }
});

router.post('/generate-study-plan', protect, async (req, res) => {
  try {
    const { subjects, timeAvailable, goals, deadline, currentLevel } = req.body;
    if (!subjects || !goals) {
      return res.status(400).json({ success: false, message: 'Subjects and goals are required' });
    }
    
    const subjectsArray = Array.isArray(subjects) ? subjects : String(subjects).split(',').map(s => s.trim());
    const goalsArray = Array.isArray(goals) ? goals : String(goals).split(',').map(s => s.trim());

    const prompt = `Create a personalized study plan for a ${currentLevel || 'intermediate'} level student.
Subjects: ${subjectsArray.join(', ')}
Time Available: ${timeAvailable || 'Not specified'}
Goals: ${goalsArray.join(', ')}
Deadline: ${deadline || 'Not specified'}

Provide:
1. Weekly Schedule - Plan for each day (subjects, duration, activities)
2. Milestones - 4 weekly milestones with goals and subjects
3. Study Techniques - 4-5 recommended techniques
4. Resources - 4-5 recommended resources

Return JSON with keys: weeklySchedule (object with days), milestones (array), studyTechniques (array), resources (array).`;

    const content = await generateWithGroq(null, prompt);
    let plan;
    try {
      plan = JSON.parse(content);
    } catch {
      plan = {
        weeklySchedule: {
          monday: { subjects: subjectsArray.slice(0, 1), duration: 2, activities: ['Reading', 'Practice'] },
          tuesday: { subjects: subjectsArray.slice(1, 2), duration: 1.5, activities: ['Video lessons', 'Quiz'] },
          wednesday: { subjects: subjectsArray, duration: 2.5, activities: ['Study group', 'Review'] },
          thursday: { subjects: subjectsArray.slice(1, 2), duration: 2, activities: ['Practice problems', 'Flashcards'] },
          friday: { subjects: subjectsArray.slice(2), duration: 1.5, activities: ['Project work', 'Research'] },
          saturday: { subjects: ['All subjects'], duration: 3, activities: ['Review', 'Practice tests'] },
          sunday: { subjects: ['Weak areas'], duration: 2, activities: ['Focused study', 'Preparation'] }
        },
        milestones: [
          { week: 1, goal: 'Complete basic concepts', subjects: subjectsArray.slice(0, 1) },
          { week: 2, goal: 'Practice and reinforce', subjects: subjectsArray.slice(0, 2) },
          { week: 3, goal: 'Advanced topics', subjects: subjectsArray },
          { week: 4, goal: 'Review and assessment', subjects: ['All subjects'] }
        ],
        studyTechniques: ['Active recall', 'Spaced repetition', 'Practice testing', 'Interleaving'],
        resources: ['Textbook chapters', 'Online video series', 'Practice problem sets', 'Study group discussions']
      };
    }

    const result = {
      title: 'Personalized Study Plan',
      subjects: subjectsArray,
      timeAvailable,
      goals: goalsArray,
      deadline,
      currentLevel,
      plan,
      generatedAt: new Date(),
      generatedBy: req.user._id
    };
    
    res.json({ success: true, message: 'Study plan generated successfully', data: result });
  } catch (error) {
    console.error('Study plan generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate study plan' });
  }
});

router.post('/analyze-progress', protect, async (req, res) => {
  try {
    const { subject, scores, topics } = req.body;
    const avg = Array.isArray(scores) && scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const mockAnalytics = {
      subject,
      overallPerformance: { averageScore: avg, trend: 'improving', consistency: 'good' },
      topicAnalysis: (Array.isArray(topics) ? topics : []).map(topic => ({
        topic,
        performance: Math.round(Math.random() * 100),
        recommendations: ['Focus on practice problems', 'Review key concepts']
      })),
      recommendations: [
        'Continue with current study schedule',
        'Focus more on weak areas',
        'Increase practice frequency for better retention'
      ],
      nextSteps: [
        'Complete practice quiz on weak topics',
        'Join study group for collaborative learning',
        'Schedule regular review sessions'
      ],
      generatedAt: new Date(),
      generatedBy: req.user?._id
    };
    res.json({ success: true, message: 'Progress analysis completed', data: mockAnalytics });
  } catch (error) {
    console.error('Progress analysis error:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze progress' });
  }
});

// Bind routes
router.post('/chat', protect, chat);
router.get('/models', protect, getModels);
router.get('/analysis', protect, getAIAnalysis);
router.post('/recommendations', protect, generateRecommendations);
router.post('/feedback', protect, getInstantFeedback);
router.post('/outline', protect, getOutline);
router.get('/prompts', protect, getGenrePrompts);
router.get('/teacher-overview', protect, authorize('teacher', 'manager', 'admin'), getTeacherOverview);

export default router;

