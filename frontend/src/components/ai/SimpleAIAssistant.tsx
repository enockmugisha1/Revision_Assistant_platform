import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  PaperAirplaneIcon,
  LightBulbIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import aiService from '../../services/aiService';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SimpleAIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'feedback' | 'quiz' | 'explain' | 'chat'>('chat');

  const quickPrompts = [
    { icon: BookOpenIcon, text: 'Explain a concept', action: 'explain' as const },
    { icon: AcademicCapIcon, text: 'Generate quiz', action: 'quiz' as const },
    { icon: LightBulbIcon, text: 'Get writing feedback', action: 'feedback' as const },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response;
      
      if (selectedAction === 'feedback') {
        const result = await aiService.feedback(input, 'groq');
        response = result.data?.holisticFeedback || 'No feedback available';
      } else if (selectedAction === 'quiz') {
        toast.info('Generating quiz...');
        response = `Quiz generation requested for: "${input}". This feature will create a custom quiz based on your topic.`;
      } else if (selectedAction === 'explain') {
        const result = await aiService.feedback(`Explain this concept in simple terms: ${input}`, 'groq');
        response = result.data?.holisticFeedback || 'Explanation not available';
      } else {
        const result = await aiService.feedback(input, 'groq');
        response = result.data?.holisticFeedback || 'No response available';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error('AI Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (action: 'feedback' | 'quiz' | 'explain') => {
    setSelectedAction(action);
    let prompt = '';
    if (action === 'explain') prompt = 'What concept would you like me to explain?';
    if (action === 'quiz') prompt = 'What topic should I create a quiz about?';
    if (action === 'feedback') prompt = 'Paste your writing here for feedback...';
    
    setInput(prompt);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">AI Study Assistant</h2>
            <p className="text-blue-100 text-sm">Ask me anything about your studies!</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="p-6 border-b">
          <p className="text-gray-600 mb-4">Quick actions:</p>
          <div className="grid grid-cols-3 gap-3">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt.action)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center text-center"
              >
                <prompt.icon className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <SparklesIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Start a conversation with your AI assistant</p>
            <p className="text-sm mt-2">Type your question below or use quick actions above</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="chat">Chat</option>
            <option value="explain">Explain</option>
            <option value="feedback">Feedback</option>
            <option value="quiz">Quiz</option>
          </select>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question or request..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Powered by Groq AI • {selectedAction === 'chat' ? 'General chat' : `${selectedAction} mode`}
        </p>
      </div>
    </div>
  );
};

export default SimpleAIAssistant;
