import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  TrophyIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import SimpleAIAssistant from '../ai/SimpleAIAssistant';

const ImprovedDashboard: React.FC = () => {
  const { user } = useAuth();
  const [showAI, setShowAI] = useState(false);

  const stats = [
    { label: 'Study Time Today', value: '0 hrs', icon: ClockIcon, color: 'blue' },
    { label: 'Quizzes Completed', value: '0', icon: AcademicCapIcon, color: 'green' },
    { label: 'Current Streak', value: '0 days', icon: TrophyIcon, color: 'orange' },
    { label: 'Study Groups', value: '0', icon: UserGroupIcon, color: 'purple' },
  ];

  const quickActions = [
    {
      title: 'Start AI Chat',
      description: 'Get instant help with your studies',
      icon: SparklesIcon,
      action: () => setShowAI(true),
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Take a Quiz',
      description: 'Test your knowledge',
      icon: AcademicCapIcon,
      link: '/quizzes',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'View Progress',
      description: 'See your learning stats',
      icon: ChartBarIcon,
      link: '/progress',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Study Groups',
      description: 'Learn with others',
      icon: UserGroupIcon,
      link: '/study-groups',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  if (showAI) {
    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 bg-white border-b flex items-center justify-between">
          <h1 className="text-xl font-bold">AI Assistant</h1>
          <button
            onClick={() => setShowAI(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="flex-1 p-6">
          <SimpleAIAssistant />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-gray-500">Today's Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {action.link ? (
                <Link to={action.link}>
                  <div className={`bg-gradient-to-br ${action.color} rounded-xl shadow-lg p-6 text-white cursor-pointer h-full`}>
                    <action.icon className="w-10 h-10 mb-3" />
                    <h3 className="text-lg font-bold mb-1">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm font-semibold">Get Started</span>
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  onClick={action.action}
                  className={`bg-gradient-to-br ${action.color} rounded-xl shadow-lg p-6 text-white cursor-pointer h-full`}
                >
                  <action.icon className="w-10 h-10 mb-3" />
                  <h3 className="text-lg font-bold mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm font-semibold">Get Started</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
          <Link to="/progress" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
            View All →
          </Link>
        </div>
        <div className="text-center py-12 text-gray-400">
          <BookOpenIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No recent activity yet</p>
          <p className="text-sm mt-2">Start learning to see your progress here!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ImprovedDashboard;
