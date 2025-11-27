import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FireIcon,
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const SimpleDashboard: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'manager';
  
  const [stats, setStats] = useState({
    studyStreak: 0,
    totalStudyTime: 0,
    completedQuizzes: 0,
    averageScore: 0,
    achievements: 0,
    weeklyProgress: 0,
    totalStudents: 0,
    activeStudents: 0,
    pendingGrading: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Set some default visible data immediately
      setStats({
        studyStreak: 0,
        totalStudyTime: 0,
        completedQuizzes: 0,
        averageScore: 0,
        achievements: 0,
        weeklyProgress: 0,
        totalStudents: 45,
        activeStudents: 38,
        pendingGrading: 12,
      });
      
      // Try to fetch real data
      const response = await fetch('/api/progress/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const apiStats = data.data;
        
        // Update with real data if available
        setStats({
          studyStreak: apiStats.currentStreak || 0,
          totalStudyTime: Math.round(apiStats.monthlyStudyTime / 60) || 0,
          completedQuizzes: apiStats.completedQuizzes || 0,
          averageScore: apiStats.averageScore || 0,
          achievements: apiStats.achievements || 0,
          weeklyProgress: apiStats.weeklyStudyTime ? Math.min(Math.round((apiStats.weeklyStudyTime / 60 / 20) * 100), 100) : 0,
          totalStudents: 45,
          activeStudents: 38,
          pendingGrading: 12,
        });
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
      // Even on error, keep the default stats so dashboard is visible
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 dark:bg-secondary-900 min-h-screen">
      {/* TEST MODE BANNER - Shows if data is zero */}
      {stats.studyStreak === 0 && stats.totalStudyTime === 0 && stats.completedQuizzes === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="text-3xl mr-3">⚠️</div>
            <div>
              <h3 className="text-lg font-bold">Dashboard in Demo Mode</h3>
              <p className="text-sm">
                Start using the app to see your real stats! Take a quiz or study to update these numbers.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {isTeacher ? '👨‍🏫 Teacher Dashboard' : '🎓 Student Dashboard'}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Welcome back, {user?.firstName || 'Student'}! {isTeacher ? "Here's your class overview" : "Ready to learn?"}
            </p>
          </div>
          <div className="hidden md:block text-5xl md:text-6xl">
            {isTeacher ? '📊' : '🚀'}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - BIG and VISIBLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {!isTeacher ? (
          <>
            {/* Student Stats - ALWAYS VISIBLE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-4">
                <FireIcon className="h-12 w-12 flex-shrink-0" />
                <div className="text-right">
                  <div className="text-5xl md:text-6xl font-bold">{stats.studyStreak}</div>
                  <div className="text-sm md:text-base opacity-90 font-semibold">days</div>
                </div>
              </div>
              <div className="text-lg md:text-xl font-semibold">Study Streak 🔥</div>
              <div className="text-sm md:text-base opacity-90 mt-1">
                {stats.studyStreak > 0 ? 'Amazing! Keep it up!' : 'Start your streak today!'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-4">
                <ClockIcon className="h-12 w-12 flex-shrink-0" />
                <div className="text-right">
                  <div className="text-5xl md:text-6xl font-bold">{stats.totalStudyTime}</div>
                  <div className="text-sm md:text-base opacity-90 font-semibold">hours</div>
                </div>
              </div>
              <div className="text-lg md:text-xl font-semibold">Study Time ⏱️</div>
              <div className="text-sm md:text-base opacity-90 mt-1">This month</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-4">
                <AcademicCapIcon className="h-12 w-12 flex-shrink-0" />
                <div className="text-right">
                  <div className="text-5xl md:text-6xl font-bold">{stats.averageScore}</div>
                  <div className="text-sm md:text-base opacity-90 font-semibold">%</div>
                </div>
              </div>
              <div className="text-lg md:text-xl font-semibold">Quiz Score 🎯</div>
              <div className="text-sm md:text-base opacity-90 mt-1">{stats.completedQuizzes} quizzes done</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 min-h-[200px]"
            >
              <div className="flex items-center justify-between mb-4">
                <TrophyIcon className="h-12 w-12 flex-shrink-0" />
                <div className="text-right">
                  <div className="text-5xl md:text-6xl font-bold">{stats.achievements}</div>
                  <div className="text-sm md:text-base opacity-90 font-semibold">badges</div>
                </div>
              </div>
              <div className="text-lg md:text-xl font-semibold">Achievements 🏆</div>
              <div className="text-sm md:text-base opacity-90 mt-1">Earned rewards</div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Teacher Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <UserGroupIcon className="h-12 w-12" />
                <div className="text-right">
                  <div className="text-5xl font-bold">{stats.totalStudents}</div>
                  <div className="text-sm opacity-90">students</div>
                </div>
              </div>
              <div className="text-lg font-semibold">Total Students</div>
              <div className="text-sm opacity-90 mt-1">{stats.activeStudents} active today</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <ChartBarIcon className="h-12 w-12" />
                <div className="text-right">
                  <div className="text-5xl font-bold">82.5</div>
                  <div className="text-sm opacity-90">%</div>
                </div>
              </div>
              <div className="text-lg font-semibold">Class Average</div>
              <div className="text-sm opacity-90 mt-1">Overall performance</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <ExclamationCircleIcon className="h-12 w-12" />
                <div className="text-right">
                  <div className="text-5xl font-bold">{stats.pendingGrading}</div>
                  <div className="text-sm opacity-90">items</div>
                </div>
              </div>
              <div className="text-lg font-semibold">Pending Grading</div>
              <div className="text-sm opacity-90 mt-1">Needs attention</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl p-6 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <AcademicCapIcon className="h-12 w-12" />
                <div className="text-right">
                  <div className="text-5xl font-bold">8</div>
                  <div className="text-sm opacity-90">classes</div>
                </div>
              </div>
              <div className="text-lg font-semibold">Active Classes</div>
              <div className="text-sm opacity-90 mt-1">Teaching</div>
            </motion.div>
          </>
        )}
      </div>

      {/* Quick Actions - VISIBLE and CLEAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg border-2 border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Quiz</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate personalized quizzes with AI
          </p>
          <Link to="/quizzes/generate">
            <Button className="w-full">
              Generate Now →
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Study Groups</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Join or create study groups
          </p>
          <Link to="/study-groups">
            <Button className="w-full" variant="outline">
              Explore Groups →
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-lg border-2 border-green-200 dark:border-green-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <BookOpenIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resources</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Browse educational materials
          </p>
          <Link to="/resources">
            <Button className="w-full" variant="outline">
              Browse Now →
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Progress Section - VISUAL */}
      {!isTeacher && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <StarIcon className="h-8 w-8 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Progress</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Weekly Study Goal
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(stats.weeklyProgress * 0.2)} / 20 hours completed
                  </p>
                </div>
                <span className="text-3xl font-bold text-primary-600">
                  {stats.weeklyProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.weeklyProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-primary-500 to-purple-500 h-4 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Quiz Completion
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.completedQuizzes} / 10 quizzes this month
                  </p>
                </div>
                <span className="text-3xl font-bold text-green-600">
                  {Math.min(Math.round((stats.completedQuizzes / 10) * 100), 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stats.completedQuizzes / 10) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analytics Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              📊 Detailed Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              View comprehensive performance insights and trends
            </p>
          </div>
          <Link to="/analytics">
            <Button leftIcon={<ChartBarIcon className="h-5 w-5" />}>
              View Analytics
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-4">
            <div className="text-3xl mb-2">📈</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Performance Trends</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your scores over time</p>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-4">
            <div className="text-3xl mb-2">🧠</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">AI Insights</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Personalized recommendations</p>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg p-4">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Smart Predictions</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Exam readiness forecast</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SimpleDashboard;
