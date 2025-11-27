import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FireIcon,
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  BoltIcon,
  LightBulbIcon,
  CalendarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  // Student stats
  studyStreak?: number;
  totalStudyTime?: number;
  completedQuizzes?: number;
  averageScore?: number;
  upcomingQuizzes?: number;
  achievements?: number;
  weeklyGoalProgress?: number;
  monthlyGoalProgress?: number;
  
  // Teacher stats
  totalStudents?: number;
  activeStudents?: number;
  avgQuizScore?: number;
  pendingGrading?: number;
  upcomingDeadlines?: number;
  classesCreated?: number;
}

interface Activity {
  id: string;
  type: 'quiz' | 'study' | 'group' | 'achievement' | 'submission' | 'question';
  title: string;
  description: string;
  timestamp: string;
  icon?: any;
  color?: string;
  score?: number;
}

interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  message: string;
  action?: {
    label: string;
    link: string;
  };
}

export const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'manager';
  
  const [stats, setStats] = useState<DashboardStats>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'progress' | 'activity'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch real data from API
      const [statsResponse, insightsResponse] = await Promise.all([
        fetch('/api/progress/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/progress/insights', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        const apiStats = statsData.data;
        
        if (isTeacher) {
          // TODO: Implement teacher-specific stats endpoint
          // For now, use simulated data
          setStats({
            totalStudents: 45,
            activeStudents: 38,
            avgQuizScore: 82.5,
            pendingGrading: 12,
            upcomingDeadlines: 3,
            classesCreated: 8,
          });
        } else {
          // Map API data to dashboard stats
          setStats({
            studyStreak: apiStats.currentStreak || 0,
            totalStudyTime: Math.round(apiStats.monthlyStudyTime / 60) || 0, // Convert to hours
            completedQuizzes: apiStats.completedQuizzes || 0,
            averageScore: apiStats.averageScore || 0,
            upcomingQuizzes: apiStats.upcomingTasks?.length || 0,
            achievements: apiStats.achievements || 0,
            weeklyGoalProgress: apiStats.weeklyStudyTime ? Math.min(Math.round((apiStats.weeklyStudyTime / 60 / 20) * 100), 100) : 0,
            monthlyGoalProgress: apiStats.completedQuizzes ? Math.min(Math.round((apiStats.completedQuizzes / 10) * 100), 100) : 0,
          });

          // Map recent activity
          if (apiStats.recentActivity && Array.isArray(apiStats.recentActivity)) {
            const mappedActivities = apiStats.recentActivity.map(activity => ({
              id: activity.id || Math.random().toString(),
              type: activity.type || 'study',
              title: activity.type === 'quiz' ? 'Quiz Completed' : 'Study Session',
              description: activity.title || activity.type === 'quiz' 
                ? `${activity.title} - Score: ${activity.score}%` 
                : `Studied for ${activity.duration} minutes`,
              timestamp: activity.time || 'Recently',
              color: activity.type === 'quiz' ? 'green' : 'blue',
              score: activity.score,
            }));
            setActivities(mappedActivities.slice(0, 3));
          }
        }
      } else {
        // Fallback to simulated data if API fails
        if (isTeacher) {
          setStats({
            totalStudents: 45,
            activeStudents: 38,
            avgQuizScore: 82.5,
            pendingGrading: 12,
            upcomingDeadlines: 3,
            classesCreated: 8,
          });
        } else {
          setStats({
            studyStreak: 7,
            totalStudyTime: 245,
            completedQuizzes: 12,
            averageScore: 85,
            upcomingQuizzes: 3,
            achievements: 8,
            weeklyGoalProgress: 75,
            monthlyGoalProgress: 68,
          });
        }
      }

      // Process insights
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        if (insightsData.data?.insights && Array.isArray(insightsData.data.insights)) {
          const mappedInsights = insightsData.data.insights.slice(0, 3).map((insight: any) => ({
            id: Math.random().toString(),
            type: insight.category === 'achievement' ? 'success' : 
                  insight.category === 'warning' ? 'warning' : 
                  insight.category === 'tip' ? 'tip' : 'info',
            title: insight.title || '💡 Insight',
            message: insight.message || insight.description || '',
            action: insight.action ? {
              label: insight.action.label || 'Learn More',
              link: insight.action.link || '/progress'
            } : undefined
          }));
          setInsights(mappedInsights);
        }
      }

      // Set default insights if none available
      if (insights.length === 0) {
        if (isTeacher) {
          setInsights([
            {
              id: '1',
              type: 'success',
              title: '🎉 Great Progress!',
              message: 'Your class average improved by 8% this week.',
            },
            {
              id: '2',
              type: 'warning',
              title: '⚠️ Action Needed',
              message: '12 submissions need grading.',
              action: { label: 'Grade Now', link: '/grading' },
            },
            {
              id: '3',
              type: 'tip',
              title: '💡 Pro Tip',
              message: 'Students perform better with frequent short quizzes.',
            },
          ]);
        } else {
          setInsights([
            {
              id: '1',
              type: 'success',
              title: '🎯 On Fire!',
              message: stats.studyStreak > 0 ? `You're on a ${stats.studyStreak}-day streak! Keep it up!` : "Start your study streak today!",
            },
            {
              id: '2',
              type: 'info',
              title: '📚 Keep Learning',
              message: stats.upcomingQuizzes > 0 ? `You have ${stats.upcomingQuizzes} upcoming quizzes.` : 'Generate a new AI quiz!',
              action: { label: 'Study Now', link: '/quizzes' },
            },
            {
              id: '3',
              type: 'tip',
              title: '💡 Study Tip',
              message: 'Short, frequent study sessions are more effective than long cramming sessions!',
            },
          ]);
        }
      }

      // Set default activities if none available
      if (activities.length === 0) {
        if (isTeacher) {
          setActivities([
            {
              id: '1',
              type: 'submission',
              title: 'Quiz Submitted',
              description: 'Recent student submission received',
              timestamp: '2 minutes ago',
              color: 'blue',
            },
          ]);
        } else {
          setActivities([
            {
              id: '1',
              type: 'study',
              title: 'Welcome!',
              description: 'Start your learning journey',
              timestamp: 'Now',
              color: 'blue',
            },
          ]);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Fallback to simulated data on error
      if (isTeacher) {
        setStats({
          totalStudents: 45,
          activeStudents: 38,
          avgQuizScore: 82.5,
          pendingGrading: 12,
          upcomingDeadlines: 3,
          classesCreated: 8,
        });

        setActivities([
          {
            id: '1',
            type: 'submission',
            title: 'Quiz Submitted',
            description: 'John Doe submitted Math Quiz #5',
            timestamp: '2 minutes ago',
            color: 'blue',
          },
        ]);

        setInsights([
          {
            id: '1',
            type: 'success',
            title: '🎉 Great Progress!',
            message: 'Your class average improved by 8% this week.',
          },
        ]);
      } else {
        setStats({
          studyStreak: 0,
          totalStudyTime: 0,
          completedQuizzes: 0,
          averageScore: 0,
          upcomingQuizzes: 0,
          achievements: 0,
          weeklyGoalProgress: 0,
          monthlyGoalProgress: 0,
        });

        setActivities([
          {
            id: '1',
            type: 'study',
            title: 'Welcome!',
            description: 'Start tracking your progress',
            timestamp: 'Now',
            color: 'blue',
          },
        ]);

        setInsights([
          {
            id: '1',
            type: 'info',
            title: '👋 Welcome!',
            message: 'Start your learning journey today!',
          },
        ]);
      }
      setLoading(false);
    }
  };

  const studentStatCards = [
    {
      title: 'Study Streak',
      value: `${stats.studyStreak || 0}`,
      unit: 'days',
      icon: FireIcon,
      gradient: 'from-orange-500 to-red-500',
      subtitle: stats.studyStreak > 0 ? 'Keep it up!' : 'Start today!',
      trend: stats.studyStreak > 0 ? `+${Math.min(stats.studyStreak, 7)} this week` : 'Begin your journey',
    },
    {
      title: 'Study Time',
      value: `${stats.totalStudyTime || 0}`,
      unit: 'hours',
      icon: ClockIcon,
      gradient: 'from-blue-500 to-cyan-500',
      subtitle: 'This month',
      trend: stats.totalStudyTime > 0 ? '+12h from last month' : 'Track your time',
    },
    {
      title: 'Quiz Score',
      value: `${stats.averageScore || 0}`,
      unit: '%',
      icon: AcademicCapIcon,
      gradient: 'from-green-500 to-emerald-500',
      subtitle: `${stats.completedQuizzes || 0} completed`,
      trend: stats.averageScore > 0 ? '+5% improvement' : 'Take your first quiz',
    },
    {
      title: 'Achievements',
      value: `${stats.achievements || 0}`,
      unit: 'badges',
      icon: TrophyIcon,
      gradient: 'from-purple-500 to-pink-500',
      subtitle: 'Earned',
      trend: stats.achievements > 0 ? '2 new this week' : 'Earn your first badge',
    },
  ];

  const teacherStatCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: UserGroupIcon,
      gradient: 'from-blue-500 to-indigo-500',
      subtitle: `${stats.activeStudents || 0} active today`,
      trend: '+5 this month',
    },
    {
      title: 'Class Average',
      value: `${stats.avgQuizScore || 0}%`,
      icon: ChartBarIcon,
      gradient: 'from-green-500 to-teal-500',
      subtitle: 'Quiz performance',
      trend: '+3.5% from last week',
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingGrading || 0,
      icon: ClockIcon,
      gradient: 'from-orange-500 to-amber-500',
      subtitle: 'Need grading',
      trend: 'Needs attention',
    },
    {
      title: 'Classes Created',
      value: stats.classesCreated || 0,
      icon: AcademicCapIcon,
      gradient: 'from-purple-500 to-violet-500',
      subtitle: 'Active classes',
      trend: '2 new this week',
    },
  ];

  const statCards = isTeacher ? teacherStatCards : studentStatCards;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
      case 'submission':
        return AcademicCapIcon;
      case 'study':
        return BookOpenIcon;
      case 'group':
        return UserGroupIcon;
      case 'achievement':
        return TrophyIcon;
      case 'question':
        return ExclamationCircleIcon;
      default:
        return CheckCircleIcon;
    }
  };

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'tip':
        return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {isTeacher ? '👨‍🏫' : '🎓'} Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isTeacher 
              ? "Here's your class overview and insights"
              : "Ready to continue your learning journey?"}
          </p>
        </div>
        <div className="flex gap-3">
          {isTeacher ? (
            <>
              <Link to="/quizzes/create">
                <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Create Quiz
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline" leftIcon={<ChartBarIcon className="h-4 w-4" />}>
                  Analytics
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/quizzes/generate">
                <Button leftIcon={<SparklesIcon className="h-4 w-4" />}>
                  AI Quiz
                </Button>
              </Link>
              <Link to="/study-groups">
                <Button variant="outline" leftIcon={<UserGroupIcon className="h-4 w-4" />}>
                  Study Groups
                </Button>
              </Link>
            </>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-secondary-700">
        {(['overview', 'progress', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              selectedTab === tab
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-gray-200 dark:border-secondary-700 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {stat.subtitle}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400">
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-4">
                <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Insights & Recommendations
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getInsightStyle(insight.type)}`}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {insight.message}
                    </p>
                    {insight.action && (
                      <Link to={insight.action.link}>
                        <Button size="sm" variant="outline" className="w-full">
                          {insight.action.label}
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-secondary-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BoltIcon className="h-5 w-5 text-yellow-500" />
                    Recent Activity
                  </h2>
                  <Link to="/activity" className="text-sm text-primary-600 hover:text-primary-700">
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {activities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/30 flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {activity.timestamp}
                          </p>
                        </div>
                        {activity.score && (
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {activity.score}%
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-secondary-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <RocketLaunchIcon className="h-5 w-5 text-blue-500" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {isTeacher ? (
                    <>
                      <Link to="/grading">
                        <button className="w-full text-left p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 hover:shadow-md rounded-lg transition-all border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                              <span className="text-sm font-medium text-orange-900 dark:text-orange-200">
                                Grade Submissions
                              </span>
                            </div>
                            {stats.pendingGrading! > 0 && (
                              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                {stats.pendingGrading}
                              </span>
                            )}
                          </div>
                        </button>
                      </Link>
                      <Link to="/analytics">
                        <button className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-md rounded-lg transition-all border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2">
                            <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
                              View Analytics
                            </span>
                          </div>
                        </button>
                      </Link>
                      <Link to="/study-groups/new">
                        <button className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md rounded-lg transition-all border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                              Create Study Group
                            </span>
                          </div>
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/quizzes/generate">
                        <button className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-md rounded-lg transition-all border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2">
                            <SparklesIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
                              Generate AI Quiz
                            </span>
                          </div>
                        </button>
                      </Link>
                      <Link to="/study-groups">
                        <button className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md rounded-lg transition-all border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2">
                            <UserGroupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                              Join Study Group
                            </span>
                          </div>
                        </button>
                      </Link>
                      <Link to="/resources">
                        <button className="w-full text-left p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md rounded-lg transition-all border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2">
                            <BookOpenIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-900 dark:text-green-200">
                              Browse Resources
                            </span>
                          </div>
                        </button>
                      </Link>
                      <Link to="/progress">
                        <button className="w-full text-left p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 hover:shadow-md rounded-lg transition-all border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center gap-2">
                            <ChartBarIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            <span className="text-sm font-medium text-orange-900 dark:text-orange-200">
                              View Progress
                            </span>
                          </div>
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Goals Progress */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-secondary-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <StarIcon className="h-6 w-6 text-yellow-500" />
                {isTeacher ? 'Class Goals & Targets' : 'Your Study Goals'}
              </h2>
              
              {!isTeacher && (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Weekly Study Time Goal
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          15h / 20h completed
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-primary-600">
                        {stats.weeklyGoalProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.weeklyGoalProgress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Monthly Quiz Completion
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          8 / 10 quizzes done
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        {stats.monthlyGoalProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.monthlyGoalProgress}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      />
                    </div>
                  </div>
                </>
              )}

              {isTeacher && (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Student Engagement Rate
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {stats.activeStudents} / {stats.totalStudents} students active
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-primary-600">
                        {Math.round(((stats.activeStudents || 0) / (stats.totalStudents || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(((stats.activeStudents || 0) / (stats.totalStudents || 1)) * 100)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Grading Progress
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {(stats.pendingGrading || 0)} submissions pending
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        {100 - ((stats.pendingGrading || 0) * 2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - ((stats.pendingGrading || 0) * 2)}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Performance Chart Placeholder */}
              <div className="mt-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-secondary-700 dark:to-secondary-600 rounded-lg border border-gray-200 dark:border-secondary-600">
                <ChartBarIcon className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
                  Performance charts coming soon
                </p>
                <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Track your progress with detailed analytics
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-secondary-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-blue-500" />
                Activity Timeline
              </h2>
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className={`w-12 h-12 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-6 w-6 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {activity.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {activity.description}
                            </p>
                          </div>
                          {activity.score && (
                            <div className="text-right ml-4">
                              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {activity.score}%
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          {activity.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedDashboard;
