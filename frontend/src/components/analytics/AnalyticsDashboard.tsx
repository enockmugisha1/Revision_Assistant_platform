import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AnalyticsDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/adaptive/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Analytics load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl p-12 text-center">
          <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-500 mb-6">
            AI-powered learning insights will appear here as you use the platform!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-left max-w-2xl mx-auto">
            <div className="bg-blue-50 p-4 rounded-lg">
              <span className="text-2xl mb-2 block">📊</span>
              <strong>Performance Tracking</strong>
              <p className="text-gray-600 mt-1">See your scores and progress over time</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <span className="text-2xl mb-2 block">🧠</span>
              <strong>AI Insights</strong>
              <p className="text-gray-600 mt-1">Get personalized study recommendations</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <span className="text-2xl mb-2 block">🎯</span>
              <strong>Smart Predictions</strong>
              <p className="text-gray-600 mt-1">Know your exam readiness in advance</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { metrics, insights, recommendations } = profile;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Learning Analytics 📊</h1>
            <p className="text-xl text-indigo-50">
              AI-powered insights powered by Groq
            </p>
          </div>
          <div className="hidden md:block text-7xl">🧠</div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: TrophyIcon, value: `${metrics.averageScore}%`, label: 'Average Score', color: 'yellow' },
          { icon: ClockIcon, value: `${Math.floor(metrics.totalStudyTime / 60)}h`, label: 'Study Time', color: 'blue' },
          { icon: FireIcon, value: metrics.quizzesTaken, label: 'Quizzes Done', color: 'orange' },
          { icon: AcademicCapIcon, value: `${(metrics.retentionRate * 100).toFixed(0)}%`, label: 'Retention', color: 'purple' }
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <metric.icon className={`w-8 h-8 text-${metric.color}-500 mb-3`} />
            <div className="text-3xl font-bold text-gray-800 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-500">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      {insights && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100"
        >
          <div className="flex items-center space-x-3 mb-4">
            <LightBulbIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">AI Insights</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Powered by Groq
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight: string, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Personalized Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec: any, index: number) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${
                  rec.priority === 'high' ? 'border-red-500' :
                  rec.priority === 'medium' ? 'border-yellow-500' :
                  'border-green-500'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{rec.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">{rec.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
