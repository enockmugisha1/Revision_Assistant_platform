import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  VideoCameraIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import StudyGroupService, { StudyGroupListItem, CreateStudyGroupDto } from '../../services/studyGroupService';
import { useAuth } from '../../contexts/AuthContext';

export const EnhancedStudyGroupsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<StudyGroupListItem[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroupListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [form, setForm] = useState<CreateStudyGroupDto>({ name: '', subject: '', level: 'beginner' });
  const [error, setError] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedGroupForInvite, setSelectedGroupForInvite] = useState<string | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    filterGroups();
  }, [searchTerm, levelFilter, groups]);

  const loadGroups = async () => {
    try {
      const data = await StudyGroupService.list();
      setGroups(data);
      setFilteredGroups(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const filterGroups = () => {
    let filtered = groups;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        g => g.name.toLowerCase().includes(term) || g.subject.toLowerCase().includes(term)
      );
    }

    if (levelFilter) {
      filtered = filtered.filter(g => g.level === levelFilter);
    }

    setFilteredGroups(filtered);
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const newGroup = await StudyGroupService.create(form);
      setGroups((prev) => [newGroup as any, ...prev]);
      setShowForm(false);
      setForm({ name: '', subject: '', level: 'beginner' });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create group');
    }
  };

  const startVideoCall = (groupId: string) => {
    const roomId = `group-${groupId}-${Date.now()}`;
    navigate(`/video-call/${roomId}`);
  };

  const openPrivateChat = (groupId: string) => {
    navigate(`/messages?group=${groupId}`);
  };

  const sendEmailInvite = async (groupId: string) => {
    if (!inviteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/study-groups/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          groupId, 
          email: inviteEmail,
          invitedBy: user?.id 
        }),
      });

      if (response.ok) {
        alert('Invitation sent successfully!');
        setInviteEmail('');
        setSelectedGroupForInvite(null);
      } else {
        alert('Failed to send invitation');
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Groups</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect, learn together, and have video calls with your peers
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/messages">
            <Button variant="outline" leftIcon={<ChatBubbleLeftIcon className="h-4 w-4" />}>
              Messages
            </Button>
          </Link>
          <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setShowForm((v) => !v)}>
            New Group
          </Button>
        </div>
      </div>

      {/* Create Group Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New Study Group</h2>
          <form onSubmit={createGroup} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                placeholder="e.g., Math Study Group"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                placeholder="e.g., Mathematics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Level
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="submit">Create Group</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="border border-gray-300 dark:border-secondary-600 rounded-lg px-4 py-2 bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Groups Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700">
          <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No groups found</h3>
          <p className="text-gray-600 dark:text-gray-400">Create a new group to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm border border-gray-200 dark:border-secondary-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{group.subject}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  group.level === 'beginner' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                  group.level === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                  'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                }`}>
                  {group.level}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  <span>{group.memberCount} member{group.memberCount !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/study-groups/${group._id}`} className="flex-1">
                  <Button size="sm" className="w-full">
                    Join Chat
                  </Button>
                </Link>
                <button
                  onClick={() => startVideoCall(group._id)}
                  className="p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  title="Start Video Call"
                >
                  <VideoCameraIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </button>
                <button
                  onClick={() => setSelectedGroupForInvite(group._id)}
                  className="p-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                  title="Invite via Email"
                >
                  <EnvelopeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </button>
              </div>

              {/* Email Invite Input */}
              {selectedGroupForInvite === group._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-gray-200 dark:border-secondary-700"
                >
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email..."
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-secondary-600 rounded bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
                    />
                    <Button
                      size="sm"
                      onClick={() => sendEmailInvite(group._id)}
                    >
                      Send
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedStudyGroupsPage;
