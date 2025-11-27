import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  PlusIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  VideoCameraIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import StudyGroupService, { StudyGroupListItem, CreateStudyGroupDto } from '../../services/studyGroupService';
import { useAuth } from '../../contexts/AuthContext';

interface InviteModalProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ groupId, groupName, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/invitations/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          email: email.trim(),
          groupId,
          message: message.trim() || `Join me in the "${groupName}" study group!`
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Invitation sent successfully! ✉️');
        setEmail('');
        setMessage('');
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
      toast.error('Failed to send invitation. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Invite to {groupName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={sending}
              className="flex-1"
            >
              {sending ? 'Sending...' : 'Send Invitation'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const ImprovedStudyGroupsPage: React.FC = () => {
  const { user: _ } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<StudyGroupListItem[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroupListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [form, setForm] = useState<CreateStudyGroupDto>({ name: '', subject: '', level: 'beginner' });
  const [error, setError] = useState<string>('');
  const [selectedGroupForInvite, setSelectedGroupForInvite] = useState<{ id: string; name: string } | null>(null);

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
      toast.error('Failed to load study groups');
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
      toast.success('Study group created successfully! 🎉');
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Failed to create group';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const startVideoCall = (groupId: string, groupName: string) => {
    const roomId = `group-${groupId}`;
    const roomName = groupName.replace(/\s+/g, '-');
    navigate(`/video-call/${roomId}?name=${encodeURIComponent(roomName)}`);
    toast.success('Starting video call... 📹');
  };

  const openGroupRoom = (groupId: string) => {
    navigate(`/study-groups/${groupId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Groups</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            💬 Chat, 📹 Video Call, and 📚 Study Together
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/messages">
            <Button variant="outline" leftIcon={<ChatBubbleLeftIcon className="h-5 w-5" />}>
              Messages
            </Button>
          </Link>
          <Button leftIcon={<PlusIcon className="h-5 w-5" />} onClick={() => setShowForm(true)}>
            New Group
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Create Group Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-gray-200 dark:border-secondary-700 p-6 overflow-hidden"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Create New Study Group
            </h2>
            <form onSubmit={createGroup} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Math Study Group"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level *
                </label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit">Create Group</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Groups List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No study groups yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first study group to start learning together!
            </p>
            <Button onClick={() => setShowForm(true)}>
              Create Your First Group
            </Button>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <motion.div
              key={group._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {group.subject} • {group.level}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                  {group.memberCount || 0} members
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openGroupRoom(group._id)}
                  leftIcon={<ChatBubbleLeftIcon className="h-4 w-4" />}
                  className="flex-1"
                >
                  Chat
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startVideoCall(group._id, group.name)}
                  leftIcon={<VideoCameraIcon className="h-4 w-4" />}
                  className="flex-1"
                >
                  Video
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedGroupForInvite({ id: group._id, name: group.name })}
                  leftIcon={<UserPlusIcon className="h-4 w-4" />}
                >
                  Invite
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {selectedGroupForInvite && (
          <InviteModal
            groupId={selectedGroupForInvite.id}
            groupName={selectedGroupForInvite.name}
            onClose={() => setSelectedGroupForInvite(null)}
            onSuccess={() => loadGroups()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImprovedStudyGroupsPage;
