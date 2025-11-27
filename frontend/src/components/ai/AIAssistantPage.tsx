import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import StudyAssistant from './StudyAssistant';
import FloatingVoiceButton from './FloatingVoiceButton';

const AIAssistantPage: React.FC = () => {
  const [showStudyAssistant, setShowStudyAssistant] = React.useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <SparklesIcon className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold text-gray-800">AI Study Assistant</h1>
        </div>
        <p className="text-gray-600">
          Get personalized help with your studies using AI technology
        </p>
      </motion.div>

      {/* AI Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice Assistant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <MicrophoneIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Voice Assistant</h2>
              <p className="text-blue-100">Talk naturally with AI</p>
            </div>
          </div>
          
          <p className="text-blue-50 mb-6">
            Have a conversation with AI using your voice. Ask questions, get explanations, and learn interactively!
          </p>

          <div className="space-y-3 text-sm text-blue-100">
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Hands-free studying</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Natural conversation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Voice responses</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="text-sm text-blue-100">
              Look for the floating button →
            </div>
          </div>
        </motion.div>

        {/* Text Assistant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setShowStudyAssistant(true)}
          className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Text Assistant</h2>
              <p className="text-gray-600">Type your questions</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            Get detailed explanations, study guides, and personalized learning plans through text conversations.
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Detailed explanations</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Study guides generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>✓</span>
              <span>Personalized plans</span>
            </div>
          </div>

          <button className="mt-6 w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-green-500 hover:to-emerald-600 transition-all">
            Open Text Assistant
          </button>
        </motion.div>
      </div>

      {/* How it helps you */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-gray-50 rounded-2xl p-8"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          How AI Can Help You Learn Better
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-semibold text-gray-800 mb-2">Get Instant Help</h4>
            <p className="text-sm text-gray-600">
              Ask any question and get clear explanations immediately
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">💡</div>
            <h4 className="font-semibold text-gray-800 mb-2">Learn Your Way</h4>
            <p className="text-sm text-gray-600">
              AI adapts to your learning style and pace
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h4 className="font-semibold text-gray-800 mb-2">Study Smarter</h4>
            <p className="text-sm text-gray-600">
              Get personalized study plans and practice questions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Text Assistant Modal */}
      {showStudyAssistant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <StudyAssistant onClose={() => setShowStudyAssistant(false)} />
          </div>
        </div>
      )}

      {/* Floating Voice Button - Only on AI page */}
      <FloatingVoiceButton />
    </div>
  );
};

export default AIAssistantPage;
