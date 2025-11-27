import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  FireIcon,
  ClockIcon,
  HeartIcon,
  TrophyIcon,
  ChartBarIcon,
  PlayIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Activity {
  id: string;
  type: string;
  title: string;
  score?: number;
  duration?: number;
  time: string;
}

interface DashboardData {
  user: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  stats: {
    todayStudyTime: number;
    weeklyStudyTime: number;
    monthlyStudyTime: number;
    totalStudyTime: number;
    currentStreak: number;
    longestStreak: number;
    completedQuizzes: number;
    averageScore: number;
    studyGroups: number;
    achievements: number;
  };
  recentActivity: Activity[];
  upcomingTasks: any[];
  quizzes: any[];
}

const SuperDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [motivation, setMotivation] = useState('');

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
      const [statsRes, quizzesRes] = await Promise.all([
        api.get('/progress/stats'),
        api.get('/quizzes?limit=5').catch(() => ({ data: { data: { docs: [] } } }))
      ]);
      
      const statsData = statsRes.data.data || statsRes.data;
      const quizzesData = quizzesRes.data.data?.docs || quizzesRes.data.quizzes || [];
      
      const userData: DashboardData = {
        user: {
          username: authUser?.username || authUser?.firstName || 'Student',
          firstName: authUser?.firstName || '',
          lastName: authUser?.lastName || '',
          email: authUser?.email || ''
        },
        stats: {
          todayStudyTime: statsData.todayStudyTime || 0,
          weeklyStudyTime: statsData.weeklyStudyTime || 0,
          monthlyStudyTime: statsData.monthlyStudyTime || 0,
          totalStudyTime: statsData.totalStudyTime || 0,
          currentStreak: statsData.currentStreak || 0,
          longestStreak: statsData.longestStreak || 0,
          completedQuizzes: statsData.completedQuizzes || 0,
          averageScore: Math.round(statsData.averageScore || 0),
          studyGroups: statsData.studyGroups || 0,
          achievements: statsData.achievements || 0
        },
        recentActivity: statsData.recentActivity || [],
        upcomingTasks: statsData.upcomingTasks || [],
        quizzes: quizzesData
      };

      setData(userData);
      setMotivation(getMotivation(userData.stats));
    } catch (error) {
      console.error('Dashboard load error:', error);
      // Set default data on error
      setData({
        user: {
          username: authUser?.username || authUser?.firstName || 'Student',
          firstName: authUser?.firstName || '',
          lastName: authUser?.lastName || '',
          email: authUser?.email || ''
        },
        stats: {
          todayStudyTime: 0,
          weeklyStudyTime: 0,
          monthlyStudyTime: 0,
          totalStudyTime: 0,
          currentStreak: 0,
          longestStreak: 0,
          completedQuizzes: 0,
          averageScore: 0,
          studyGroups: 0,
          achievements: 0
        },
        recentActivity: [],
        upcomingTasks: [],
        quizzes: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getMotivation = (stats: any) => {
    if (stats.currentStreak >= 7) return '🔥 On fire! 7-day streak! Keep going!';
    if (stats.todayStudyTime >= 60) return '⭐ Amazing focus today!';
    if (stats.completedQuizzes >= 5) return '💪 You\'re crushing it!';
    if (stats.averageScore >= 80) return '🎯 Excellent performance!';
    if (stats.completedQuizzes > 0) return '📚 Great start! Keep learning!';
    return '🌟 Welcome! Let\'s start your learning journey!';
  };

  const quickActions = [
    {
      id: 'ai-quiz',
      title: 'Generate AI Quiz',
      description: 'Create custom quiz instantly',
      icon: SparklesIcon,
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/quizzes')
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'See your learning insights',
      icon: ChartBarIcon,
      color: 'from-indigo-500 to-purple-500',
      action: () => navigate('/analytics')
    },
    {
      id: 'study',
      title: 'Study Resources',
      description: 'Access learning materials',
      icon: BookOpenIcon,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/resources')
    },
    {
      id: 'study-together',
      title: 'Study Together',
      description: 'Join live study sessions',
      icon: UserGroupIcon,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/study-groups')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
      {/* Welcome Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {greeting}, {data.user.firstName || data.user.username}! 👋
              </h1>
              <p className="text-xl text-blue-50">
                {motivation}
              </p>
            </div>
            <div className="hidden md:block text-7xl animate-bounce">
              {data.stats.currentStreak >= 7 ? '🔥' : 
               data.stats.completedQuizzes >= 5 ? '⭐' : 
               data.stats.averageScore >= 80 ? '🎯' : '📚'}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-transform">
              <ClockIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-3xl font-bold">{formatTime(data.stats.todayStudyTime)}</div>
              <div className="text-sm text-blue-100">Today</div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-transform">
              <FireIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-3xl font-bold">{data.stats.currentStreak}</div>
              <div className="text-sm text-blue-100">Day Streak</div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-transform">
              <TrophyIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-3xl font-bold">{data.stats.averageScore}%</div>
              <div className="text-sm text-blue-100">Avg Score</div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-transform">
              <AcademicCapIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-3xl font-bold">{data.stats.completedQuizzes}</div>
              <div className="text-sm text-blue-100">Quizzes</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.action}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative flex items-center space-x-4">
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </div>

                <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-2 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Progress This Week - Simple Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Study Progress</h3>
          <span className="text-sm text-gray-500">
            {data.stats.currentStreak} day streak 🔥
          </span>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">This Week</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{formatTime(data.stats.weeklyStudyTime)}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">This Month</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{formatTime(data.stats.monthlyStudyTime)}</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Total Time</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{formatTime(data.stats.totalStudyTime)}</div>
          </div>
        </div>

        {/* Streak Tracker */}
        {data.stats.currentStreak > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🔥</div>
                <div>
                  <div className="font-bold text-orange-700">
                    {data.stats.currentStreak} Day Streak!
                  </div>
                  <div className="text-sm text-orange-600">
                    Longest: {data.stats.longestStreak} days
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Keep going!</div>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        {data.stats.currentStreak === 0 && data.stats.completedQuizzes === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-center border-2 border-blue-200">
            <p className="text-blue-700 font-semibold mb-2">
              🌟 Start Your Learning Journey Today!
            </p>
            <p className="text-sm text-blue-600">
              Take your first quiz or study session to begin building your streak.
            </p>
          </div>
        )}
      </motion.div>

      {/* Recent Activity & Stats Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Recent Activity</span>
            </h3>
            {data.recentActivity.length > 0 && (
              <button 
                onClick={() => navigate('/analytics')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            )}
          </div>
          
          {data.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📚</div>
              <p className="text-gray-500">No recent activity yet</p>
              <p className="text-sm text-gray-400 mt-1">Start learning to see your progress here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {data.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'quiz' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'quiz' ? (
                        <AcademicCapIcon className={`w-5 h-5 ${
                          activity.type === 'quiz' ? 'text-blue-600' : 'text-green-600'
                        }`} />
                      ) : (
                        <BookOpenIcon className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.score !== undefined && (
                      <div className={`text-sm font-bold ${
                        activity.score >= 80 ? 'text-green-600' :
                        activity.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {activity.score}%
                      </div>
                    )}
                    {activity.duration !== undefined && (
                      <div className="text-xs text-gray-500">
                        {formatTime(activity.duration)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Your Quizzes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <AcademicCapIcon className="w-5 h-5 text-purple-500" />
              <span>Your Quizzes</span>
            </h3>
            <button 
              onClick={() => navigate('/quizzes')}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              View All
            </button>
          </div>
          
          {data.quizzes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🎯</div>
              <p className="text-gray-500 mb-3">No quizzes yet</p>
              <button
                onClick={() => navigate('/quizzes')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Generate Your First Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {data.quizzes.slice(0, 5).map((quiz, index) => (
                <motion.div
                  key={quiz._id || index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/quizzes/${quiz._id}/take`)}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all cursor-pointer group"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm group-hover:text-purple-600 transition-colors">
                      {quiz.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">{quiz.subject}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        quiz.level === 'beginner' ? 'bg-green-100 text-green-700' :
                        quiz.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {quiz.level}
                      </span>
                    </div>
                  </div>
                  <PlayIcon className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Motivational Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center py-6"
      >
        <p className="text-gray-500 italic text-lg">
          "The expert in anything was once a beginner." 🌟
        </p>
      </motion.div>
    </div>
  );
};

export default SuperDashboard;
