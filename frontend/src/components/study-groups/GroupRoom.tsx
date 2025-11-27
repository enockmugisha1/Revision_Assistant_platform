import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  PaperAirplaneIcon, 
  VideoCameraIcon, 
  UserPlusIcon, 
  ArrowLeftIcon,
  UserGroupIcon,
  EllipsisVerticalIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import getSocket from '../../services/socket';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface ChatMessage {
  id: number | string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  message: string;
  timestamp: string | Date;
}

interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role?: string;
}

interface GroupInfo {
  _id: string;
  name: string;
  subject: string;
  level: string;
  members: GroupMember[];
}

export const GroupRoom: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    
    // Load group info
    loadGroupInfo();
    
    const socket = getSocket();
    socket.emit('study-group:join', id);

    const onNew = (msg: ChatMessage) => setMessages((prev) => [...prev, msg]);
    socket.on('chat:new-message', onNew);

    const onTypingStart = (data: any) => {
      setTypingUsers((prev) => ({ ...prev, [data.userId]: data.firstName }));
    };
    const onTypingStop = (data: any) => {
      setTypingUsers((prev) => {
        const copy = { ...prev };
        delete copy[data.userId];
        return copy;
      });
    };
    socket.on('typing:user-started', onTypingStart);
    socket.on('typing:user-stopped', onTypingStop);

    return () => {
      socket.emit('study-group:leave', id);
      socket.off('chat:new-message', onNew);
      socket.off('typing:user-started', onTypingStart);
      socket.off('typing:user-stopped', onTypingStop);
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadGroupInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/study-groups/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setGroupInfo(data.data);
      }
    } catch (error) {
      console.error('Failed to load group info:', error);
      toast.error('Failed to load group information');
    } finally {
      setLoading(false);
    }
  };

  const startVideoCall = () => {
    if (!groupInfo) return;
    const roomId = `group-${id}`;
    navigate(`/video-call/${roomId}?name=${encodeURIComponent(groupInfo.name)}`);
    toast.success('Starting video call... 📹');
  };

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed || !id) return;
    const socket = getSocket();
    socket.emit('chat:message', { groupId: id, message: trimmed, type: 'text' });
    setInput('');
    socket.emit('typing:stop', { groupId: id });
  };

  const handleInput = (v: string) => {
    setInput(v);
    const socket = getSocket();
    if (!id) return;
    if (v.trim().length > 0) socket.emit('typing:start', { groupId: id });
    else socket.emit('typing:stop', { groupId: id });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!groupInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Group not found</h2>
          <Link to="/study-groups">
            <Button>Back to Groups</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-secondary-900">
      {/* Header - WhatsApp-like */}
      <div className="bg-white dark:bg-secondary-800 border-b border-gray-200 dark:border-secondary-700 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => navigate('/study-groups')}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold cursor-pointer"
            onClick={() => setShowMembers(!showMembers)}
          >
            <UserGroupIcon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {groupInfo.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {groupInfo.members?.length || 0} members • {groupInfo.subject}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={startVideoCall}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded-full transition-colors"
            title="Start video call"
          >
            <VideoCameraIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded-full transition-colors"
            title="Group info"
          >
            <EllipsisVerticalIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/geometry2.png')] dark:bg-secondary-900">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ChatBubbleLeftIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Be the first to say something!
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isCurrentUser = m.userId === user?._id?.toString();
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isCurrentUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {getInitials(m.firstName, m.lastName)}
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!isCurrentUser && (
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 px-3">
                          {m.firstName} {m.lastName}
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-primary-500 text-white rounded-tr-sm'
                            : 'bg-white dark:bg-secondary-800 text-gray-900 dark:text-white rounded-tl-sm shadow-sm'
                        }`}
                      >
                        <p className="text-sm break-words">{m.message}</p>
                        <span className={`text-xs mt-1 block ${
                          isCurrentUser ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTime(m.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            
            {Object.keys(typingUsers).length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 px-3">
                <div className="flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                </div>
                <span>{Object.values(typingUsers).join(', ')} typing...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area - WhatsApp-like */}
          <div className="bg-white dark:bg-secondary-800 border-t border-gray-200 dark:border-secondary-700 p-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1 bg-gray-100 dark:bg-secondary-700 rounded-2xl px-4 py-2">
                <input
                  className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={input}
                  onChange={(e) => handleInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                />
              </div>
              <button
                onClick={send}
                disabled={!input.trim()}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-secondary-600 text-white rounded-full p-3 transition-colors"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white dark:bg-secondary-800 border-l border-gray-200 dark:border-secondary-700 overflow-y-auto"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Group Members ({groupInfo.members?.length || 0})
              </h3>
              <div className="space-y-2">
                {groupInfo.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {getInitials(member.firstName, member.lastName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {member.firstName} {member.lastName}
                      </p>
                      {member.role && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {member.role}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate(`/study-groups?invite=${id}`)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <UserPlusIcon className="h-5 w-5" />
                <span>Invite Members</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GroupRoom;

