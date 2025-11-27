# Role-Based Features & Video Call Integration

## Overview
This document outlines the implementation of:
1. Different UI/features for Students vs Teachers
2. Private messaging between users
3. Video call integration with multiple free APIs
4. Email-based invitations to study groups

---

## 1. Role-Based Features

### Student View
- **Dashboard**: Focus on learning progress, upcoming quizzes, study goals
- **Quizzes**: Take quizzes, view scores, get AI help
- **Resources**: Browse and bookmark educational content
- **Study Groups**: Join groups, chat, collaborate
- **Limitations**: Cannot create quizzes for others, limited analytics

### Teacher View
- **Dashboard**: Class overview, student progress analytics, assignment tracking
- **Quizzes**: Create/manage quizzes, view student performance, grade submissions
- **Resources**: Upload content, create lesson plans, curate materials
- **Study Groups**: Create/moderate groups, monitor discussions, insights
- **Analytics**: Advanced reports on student performance and engagement
- **Special Features**: Bulk actions, grading tools, announcement system

---

## 2. Video Call Integration Options

### Recommended Free APIs:

#### A. **Daily.co** (RECOMMENDED)
- **Free Tier**: 1000 minutes/month
- **Features**: Screen sharing, recording, chat, up to 200 participants
- **Easy Integration**: Simple React SDK
- **Setup**: https://www.daily.co/
```bash
npm install @daily-co/daily-js @daily-co/daily-react
```

#### B. **Whereby Embedded**
- **Free Tier**: Up to 4 participants, unlimited meetings
- **Features**: Screen sharing, mobile support, no downloads
- **Easy Integration**: Just iframe embed
- **Setup**: https://whereby.com/information/embedded/

#### C. **Jitsi Meet**
- **Free**: Completely open source, unlimited
- **Features**: Full-featured, screen sharing, recording
- **Self-hosted or use free server**
- **Setup**: https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-sdk

#### D. **Agora.io**
- **Free Tier**: 10,000 minutes/month
- **Features**: HD video, screen sharing, recording
- **Setup**: https://www.agora.io/

---

## 3. Private Messaging System

### Features:
- Direct 1-on-1 messaging between users
- Email invitations with links
- Real-time chat with WebSocket
- File sharing support
- Typing indicators
- Read receipts
- Message history

---

## 4. Email Invitation System

### Flow:
1. User enters email address
2. System generates unique invitation token
3. Email sent with invitation link
4. Recipient clicks link and can chat directly
5. Works even if recipient doesn't have account (prompts to register)

---

## Implementation Files Created:

### Frontend Components:
1. `RoleSwitchDashboard.tsx` - Different dashboards for students/teachers
2. `TeacherDashboard.tsx` - Teacher-specific features
3. `StudentDashboard.tsx` - Student-focused interface
4. `PrivateMessaging.tsx` - 1-on-1 chat system
5. `VideoCallRoom.tsx` - Video call integration
6. `InvitationSystem.tsx` - Email invitation UI

### Backend Routes:
1. `messageRoutes.js` - Private messaging API
2. `invitationRoutes.js` - Email invitation system
3. `videoCallRoutes.js` - Video room management

---

## Quick Start

### 1. Choose Video API
I recommend **Daily.co** for ease of use or **Jitsi** for unlimited free use.

### 2. Install Dependencies
```bash
# For Daily.co
cd frontend
npm install @daily-co/daily-js @daily-co/daily-react

# For email
cd backend
npm install nodemailer
```

### 3. Environment Variables
Add to `backend/.env`:
```env
# Daily.co (if using)
DAILY_API_KEY=your_daily_api_key
DAILY_DOMAIN=your_domain.daily.co

# Or Jitsi (free, no key needed)
JITSI_DOMAIN=meet.jit.si

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## Next Steps

1. Choose which video call API you want to use
2. I'll implement the full integration
3. Set up email service (Gmail, SendGrid, etc.)
4. Deploy and test

Would you like me to implement any specific API?
