import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface ClassStats {
  totalStudents: number;
  activeStudents: number;
  avgQuizScore: number;
  pendingGrading: number;
  upcomingDeadlines: number;
}

interface RecentActivity {
  id: string;
  type: 'submission' | 'question' | 'completed';
  student: string;
  content: string;
  timestamp: string;
}

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ClassStats>({
    totalStudents: 0,
    activeStudents: 0,
    avgQuizScore: 0,
    pendingGrading: 0,
    upcomingDeadlines: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // TODO: Fetch from API
    // Simulated data for now
    setStats({
      totalStudents: 45,
      activeStudents: 38,
      avgQuizScore: 82.5,
      pendingGrading: 12,
      upcomingDeadlines: 3,
    });

    setRecentActivity([
      {
        id: '1',
        type: 'submission',
        student: 'John Doe',
        content: 'Submitted Math Quiz #5',
        timestamp: '2 minutes ago',
      },
      {
        id: '2',
        type: 'question',
        student: 'Jane Smith',
        content: 'Asked a question about Chapter 3',
        timestamp: '15 minutes ago',
      },
    ]);

    setLoading(false);
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      change: '+5 this month',
    },
    {
      title: 'Active Today',
      value: stats.activeStudents,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: `${Math.round((stats.activeStudents / stats.totalStudents) * 100)}% engagement`,
    },
    {
      title: 'Avg Quiz Score',
      value: `${stats.avgQuizScore}%`,
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
      change: '+3.5% from last week',
    },
    {
      title: 'Pending Grading',
      value: stats.pendingGrading,
      icon: ClockIcon,
      color: 'bg-orange-500',
      change: 'Needs attention',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.firstName}! Here's your class overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/quizzes/create">
            <Button leftIcon={<PlusIcon className="h-4 w-4" />}>
              Create Quiz
            </Button>
          </Link>
          <Link to="/study-groups/new">
            <Button variant="outline" leftIcon={<UserGroupIcon className="h-4 w-4" />}>
              New Group
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-secondary-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-secondary-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link to="/activity" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-secondary-700 rounded-lg"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'submission' ? 'bg-blue-100 dark:bg-blue-900' :
                  activity.type === 'question' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  'bg-green-100 dark:bg-green-900'
                }`}>
                  {activity.type === 'submission' && <AcademicCapIcon className="h-4 w-4 text-blue-600 dark:text-blue-300" />}
                  {activity.type === 'question' && <ExclamationCircleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />}
                  {activity.type === 'completed' && <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-300" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.student}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link to="/grading">
              <button className="w-full text-left p-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-200">
                    Grade Submissions
                  </span>
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingGrading}
                  </span>
                </div>
              </button>
            </Link>
            <Link to="/analytics">
              <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
                    View Analytics
                  </span>
                </div>
              </button>
            </Link>
            <Link to="/announcements">
              <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Post Announcement
                  </span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-secondary-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Class Performance Overview
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <ChartBarIcon className="h-16 w-16 mx-auto mb-2 opacity-50" />
          <p>Performance charts will appear here</p>
          <p className="text-sm mt-1">Track student progress and identify areas for improvement</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
