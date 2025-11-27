import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  FireIcon,
  TrophyIcon,
  UserGroupIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  todayStudyTime: number;
  currentStreak: number;
  averageScore: number;
  studyGroups: number;
  completedQuizzes: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    score?: number;
    duration?: number;
    time: string;
  }>;
  upcomingTasks: Array<{
    id: string;
    title: string;
    due: string;
    priority: string;
  }>;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    loadTasks();
  }, []);

  const loadTasks = () => {
    const savedTasks = localStorage.getItem('studentTasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed.map((t: any) => ({...t, due: new Date(t.due)})));
      } catch (e) {
        console.error('Failed to load tasks:', e);
      }
    }
  };

  const saveTasks = (newTasks: any[]) => {
    setTasks(newTasks);
    localStorage.setItem('studentTasks', JSON.stringify(newTasks));
  };

  const handleAddTask = (task: any) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      completed: false
    };
    saveTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
    saveTasks(tasks.map(t => t.id === taskId ? {...t, completed: !t.completed} : t));
  };

  const handleDeleteTask = (taskId: string) => {
    saveTasks(tasks.filter(t => t.id !== taskId));
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, showing default values');
        setError('Not authenticated - please login');
        setStats({
          todayStudyTime: 0,
          currentStreak: 0,
          averageScore: 0,
          studyGroups: 0,
          completedQuizzes: 0,
          recentActivity: [],
          upcomingTasks: []
        });
        setLoading(false);
        return;
      }

      console.log('Fetching dashboard stats...');
      
      const response = await fetch('/api/progress/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired - please login again');
        }
        throw new Error(`Failed to load data (${response.status})`);
      }

      const data = await response.json();
      console.log('Dashboard data received:', data);
      
      if (data.success && data.data) {
        setStats(data.data);
        setError(null);
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (error: any) {
      console.error('Dashboard load error:', error);
      const errorMessage = error.message || 'Failed to load dashboard';
      setError(errorMessage);
      
      // Still show default values so page isn't blank
      setStats({
        todayStudyTime: 0,
        currentStreak: 0,
        averageScore: 0,
        studyGroups: 0,
        completedQuizzes: 0,
        recentActivity: [],
        upcomingTasks: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Student'}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Ready to continue your learning journey today?
              </p>
            </div>
            <RocketLaunchIcon className="h-24 w-24 opacity-20" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Dashboard Load Error</h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
                {error.includes('login') && (
                  <p className="text-sm text-red-700 mt-2">
                    <strong>Solution:</strong> Please <a href="/login" className="underline">login again</a> to continue.
                  </p>
                )}
                {error.includes('Session expired') && (
                  <p className="text-sm text-red-700 mt-2">
                    <strong>Solution:</strong> Your session has expired. Please <a href="/login" className="underline">login again</a>.
                  </p>
                )}
                {!error.includes('login') && !error.includes('Session') && (
                  <button
                    onClick={loadDashboardData}
                    className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
            <div className="mt-3 text-xs text-red-600 bg-red-100 p-2 rounded">
              <strong>Note:</strong> Dashboard is showing default values (zeros). Data will appear once you're logged in and have activity.
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Study Time</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayStudyTime} min</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <ClockIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900">{stats.currentStreak} days</p>
                {stats.currentStreak > 0 && (
                  <p className="text-xs text-green-600 mt-1">Keep it going! 🔥</p>
                )}
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <FireIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
                {stats.averageScore >= 80 && (
                  <p className="text-xs text-green-600 mt-1">Excellent! 🌟</p>
                )}
              </div>
              <div className="bg-yellow-100 p-4 rounded-full">
                <TrophyIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Study Groups</p>
                <p className="text-3xl font-bold text-gray-900">{stats.studyGroups}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message for New Users */}
        {stats.completedQuizzes === 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-200">
            <div className="flex items-start">
              <BookOpenIcon className="h-12 w-12 text-indigo-600 mr-4 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-indigo-900 mb-3">
                  Welcome to Your Learning Platform! 🎓
                </h2>
                <p className="text-indigo-700 mb-4 text-lg">
                  Get started with your personalized learning journey. Here's what you can do:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">Take Interactive Quizzes</h4>
                      <p className="text-sm text-indigo-700">Test your knowledge across subjects</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <ChartBarIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">Track Your Progress</h4>
                      <p className="text-sm text-indigo-700">Monitor performance and streaks</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">Join Study Groups</h4>
                      <p className="text-sm text-indigo-700">Collaborate with peers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <BookOpenIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900">Access Resources</h4>
                      <p className="text-sm text-indigo-700">Browse study materials</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/quizzes"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                  >
                    Start Learning Now
                  </Link>
                  <Link
                    to="/resources"
                    className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transition-colors"
                  >
                    Browse Resources
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Link
            to="/quizzes"
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all text-center group"
          >
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Take a Quiz</h3>
            <p className="text-sm text-gray-600">Test your knowledge</p>
          </Link>

          <Link
            to="/study-groups"
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-purple-300 transition-all text-center group"
          >
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Study Groups</h3>
            <p className="text-sm text-gray-600">Learn together</p>
          </Link>

          <Link
            to="/progress"
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-green-300 transition-all text-center group"
          >
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">View Progress</h3>
            <p className="text-sm text-gray-600">Track your growth</p>
          </Link>

          <Link
            to="/resources"
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-300 transition-all text-center group"
          >
            <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
              <BookOpenIcon className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Resources</h3>
            <p className="text-sm text-gray-600">Study materials</p>
          </Link>

          <Link
            to="/tasks"
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-6 shadow-md border border-pink-200 hover:shadow-2xl transition-all text-center group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-opacity-30 transition-all relative z-10">
              <CalendarDaysIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2 relative z-10">Task Calendar</h3>
            <p className="text-sm text-pink-100 relative z-10">Plan & Organize</p>
            {tasks.length > 0 && (
              <div className="absolute top-2 right-2 bg-white text-pink-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg z-20">
                {tasks.filter(t => !t.completed).length}
              </div>
            )}
          </Link>
        </div>

        {/* Recent Activity & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-blue-600" />
              Recent Activity
            </h2>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`p-2 rounded-full mr-3 ${
                      activity.type === 'quiz' ? 'bg-blue-100' :
                      activity.type === 'study' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      <AcademicCapIcon className={`h-5 w-5 ${
                        activity.type === 'quiz' ? 'text-blue-600' :
                        activity.type === 'study' ? 'text-green-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    {activity.score && (
                      <span className="text-sm font-semibold text-gray-700">
                        {activity.score}%
                      </span>
                    )}
                  </div>
                ))}
                <Link
                  to="/progress"
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium mt-4"
                >
                  View all activity
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpenIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No activity yet</p>
                <Link
                  to="/quizzes"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start Learning
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <ClockIcon className="h-6 w-6 mr-2 text-purple-600" />
                Upcoming Tasks
              </span>
              <Link
                to="/tasks"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View All →
              </Link>
            </h2>
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks
                  .filter(t => !t.completed && new Date(t.due) >= new Date())
                  .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
                  .slice(0, 5)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          task.priority === 'high' ? 'bg-red-500' :
                          task.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span>{new Date(task.due).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded ${
                              task.category === 'quiz' ? 'bg-blue-100 text-blue-700' :
                              task.category === 'study' ? 'bg-green-100 text-green-700' :
                              task.category === 'assignment' ? 'bg-yellow-100 text-yellow-700' :
                              task.category === 'project' ? 'bg-purple-100 text-purple-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {task.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                {tasks.filter(t => !t.completed && new Date(t.due) >= new Date()).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No tasks yet</p>
                <Link
                  to="/tasks"
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create Your First Task
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Study Statistics */}
        {stats.completedQuizzes > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Quizzes Completed</span>
                  <span className="text-sm font-bold text-blue-600">{stats.completedQuizzes}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((stats.completedQuizzes / 10) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Goal: 10 quizzes</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Average Score</span>
                  <span className={`text-sm font-bold ${
                    stats.averageScore >= 80 ? 'text-green-600' :
                    stats.averageScore >= 60 ? 'text-yellow-600' :
                    'text-orange-600'
                  }`}>
                    {stats.averageScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      stats.averageScore >= 80 ? 'bg-green-600' :
                      stats.averageScore >= 60 ? 'bg-yellow-600' :
                      'bg-orange-600'
                    }`}
                    style={{ width: `${stats.averageScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.averageScore >= 80 ? 'Excellent!' :
                   stats.averageScore >= 60 ? 'Good progress!' :
                   'Keep practicing!'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Study Streak</span>
                  <span className="text-sm font-bold text-orange-600">{stats.currentStreak} days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((stats.currentStreak / 7) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.currentStreak >= 7 ? 'Amazing streak!' :
                   stats.currentStreak > 0 ? 'Keep it going!' :
                   'Start today!'}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
