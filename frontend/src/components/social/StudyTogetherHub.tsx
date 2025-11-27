import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  AcademicCapIcon,
  SparklesIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  ClockIcon,
  StarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const StudyTogetherHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buddies' | 'tutors' | 'challenges'>('buddies');
  const [studyBuddies, setStudyBuddies] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    if (activeTab === 'buddies') {
      loadStudyBuddies();
    } else if (activeTab === 'tutors') {
      loadTutors();
    }
  }, [activeTab, selectedSubject]);

  const loadStudyBuddies = async () => {
    setLoading(true);
    try {
      const response = await api.get('/social/buddies/matches');
      setStudyBuddies(response.data.matches || []);
    } catch (error) {
      console.error('Load buddies error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTutors = async () => {
    setLoading(true);
    try {
      const params = selectedSubject ? `?subject=${selectedSubject}` : '';
      const response = await api.get(`/social/tutors${params}`);
      setTutors(response.data.tutors || []);
    } catch (error) {
      console.error('Load tutors error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendBuddyRequest = async (buddyId: string) => {
    try {
      await api.post('/social/buddies/request', {
        toUserId: buddyId,
        message: 'Hey! Would you like to study together?'
      });
      alert('✅ Request sent!');
    } catch (error) {
      alert('Failed to send request');
    }
  };

  const bookTutorSession = async (tutorId: string) => {
    try {
      await api.post('/social/tutors/book', {
        tutorId,
        subject: selectedSubject || 'General',
        date: new Date().toISOString(),
        duration: 60
      });
      alert('✅ Session booked! Check your email for details.');
    } catch (error) {
      alert('Failed to book session');
    }
  };

  const subjects = ['Math', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology'];

  const tabs = [
    { id: 'buddies', name: 'Find Study Buddies', icon: UserGroupIcon },
    { id: 'tutors', name: 'Find Tutors', icon: AcademicCapIcon },
    { id: 'challenges', name: 'Group Challenges', icon: TrophyIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Study Together 🤝</h1>
            <p className="text-xl text-orange-50">
              Learn better with friends, tutors, and study groups
            </p>
          </div>
          <div className="hidden md:block text-7xl">
            {activeTab === 'buddies' ? '👥' :
             activeTab === 'tutors' ? '🎓' : '🏆'}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <UserGroupIcon className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-orange-100">Online Now</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <AcademicCapIcon className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-orange-100">Tutors</div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <TrophyIcon className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-orange-100">Challenges</div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-lg">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden md:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subject Filter */}
      {(activeTab === 'buddies' || activeTab === 'tutors') && (
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Subject:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubject('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedSubject === ''
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Subjects
            </button>
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedSubject === subject
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content based on tab */}
      {activeTab === 'buddies' && (
        <div className="bg-white rounded-xl p-12 text-center">
          <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Coming Soon!</h3>
          <p className="text-gray-500 mb-4">
            AI-powered study buddy matching is being built. You'll be able to find perfect study partners based on your subjects, goals, and schedule!
          </p>
        </div>
      )}

      {activeTab === 'tutors' && (
        <div className="bg-white rounded-xl p-12 text-center">
          <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Tutoring Marketplace</h3>
          <p className="text-gray-500 mb-6">
            Connect with experienced peer tutors. Book 1-on-1 sessions and get personalized help!
          </p>
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all">
            Become a Tutor & Earn Money
          </button>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '7-Day Study Streak', reward: '🏆 Gold Badge', color: 'from-yellow-400 to-orange-500' },
              { title: 'Math Master', reward: '🎓 Math Pro', color: 'from-blue-400 to-purple-500' },
              { title: 'Study Group Hero', reward: '💖 Helper Badge', color: 'from-pink-400 to-red-500' }
            ].map((challenge, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className={`w-full h-2 bg-gradient-to-r ${challenge.color} rounded-full mb-4`} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-600 mb-4">Challenge yourself and earn rewards!</p>
                <div className="text-center mb-4">
                  <span className="text-2xl">{challenge.reward}</span>
                </div>
                <button className={`w-full bg-gradient-to-r ${challenge.color} text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all`}>
                  Join Challenge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTogetherHub;
