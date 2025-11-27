import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  PaperAirplaneIcon,
  VideoCameraIcon,
  EnvelopeIcon,
  XMarkIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import getSocket from '../../services/socket';
import { Button } from '../ui/Button';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export const PrivateMessaging: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    const socket = getSocket();

    socket.on('private-message:new', handleNewMessage);
    socket.on('message:read', handleMessageRead);
    socket.on('user:online', handleUserOnline);

    return () => {
      socket.off('private-message:new', handleNewMessage);
      socket.off('message:read', handleMessageRead);
      socket.off('user:online', handleUserOnline);
    };
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      // TODO: Replace with actual API call
      const mockConversations: Conversation[] = [
        {
          userId: '1',
          userName: 'Sarah Johnson',
          userAvatar: undefined,
          lastMessage: 'Hey, are you ready for the quiz?',
          lastMessageTime: '2 min ago',
          unreadCount: 2,
          isOnline: true,
        },
        {
          userId: '2',
          userName: 'Mike Chen',
          userAvatar: undefined,
          lastMessage: 'Thanks for the study notes!',
          lastMessageTime: '1 hour ago',
          unreadCount: 0,
          isOnline: false,
        },
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      // TODO: Replace with actual API call
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: userId,
          senderName: 'Sarah Johnson',
          content: 'Hi! Do you want to study together?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true,
        },
        {
          id: '2',
          senderId: user?.id || '',
          senderName: 'You',
          content: 'Sure! What time works for you?',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          read: true,
        },
      ];
      setMessages(mockMessages);
      
      markAsRead(userId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (message.senderId === selectedUserId || message.senderId === user?.id) {
      setMessages(prev => [...prev, message]);
    }
    
    setConversations(prev =>
      prev.map(conv =>
        conv.userId === message.senderId
          ? {
              ...conv,
              lastMessage: message.content,
              lastMessageTime: 'Just now',
              unreadCount: selectedUserId === message.senderId ? 0 : conv.unreadCount + 1,
            }
          : conv
      )
    );
  };

  const handleMessageRead = (data: { userId: string; messageIds: string[] }) => {
    if (data.userId === selectedUserId) {
      setMessages(prev =>
        prev.map(msg =>
          data.messageIds.includes(msg.id) ? { ...msg, read: true } : msg
        )
      );
    }
  };

  const handleUserOnline = (data: { userId: string; isOnline: boolean }) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.userId === data.userId ? { ...conv, isOnline: data.isOnline } : conv
      )
    );
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedUserId) return;

    const socket = getSocket();
    const message = {
      recipientId: selectedUserId,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    socket.emit('private-message:send', message);
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      senderName: 'You',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const markAsRead = (userId: string) => {
    const socket = getSocket();
    socket.emit('private-message:read', { senderId: userId });
    
    setConversations(prev =>
      prev.map(conv =>
        conv.userId === userId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const startVideoCall = () => {
    if (!selectedUserId) return;
    const roomId = `${user?.id}-${selectedUserId}-${Date.now()}`;
    window.open(`/video-call/${roomId}`, '_blank');
  };

  const sendInvitation = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/invitations/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          email: inviteEmail.trim(),
          message: 'Join me for private messaging on our study platform!'
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Invitation sent successfully! ✉️');
        setInviteEmail('');
        setShowInviteModal(false);
      } else {
        toast.error(data.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Failed to send invitation:', error);
      toast.error('Failed to send invitation. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(conv => conv.userId === selectedUserId);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-secondary-900 rounded-lg shadow-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-200 dark:border-secondary-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-secondary-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
            <button
              onClick={() => setShowInviteModal(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
              title="Invite via Email"
            >
              <UserPlusIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.userId}
              onClick={() => setSelectedUserId(conv.userId)}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-secondary-800 transition-colors ${
                selectedUserId === conv.userId ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-300 font-semibold">
                    {conv.userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {conv.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-secondary-900" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">{conv.userName}</span>
                  <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="flex-shrink-0 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-secondary-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-300 font-semibold">
                    {selectedConversation?.userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {selectedConversation?.userName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedConversation?.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <button
                onClick={startVideoCall}
                className="p-2 hover:bg-gray-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                title="Start Video Call"
              >
                <VideoCameraIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === user?.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-secondary-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-secondary-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
                <Button onClick={sendMessage} leftIcon={<PaperAirplaneIcon className="h-5 w-5" />}>
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <EnvelopeIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-secondary-800 rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Invite via Email
                </h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Send an invitation to chat with someone via email
              </p>
              
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-gray-900 dark:text-white mb-4"
              />
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button onClick={sendInvitation}>
                  Send Invitation
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivateMessaging;
