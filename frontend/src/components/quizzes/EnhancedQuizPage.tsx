import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon,
  SparklesIcon,
  PlayIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Quiz {
  _id: string;
  title: string;
  subject: string;
  difficulty?: string;
  level?: string;
  questions: any[];
  timeLimit?: number;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PendingQuiz {
  quiz: any;
  message: string;
}

const EnhancedQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'ai'>('quizzes');
  const [pendingQuiz, setPendingQuiz] = useState<PendingQuiz | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadQuizzes = async () => {
    try {
      const response = await api.get('/quizzes');
      const quizzesData = response.data.data?.docs || response.data.quizzes || [];
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Load quizzes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsSending(true);

    try {
      // Check if this is a quiz generation request
      const isQuizRequest = /generate.*quiz|create.*quiz|make.*quiz|quiz.*about/i.test(currentInput);
      
      let aiResponse;
      if (isQuizRequest) {
        // Use generate-quiz endpoint for better formatting
        const response = await api.post('/ai/chat', {
          messages: [
            ...chatMessages.map(msg => ({ role: msg.role, content: msg.content })),
            { 
              role: 'user', 
              content: currentInput + '\n\nPlease format the quiz as:\nQuestion 1: [question text]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect Answer: [A/B/C/D]\n\nRepeat for each question.'
            }
          ]
        });
        aiResponse = response.data.data?.content || response.data.content;
        
        // Try to parse quiz and show save dialog
        try {
          const quiz = parseQuizFromAI(aiResponse, currentInput);
          if (quiz && quiz.questions.length > 0) {
            // Show save confirmation dialog
            setPendingQuiz({ quiz, message: aiResponse });
            setShowSaveDialog(true);
            toast.info('📝 Quiz generated! Would you like to save it?');
          }
        } catch (parseError) {
          console.log('Could not parse quiz:', parseError);
        }
      } else {
        // Regular chat
        const response = await api.post('/ai/chat', {
          messages: [
            ...chatMessages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: currentInput }
          ]
        });
        aiResponse = response.data.data?.content || response.data.content;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || 'Sorry, I couldn\'t process that.',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.response?.data?.message || 'Sorry, I encountered an error.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const parseQuizFromAI = (aiResponse: string, userInput: string) => {
    // Extract subject and topic from user input
    const subjectMatch = userInput.match(/about\s+(\w+)|(\w+)\s+quiz/i);
    const subject = subjectMatch ? subjectMatch[1] || subjectMatch[2] : 'General';
    
    const levelMatch = userInput.match(/(beginner|intermediate|advanced)/i);
    const level = levelMatch ? levelMatch[1].toLowerCase() : 'intermediate';

    const questions = [];
    const lines = aiResponse.split('\n');
    let currentQuestion: any = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Match "Question 1:" or "1." or "Q1:"
      if (/^(Question\s*\d+:|Q\d+:|\d+\.)/i.test(line)) {
        if (currentQuestion && currentQuestion.question) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          type: 'multiple_choice',
          question: line.replace(/^(Question\s*\d+:|Q\d+:|\d+\.)\s*/i, ''),
          options: [],
          correctAnswer: '',
          points: 10
        };
      }
      // Match options "A)", "B)", etc.
      else if (currentQuestion && /^[A-D]\)/i.test(line)) {
        const optionText = line.replace(/^[A-D]\)\s*/i, '');
        currentQuestion.options.push({ text: optionText, isCorrect: false });
      }
      // Match "Correct Answer: A" or "Answer: A"
      else if (currentQuestion && /correct\s*answer|answer:/i.test(line)) {
        const answerMatch = line.match(/[A-D]/i);
        if (answerMatch) {
          const correctLetter = answerMatch[0].toUpperCase();
          const correctIndex = correctLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
          if (currentQuestion.options[correctIndex]) {
            currentQuestion.options[correctIndex].isCorrect = true;
            currentQuestion.correctAnswer = correctIndex;
          }
        }
      }
    }

    if (currentQuestion && currentQuestion.question) {
      questions.push(currentQuestion);
    }

    // If no structured questions found, create simple ones from content
    if (questions.length === 0) {
      const blocks = aiResponse.split(/\n\n+/);
      blocks.forEach((block, index) => {
        if (block.trim().length > 20 && index < 10) {
          questions.push({
            type: 'essay',
            question: block.trim(),
            options: [],
            correctAnswer: '',
            points: 10
          });
        }
      });
    }

    return {
      title: `${subject} Quiz`,
      description: `AI-generated quiz about ${subject}`,
      subject: subject,
      level: level,
      questions: questions.slice(0, 20), // Max 20 questions
      timeLimit: questions.length * 2, // 2 minutes per question
      category: 'practice',
      tags: [subject, level, 'ai-generated'],
      isPublic: false
    };
  };

  const handleSaveQuiz = async () => {
    if (!pendingQuiz) return;
    
    try {
      const saveResponse = await api.post('/quizzes', pendingQuiz.quiz);
      if (saveResponse.data.success) {
        toast.success('✅ Quiz saved successfully!');
        setShowSaveDialog(false);
        setPendingQuiz(null);
        loadQuizzes();
        setActiveTab('quizzes'); // Switch to quizzes tab
      }
    } catch (error: any) {
      console.error('Save quiz error:', error);
      toast.error('Failed to save quiz: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz? This cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/quizzes/${quizId}`);
      toast.success('🗑️ Quiz deleted successfully');
      loadQuizzes();
    } catch (error: any) {
      console.error('Delete quiz error:', error);
      toast.error('Failed to delete quiz');
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowEditDialog(true);
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz) return;

    try {
      const response = await api.put(`/quizzes/${editingQuiz._id}`, {
        title: editingQuiz.title,
        description: editingQuiz.description,
        subject: editingQuiz.subject
      });
      
      if (response.data.success) {
        toast.success('✅ Quiz updated successfully!');
        setShowEditDialog(false);
        setEditingQuiz(null);
        loadQuizzes();
      }
    } catch (error: any) {
      console.error('Update quiz error:', error);
      toast.error('Failed to update quiz');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "Generate a 5-question quiz about Mathematics",
    "Create an intermediate level Science quiz",
    "Help me study for my History exam"
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Quizzes & AI Assistant</h1>
            <p className="text-white/90 text-lg">Chat with AI or take quizzes</p>
          </div>
          <div className="hidden md:block text-7xl">🤖</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'quizzes'
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <AcademicCapIcon className="w-5 h-5" />
              <span>Your Quizzes ({quizzes.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              activeTab === 'ai'
                ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <SparklesIcon className="w-5 h-5" />
              <span>AI Chat</span>
            </div>
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'quizzes' && (
              <div className="space-y-6">
                {quizzes.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">🎯</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No Quizzes Yet</h3>
                    <p className="text-gray-500 mb-6">Chat with AI to generate quizzes!</p>
                    <button
                      onClick={() => setActiveTab('ai')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Start Chatting with AI
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz, index) => (
                      <motion.div
                        key={quiz._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group border-2 border-transparent hover:border-purple-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors mb-2">
                              {quiz.title}
                            </h3>
                            <p className="text-sm text-gray-600">{quiz.subject}</p>
                          </div>
                          <AcademicCapIcon className="w-8 h-8 text-purple-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-purple-200 mb-3">
                          <span className="text-sm text-gray-600">{quiz.questions?.length || 0} questions</span>
                          {(quiz.difficulty || quiz.level) && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              (quiz.difficulty || quiz.level) === 'beginner' ? 'bg-green-100 text-green-700' :
                              (quiz.difficulty || quiz.level) === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {(quiz.difficulty || quiz.level)?.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/quizzes/${quiz._id}/take`);
                            }}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center space-x-2"
                          >
                            <PlayIcon className="w-4 h-4" />
                            <span>Start</span>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditQuiz(quiz);
                            }}
                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit quiz"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuiz(quiz._id);
                            }}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete quiz"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                      <SparklesIcon className="w-6 h-6 text-purple-600" />
                      <span>AI Study Assistant</span>
                    </h3>
                    {chatMessages.length > 0 && (
                      <button
                        onClick={() => setChatMessages([])}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        Clear Chat
                      </button>
                    )}
                  </div>

                  <div className="bg-white rounded-xl p-4 mb-4 h-96 overflow-y-auto space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="text-6xl mb-4">💬</div>
                        <h4 className="text-xl font-semibold text-gray-700 mb-2">Start a conversation!</h4>
                        <p className="text-gray-500 mb-6 max-w-md">
                          Ask me to generate quizzes, explain concepts, or help you study.
                        </p>
                        <div className="space-y-2">
                          {quickPrompts.map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => setInputMessage(prompt)}
                              className="block w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-start space-x-2 max-w-[80%] ${
                              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                message.role === 'user' ? 'bg-purple-500' : 'bg-gradient-to-br from-pink-400 to-purple-500'
                              }`}>
                                {message.role === 'user' ? (
                                  <UserCircleIcon className="w-5 h-5 text-white" />
                                ) : (
                                  <SparklesIcon className="w-5 h-5 text-white" />
                                )}
                              </div>
                              <div>
                                <div className={`rounded-2xl px-4 py-3 ${
                                  message.role === 'user'
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 px-2">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </>
                    )}
                  </div>

                  <div className="flex items-end space-x-3">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything... (e.g., 'Generate a 5-question quiz about Biology')"
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none resize-none"
                      rows={3}
                      disabled={isSending}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isSending}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 h-[60px]"
                    >
                      {isSending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                      ) : (
                        <PaperAirplaneIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border-2 border-purple-100">
                    <div className="text-3xl mb-2">🎯</div>
                    <h4 className="font-semibold text-gray-800 mb-1">Generate Quizzes</h4>
                    <p className="text-sm text-gray-600">Ask AI to create custom quizzes</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-2 border-pink-100">
                    <div className="text-3xl mb-2">📚</div>
                    <h4 className="font-semibold text-gray-800 mb-1">Study Help</h4>
                    <p className="text-sm text-gray-600">Get explanations and help</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-2 border-purple-100">
                    <div className="text-3xl mb-2">✏️</div>
                    <h4 className="font-semibold text-gray-800 mb-1">Practice Problems</h4>
                    <p className="text-sm text-gray-600">Request practice questions</p>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Save Quiz Dialog */}
      {showSaveDialog && pendingQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Save Quiz?</h3>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">{pendingQuiz.quiz.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{pendingQuiz.quiz.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-700">
                <span>📚 {pendingQuiz.quiz.subject}</span>
                <span>📊 {pendingQuiz.quiz.level}</span>
                <span>❓ {pendingQuiz.quiz.questions.length} questions</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-60 overflow-y-auto">
              <p className="text-sm text-gray-600 font-medium mb-2">Preview:</p>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">{pendingQuiz.message.substring(0, 500)}...</pre>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveQuiz}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                ✅ Save Quiz
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setPendingQuiz(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                ❌ Discard
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Quiz Dialog */}
      {showEditDialog && editingQuiz && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-xl w-full"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Quiz</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingQuiz.title}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={editingQuiz.subject}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, subject: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  value={editingQuiz.description || ''}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleUpdateQuiz}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                💾 Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingQuiz(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EnhancedQuizPage;
