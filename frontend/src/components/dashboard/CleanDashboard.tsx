import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  HeartIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface DashboardStats {
  todayStudyTime: number;
  weekStreak: number;
  completedToday: number;
  motivation: string;
}

const CleanDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    todayStudyTime: 0,
    weekStreak: 0,
    completedToday: 0,
    motivation: 'Keep going! You\'re doing great! 💪'
  });
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    setGreeting(getGreeting());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const loadDashboard = async () => {
    try {
      const [userRes, statsRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/progress/stats')
      ]);
      
      setUserName(userRes.data.user?.username || 'Student');
      
      if (statsRes.data) {
        setStats({
          todayStudyTime: statsRes.data.todayStudyTime || 0,
          weekStreak: statsRes.data.streak?.current || 0,
          completedToday: statsRes.data.completedToday || 0,
          motivation: getMotivationalMessage(statsRes.data)
        });
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMotivationalMessage = (data: any) => {
    const streak = data.streak?.current || 0;
    const time = data.todayStudyTime || 0;
    
    if (streak >= 7) return '🔥 Amazing! 7-day streak! You\'re unstoppable!';
    if (time >= 60) return '⭐ Great focus today! Keep it up!';
    if (data.completedToday >= 1) return '✅ Nice work! You completed a goal today!';
    return '💪 Ready to learn something new today?';
  };

  const quickActions = [
    {
      id: 'ai-help',
      title: 'AI Study Assistant',
      description: 'Get help with any topic',
      icon: SparklesIcon,
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/ai-assistant')
    },
    {
      id: 'study',
      title: 'Start Studying',
      description: 'Review your materials',
      icon: BookOpenIcon,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/resources')
    },
    {
      id: 'quiz',
      title: 'Take a Quiz',
      description: 'Test your knowledge',
      icon: AcademicCapIcon,
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/quizzes')
    },
    {
      id: 'groups',
      title: 'Study Groups',
      description: 'Learn with friends',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/study-groups')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header - Emotional & Personal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-xl text-blue-50">
              {stats.motivation}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-6xl">
              {stats.weekStreak >= 7 ? '🔥' : stats.completedToday >= 1 ? '⭐' : '📚'}
            </div>
          </div>
        </div>

        {/* Quick Stats - Simple & Clear */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <ClockIcon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{stats.todayStudyTime}m</div>
            <div className="text-sm text-blue-100">Today</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FireIcon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{stats.weekStreak}</div>
            <div className="text-sm text-blue-100">Day Streak</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <HeartIcon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
            <div className="text-sm text-blue-100">Completed</div>
          </div>
        </div>
      </motion.div>

      {/* What do you want to do? - Focus on Action */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          What do you want to do today?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.action}
              className="relative group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative flex items-start space-x-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600">
                    {action.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress Insight - Simple Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Your Progress This Week</h3>
          <button
            onClick={() => navigate('/progress')}
            className="text-blue-500 hover:text-blue-600 font-medium text-sm flex items-center space-x-1"
          >
            <span>View Details</span>
            <ChartBarIcon className="w-4 h-4" />
          </button>
        </div>

        {stats.weekStreak > 0 ? (
          <div className="space-y-4">
            {/* Streak Visualization */}
            <div className="flex items-center space-x-2">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-12 rounded-lg ${
                    i < stats.weekStreak
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-md'
                      : 'bg-gray-200'
                  } flex items-center justify-center`}
                >
                  {i < stats.weekStreak && (
                    <span className="text-white font-bold">✓</span>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-center text-gray-600">
              {stats.weekStreak === 7 
                ? '🎉 Perfect week! You studied every day!'
                : `${stats.weekStreak} out of 7 days this week`}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-600 mb-4">
              Start your first study session today!
            </p>
            <button
              onClick={() => navigate('/resources')}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              Begin Learning
            </button>
          </div>
        )}
      </motion.div>

      {/* Encouraging Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center py-8"
      >
        <p className="text-gray-500 italic">
          "Every expert was once a beginner. Keep learning, keep growing! 🌱"
        </p>
      </motion.div>
    </div>
  );
};

export default CleanDashboard;
