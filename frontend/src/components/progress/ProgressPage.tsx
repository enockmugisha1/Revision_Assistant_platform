import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ChartBarIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline';
import { ProgressService, ProgressData } from '../../services/progressService';
import aiService from '../../services/aiService';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export const ProgressPage: React.FC = () => {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzingWithAI, setAnalyzingWithAI] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await ProgressService.get();
        setData(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getAIAnalysis = async () => {
    if (!data) return;
    
    setAnalyzingWithAI(true);
    try {
      // Extract some mock scores and topics from progress data for demo
      const scores = [75, 82, 88, 79, 91]; // You can replace with actual quiz scores
      const topics = ['Algebra', 'Geometry', 'Calculus']; // Replace with actual topics
      
      const analysis = await aiService.analyzeProgress({
        subject: 'Mathematics', // You can make this dynamic
        scores,
        topics
      });
      
      setAiAnalysis(analysis);
      toast.success('✨ AI analysis complete!');
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error('Failed to generate AI analysis');
    } finally {
      setAnalyzingWithAI(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
        <Button 
          onClick={getAIAnalysis}
          loading={analyzingWithAI}
          leftIcon={<SparklesIcon className="h-4 w-4" />}
        >
          AI Analysis
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100">Total Study Time</p>
            <ChartBarIcon className="h-8 w-8 text-blue-200" />
          </div>
          <p className="text-4xl font-bold">{data?.totalStudyTime ?? 0}</p>
          <p className="text-sm text-blue-100 mt-1">minutes</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100">Current Streak</p>
            <FireIcon className="h-8 w-8 text-orange-200" />
          </div>
          <p className="text-4xl font-bold">{data?.streak?.current ?? 0}</p>
          <p className="text-sm text-orange-100 mt-1">days in a row</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100">Longest Streak</p>
            <TrophyIcon className="h-8 w-8 text-purple-200" />
          </div>
          <p className="text-4xl font-bold">{data?.streak?.longest ?? 0}</p>
          <p className="text-sm text-purple-100 mt-1">days record</p>
        </motion.div>
      </motion.div>

      {aiAnalysis && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold">AI Performance Analysis</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Overall Performance</h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Score:</span>
                  <span className="font-semibold text-blue-900">
                    {aiAnalysis.overallPerformance?.averageScore ?? 'N/A'}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Trend:</span>
                  <span className="font-semibold text-blue-900 capitalize">
                    {aiAnalysis.overallPerformance?.trend ?? 'stable'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Consistency:</span>
                  <span className="font-semibold text-blue-900 capitalize">
                    {aiAnalysis.overallPerformance?.consistency ?? 'moderate'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {(aiAnalysis.recommendations || []).map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {aiAnalysis.nextSteps && aiAnalysis.nextSteps.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {aiAnalysis.nextSteps.map((step: string, i: number) => (
                  <div key={i} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <span className="text-xs font-semibold text-purple-900">Step {i + 1}</span>
                    </div>
                    <p className="text-sm text-purple-800">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProgressPage;

