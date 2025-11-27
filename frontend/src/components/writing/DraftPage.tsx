import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, LightBulbIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import aiService from '../../services/aiService';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export const DraftPage: React.FC = () => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getFeedback = async () => {
    if (!text.trim()) {
      toast.error('Please write some text first');
      return;
    }

    if (text.trim().length < 20) {
      toast.error('Please write at least 20 characters to get meaningful feedback');
      return;
    }

    setLoading(true);
    try {
      let provider: 'groq' | 'openai' | undefined;
      let model: string | undefined;
      try {
        const raw = localStorage.getItem('aiProviderSelection');
        if (raw) {
          const parsed = JSON.parse(raw);
          provider = parsed.provider;
          model = parsed.model;
        }
      } catch {}
      const data = await aiService.feedback(text, provider, model);
      setFeedback(data);
      toast.success('✨ AI feedback generated!');
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Failed to get feedback. Please try again.');
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Your Draft</h2>
        </div>
        <textarea 
          className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Write your draft here... (minimum 20 characters for AI feedback)"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {text.length} characters | {text.split(/\s+/).filter(w => w).length} words
          </span>
          <Button 
            onClick={getFeedback} 
            loading={loading}
            leftIcon={<SparklesIcon className="h-4 w-4" />}
          >
            Get AI Feedback
          </Button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <LightBulbIcon className="h-6 w-6 text-yellow-600" />
          <h2 className="text-xl font-semibold">AI Feedback</h2>
        </div>
        
        {!feedback ? (
          <div className="h-96 flex items-center justify-center text-center">
            <div>
              <SparklesIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No feedback yet.</p>
              <p className="text-sm text-gray-500 mt-2">Write your draft and click "Get AI Feedback"</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {feedback.sentenceFeedback && feedback.sentenceFeedback.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  Sentence-Level Suggestions
                </h4>
                <ul className="space-y-2">
                  {feedback.sentenceFeedback.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback.holisticFeedback && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <LightBulbIcon className="h-5 w-5" />
                  Overall Feedback
                </h4>
                <p className="text-sm text-green-800 leading-relaxed">{feedback.holisticFeedback}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DraftPage;

