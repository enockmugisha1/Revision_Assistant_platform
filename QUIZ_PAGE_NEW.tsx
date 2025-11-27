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

const EnhancedQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'ai'>('quizzes');

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
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await api.post('/ai/chat', {
        messages: [
          ...chatMessages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: inputMessage }
        ]
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.data?.content || response.data.content || 'Sorry, I couldn\'t process that.',
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
                    {quizzes.map((quiz) => (
                      <div
                        key={quiz._id}
                        onClick={() => navigate(`/quizzes/${quiz._id}/take`)}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-purple-300"
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
                        <div className="flex items-center justify-between pt-4 border-t border-purple-200">
                          <span className="text-sm text-gray-600">{quiz.questions?.length || 0} questions</span>
                          <PlayIcon className="w-5 h-5 text-purple-600" />
                        </div>
                      </div>
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
    </div>
  );
};

export default EnhancedQuizPage;
