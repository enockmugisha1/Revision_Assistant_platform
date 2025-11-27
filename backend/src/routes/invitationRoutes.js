import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import crypto from 'crypto';

const router = express.Router();

// In-memory storage (replace with database in production)
const invitations = new Map();
const conversations = new Map();
const messages = new Map();

// Send invitation via email
router.post('/send', protect, async (req, res) => {
  try {
    const { email, groupId, message } = req.body;
    const inviter = req.user;

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/accept-invite/${token}`;

    // Store invitation
    invitations.set(token, {
      email,
      inviterId: inviter._id,
      inviterName: `${inviter.firstName} ${inviter.lastName}`,
      groupId,
      message,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // TODO: Send actual email using nodemailer
    // For now, just return the link
    console.log(`Invitation link for ${email}: ${inviteLink}`);

    /*
    Example email sending with nodemailer:
    
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${inviter.firstName} invited you to join a study group`,
      html: `
        <h2>You've been invited!</h2>
        <p>${inviter.firstName} ${inviter.lastName} has invited you to join their study group.</p>
        ${message ? `<p>Message: ${message}</p>` : ''}
        <a href="${inviteLink}">Click here to accept the invitation</a>
        <p>This link expires in 7 days.</p>
      `
    });
    */

    res.json({
      success: true,
      message: 'Invitation sent successfully',
      data: { inviteLink } // Remove in production
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitation'
    });
  }
});

// Accept invitation
router.get('/accept/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const invitation = invitations.get(token);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found or expired'
      });
    }

    if (new Date() > invitation.expiresAt) {
      invitations.delete(token);
      return res.status(400).json({
        success: false,
        message: 'Invitation has expired'
      });
    }

    res.json({
      success: true,
      message: 'Invitation is valid',
      data: {
        inviterName: invitation.inviterName,
        groupId: invitation.groupId,
        message: invitation.message
      }
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process invitation'
    });
  }
});

// Get user's invitations
router.get('/my-invitations', protect, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userInvites = [];

    for (const [token, invite] of invitations.entries()) {
      if (invite.email === userEmail && new Date() < invite.expiresAt) {
        userInvites.push({
          token,
          ...invite
        });
      }
    }

    res.json({
      success: true,
      data: userInvites
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invitations'
    });
  }
});

export default router;
