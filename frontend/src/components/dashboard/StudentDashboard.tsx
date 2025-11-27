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
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

interface StudentStats {
  studyStreak: number;
  totalStudyTime: number;
  completedQuizzes: number;
  averageScore: number;
  upcomingQuizzes: number;
  achievements: number;
}

interface UpcomingQuiz {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  difficulty: string;
}

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats>({
    studyStreak: 0,
    totalStudyTime: 0,
    completedQuizzes: 0,
    averageScore: 0,
    upcomingQuizzes: 0,
    achievements: 0,
  });
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<UpcomingQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // TODO: Fetch from API
    // Simulated data
    setStats({
      studyStreak: 7,
      totalStudyTime: 245,
      completedQuizzes: 12,
      averageScore: 85,
      upcomingQuizzes: 3,
      achievements: 8,
    });

    setUpcomingQuizzes([
      {
        id: '1',
        title: 'Mathematics Final Review',
        subject: 'Math',
        dueDate: '2 days',
        difficulty: 'hard',
      },
      {
        id: '2',
        title: 'Science Chapter 5',
        subject: 'Science',
        dueDate: '5 days',
        difficulty: 'medium',
      },
    ]);

    setLoading(false);
  };

  const statCards = [
    {
      title: 'Study Streak',
      value: `${stats.studyStreak} days`,
      icon: FireIcon,
      color: 'bg-orange-500',
      subtitle: 'Keep it up!',
    },
    {
      title: 'Study Time',
      value: `${stats.totalStudyTime}h`,
      icon: ClockIcon,
      color: 'bg-blue-500',
      subtitle: 'This month',
    },
    {
      title: 'Quizzes Done',
      value: stats.completedQuizzes,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      subtitle: `${stats.averageScore}% avg score`,
    },
    {
      title: 'Achievements',
      value: stats.achievements,
      icon: TrophyIcon,
      color: 'bg-purple-500',
      subtitle: 'Earned',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.firstName}! 🎓
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <Link to="/quizzes/generate">
          <Button leftIcon={<RocketLaunchIcon className="h-4 w-4" />}>
            Generate AI Quiz
          </Button>
        </Link>
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
                  {stat.subtitle}
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
        {/* Upcoming Quizzes */}
        <div className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-secondary-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Quizzes
            </h2>
            <Link to="/quizzes" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingQuizzes.length > 0 ? (
              upcomingQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Subject: {quiz.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded">
                          Due in {quiz.dueDate}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          quiz.difficulty === 'hard' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' :
                          quiz.difficulty === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200' :
                          'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200'
                        }`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                    <Link to={`/quizzes/${quiz.id}`}>
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AcademicCapIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No upcoming quizzes</p>
                <Link to="/quizzes/generate" className="text-primary-600 text-sm mt-2 inline-block">
                  Generate one with AI
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link to="/study-groups">
              <button className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Join Study Group
                  </span>
                </div>
              </button>
            </Link>
            <Link to="/resources">
              <button className="w-full text-left p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-200">
                    Browse Resources
                  </span>
                </div>
              </button>
            </Link>
            <Link to="/progress">
              <button className="w-full text-left p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-5 w-5 text-green-600 dark:text-green-300" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-200">
                    View Progress
                  </span>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Study Goals */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-secondary-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Study Goals
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 dark:text-gray-300">Weekly Study Time Goal</span>
              <span className="text-gray-600 dark:text-gray-400">15h / 20h</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
              <div className="bg-primary-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 dark:text-gray-300">Quiz Completion Goal</span>
              <span className="text-gray-600 dark:text-gray-400">8 / 10</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-secondary-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
