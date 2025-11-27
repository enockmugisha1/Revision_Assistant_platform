import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// In-memory storage (replace with database in production)
const conversations = new Map();
const messages = new Map();

// Get all conversations for current user
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const userConversations = [];

    for (const [conversationId, conv] of conversations.entries()) {
      if (conv.participants.includes(userId)) {
        const otherUserId = conv.participants.find(id => id !== userId);
        // TODO: Fetch other user details from database
        userConversations.push({
          id: conversationId,
          otherUserId,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          unreadCount: conv.unreadCount?.[userId] || 0
        });
      }
    }

    res.json({
      success: true,
      data: userConversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// Get messages for a conversation
router.get('/conversation/:userId', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const otherUserId = req.params.userId;
    
    // Create conversation ID (sorted to ensure consistency)
    const conversationId = [currentUserId, otherUserId].sort().join('-');
    
    const conversationMessages = messages.get(conversationId) || [];

    res.json({
      success: true,
      data: conversationMessages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Send a message (also handled via WebSocket)
router.post('/send', protect, async (req, res) => {
  try {
    const { recipientId, content, type = 'text' } = req.body;
    const senderId = req.user._id.toString();

    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Recipient and content are required'
      });
    }

    // Create conversation ID
    const conversationId = [senderId, recipientId].sort().join('-');

    // Create or update conversation
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, {
        participants: [senderId, recipientId],
        lastMessage: content,
        lastMessageTime: new Date(),
        unreadCount: { [recipientId]: 1 }
      });
    } else {
      const conv = conversations.get(conversationId);
      conv.lastMessage = content;
      conv.lastMessageTime = new Date();
      conv.unreadCount[recipientId] = (conv.unreadCount[recipientId] || 0) + 1;
    }

    // Store message
    const message = {
      id: Date.now().toString(),
      senderId,
      recipientId,
      content,
      type,
      timestamp: new Date(),
      read: false
    };

    if (!messages.has(conversationId)) {
      messages.set(conversationId, []);
    }
    messages.get(conversationId).push(message);

    // Emit via WebSocket (handled in socket.js)
    const io = req.app.get('io');
    if (io) {
      io.to(recipientId).emit('private-message:new', message);
    }

    res.json({
      success: true,
      message: 'Message sent',
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Mark messages as read
router.post('/read', protect, async (req, res) => {
  try {
    const { senderId } = req.body;
    const currentUserId = req.user._id.toString();
    
    const conversationId = [currentUserId, senderId].sort().join('-');
    const conversationMessages = messages.get(conversationId) || [];

    // Mark all messages from sender as read
    conversationMessages.forEach(msg => {
      if (msg.senderId === senderId && !msg.read) {
        msg.read = true;
      }
    });

    // Update unread count
    const conv = conversations.get(conversationId);
    if (conv) {
      conv.unreadCount[currentUserId] = 0;
    }

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
});

// Delete a conversation
router.delete('/conversation/:userId', protect, async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const otherUserId = req.params.userId;
    
    const conversationId = [currentUserId, otherUserId].sort().join('-');
    
    conversations.delete(conversationId);
    messages.delete(conversationId);

    res.json({
      success: true,
      message: 'Conversation deleted'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation'
    });
  }
});

export default router;
