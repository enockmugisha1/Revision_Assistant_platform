# 🎓 Revision Assistant Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://revision-assistant-platform-enock-mugishas-projects.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)

> A comprehensive AI-powered learning platform designed to transform the educational experience through personalization, collaboration, and intelligent progress tracking.

**🌐 Live Platform:** [https://revision-assistant-platform-enock-mugishas-projects.vercel.app/](https://revision-assistant-platform-enock-mugishas-projects.vercel.app/)

---

## 📺 Demo Video

**Watch the platform in action!** 🎥

The demo video showcasing all features is available in the project repository. To view:
- Check the `/demo` folder in the repository
- Or visit the [Releases](https://github.com/your-repo/releases) section for the latest demo video
- Platform walkthrough video demonstrates all features including messaging, task management, AI quizzes, and social collaboration

---

## 🌟 Key Features

### ✅ Fully Functional Features

#### 🔐 **Authentication & Security**
- Secure JWT-based authentication with refresh tokens
- Password strength validation
- Email verification system
- Password reset functionality
- Role-based access control (Student/Teacher/Admin)

#### 📊 **Interactive Dashboard**
- Real-time study statistics and progress tracking
- Personalized AI recommendations
- Task calendar integration with upcoming deadlines
- Study streak tracking
- Visual progress charts and analytics
- Quick access to all platform features

#### 💬 **Social Learning & Messaging**
- **WhatsApp-style Group Chat**: Real-time messaging with typing indicators
- **Private Messaging**: One-on-one conversations with online status
- **Study Groups**: Create and join collaborative learning spaces
- **Member Management**: Invite members via email
- **Message Notifications**: Unread message badges and alerts
- **User Presence**: See who's online in real-time

#### 📹 **Video Collaboration**
- **FREE Unlimited Video Calls** powered by Jitsi Meet
- Support for up to 75 participants
- Screen sharing capabilities
- Integrated directly in study groups
- One-on-one video calls
- No additional setup required

#### ✅ **Task Management**
- **Dedicated Task Calendar** with visual timeline
- Create, edit, and delete tasks
- Priority levels and categories
- Due date reminders
- Task counter badges
- Integration with dashboard
- Color-coded task organization

#### 🤖 **AI-Powered Features**
- **Intelligent Quiz Generation** using GROQ AI
- Adaptive learning recommendations
- Personalized study suggestions
- AI-powered content analysis
- Smart difficulty adjustment

#### 📚 **Educational Resources**
- Comprehensive resource library
- Subject-based categorization
- Search and filter functionality
- Difficulty level filtering (Beginner, Intermediate, Advanced)
- Integration with external learning platforms
- RapidAPI Balancing Studies integration

#### 🎨 **Modern UI/UX**
- Responsive mobile-first design
- Dark mode support
- Smooth animations with Framer Motion
- Accessible components (WCAG compliant)
- Professional gradient designs
- Toast notifications for feedback

---

## 🛠️ Tech Stack

### Frontend Technologies
- **React 18** with TypeScript for type safety and modern development
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations and transitions
- **React Router Dom v6** for client-side routing
- **Axios** for API communication with interceptors
- **React Hook Form** with Yup validation
- **Headless UI** for accessible components
- **React Hot Toast** for notifications
- **Hero Icons** for consistent iconography
- **Socket.IO Client** for real-time communication

### Backend Technologies
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM for data persistence
- **Socket.IO** for real-time bidirectional communication
- **JWT** for secure authentication and authorization
- **bcryptjs** for password hashing
- **Nodemailer** for email services and notifications
- **Express Rate Limit** for API protection
- **CORS** for cross-origin resource sharing
- **Helmet** for security headers

### AI & Third-Party Integrations
- **GROQ API** for AI-powered quiz generation
- **Jitsi Meet** for video conferencing (FREE & unlimited)
- **RapidAPI** for external learning resources
- **Balancing Studies API** for educational content

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas) - [Setup Guide](https://www.mongodb.com/)
- **npm** or **yarn** package manager
- **Git** for version control

### 🔧 Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/revision_assistant
   # For MongoDB Atlas (cloud):
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/revision_assistant
   
   # JWT Secrets (generate strong random strings)
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   JWT_REFRESH_SECRET=your-refresh-token-secret-minimum-32-characters
   JWT_EXPIRE=24h
   JWT_REFRESH_EXPIRE=7d
   
   # Email Configuration (for Gmail)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   EMAIL_FROM=noreply@revisionassistant.com
   
   # AI Integration (GROQ API)
   GROQ_API_KEY=your-groq-api-key-here
   
   # RapidAPI (Educational Resources)
   RAPIDAPI_KEY=your-rapidapi-key
   RAPIDAPI_HOST=balancing-studies.p.rapidapi.com
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   
   # Socket.IO Configuration
   SOCKET_CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The backend will be available at **`http://localhost:5000`**

### 🎨 Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (if needed):**
   ```bash
   # Create .env.local file
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at **`http://localhost:3000`**

### 🎉 First-Time Setup

1. **Access the platform:** Open `http://localhost:3000` in your browser
2. **Create an account:** Click "Sign Up" and create your first user account
3. **Choose your role:** Select Student, Teacher, or Admin
4. **Explore features:** 
   - Visit the Dashboard for an overview
   - Create a study group and invite members
   - Try the AI quiz generator
   - Set up tasks in the Task Calendar
   - Start messaging with other users

---

## 📱 Feature Breakdown

### 🏠 Dashboard
The unified dashboard provides a comprehensive overview of your learning journey:
- **Study Statistics**: Track daily/weekly study time and maintain streaks
- **Recent Activity Timeline**: View your learning activities at a glance
- **Upcoming Tasks**: See deadlines and scheduled quizzes with priority indicators
- **AI Recommendations**: Get personalized study suggestions based on performance
- **Progress Visualization**: Interactive charts showing your improvement
- **Quick Actions**: Fast access to all platform features
- **Task Counter Badges**: Real-time notification of pending tasks

### 💬 Messaging & Social Features
Connect and collaborate with other learners:

#### **Group Chat (WhatsApp-Style)**
- Real-time messaging with Socket.IO technology
- Typing indicators showing who's currently typing
- Message bubbles with sender identification
- Timestamps on all messages
- User avatars with initials
- Member sidebar showing all group participants
- Auto-scroll to latest messages
- Video call button in chat header

#### **Private Messaging**
- One-on-one conversations with other users
- Unread message badges
- Online/offline status indicators
- Search functionality for conversations
- Video call integration for private calls
- Email invitation system

#### **Study Groups**
- Create groups by subject and difficulty level
- Search and filter groups
- Member management and invitations
- Three quick action buttons per group (Chat, Video, Invite)
- Group information and member count display

### 📹 Video Collaboration
Powered by Jitsi Meet for seamless video communication:
- **FREE and UNLIMITED** video calls
- Support for up to 75 participants per call
- Screen sharing for presentations and collaboration
- Built-in audio/video controls
- Full-screen mode support
- Recording capability
- Integrated chat within video calls
- No additional API keys required
- Works immediately out of the box

### ✅ Task Management
Comprehensive task calendar for academic planning:
- **Visual Calendar Interface**: Monthly, weekly, and daily views
- **Task Creation**: Set title, description, due date, and priority
- **Color-Coded Categories**: Subject-based color organization
- **Priority Levels**: High, medium, and low priority indicators
- **Task Counter**: Real-time count of pending tasks
- **Dashboard Integration**: Upcoming tasks visible on main dashboard
- **Quick Edit/Delete**: Manage tasks efficiently
- **Deadline Reminders**: Visual indicators for approaching deadlines

### 🤖 AI-Powered Learning
Intelligent features to enhance your study experience:
- **Adaptive Quiz Generation**: AI creates quizzes tailored to your level
- **Personalized Recommendations**: Study suggestions based on your patterns
- **Smart Difficulty Adjustment**: Content adapts to your performance
- **Learning Analytics**: AI analyzes your progress and identifies weak areas
- **Content Summarization**: Quick summaries of learning materials
- **Study Time Optimization**: AI recommends best study times

### 📚 Educational Resources
Comprehensive library of learning materials:
- **Subject Categorization**: Organized by academic subjects
- **Difficulty Filtering**: Beginner, Intermediate, Advanced levels
- **Search Functionality**: Find resources quickly
- **External Integration**: Access to Balancing Studies API
- **Resource Recommendations**: AI-suggested materials
- **Bookmarking System**: Save favorite resources

---

## 🎨 Design Philosophy

Our platform is built on core principles that prioritize user experience:

- **User-Centric Design**: Every feature is designed with the learner's needs at the forefront
- **Accessibility First**: WCAG compliant components ensure inclusive learning for all
- **Performance Optimized**: Fast loading times and smooth interactions across all devices
- **Scalable Architecture**: Built to grow seamlessly with increasing user needs
- **Modern Aesthetics**: Clean, professional interface with thoughtful color schemes
- **Intuitive Navigation**: Clear pathways to all features minimize learning curve
- **Responsive Layout**: Perfect experience on desktop, tablet, and mobile devices
- **Dark Mode Support**: Reduce eye strain during extended study sessions

---

## 🔧 Development

### Available Scripts

#### Backend Scripts
```bash
npm start              # Start production server
npm run dev           # Start development server with hot reload (nodemon)
npm test              # Run test suite with Jest
npm run lint          # Check code style with ESLint
npm run lint:fix      # Fix linting issues automatically
```

#### Frontend Scripts
```bash
npm run dev           # Start development server with Vite
npm run build         # Build for production (optimized bundle)
npm run preview       # Preview production build locally
npm run lint          # Check code style with ESLint
npm run type-check    # Run TypeScript type checking
```

### Project Structure

```
Revision_Assistant_platform/
├── backend/
│   ├── src/
│   │   ├── config/              # Database and app configuration
│   │   │   ├── database.js      # MongoDB connection setup
│   │   │   └── socketio.js      # Socket.IO configuration
│   │   ├── controllers/         # Request handlers and business logic
│   │   │   ├── authController.js
│   │   │   ├── quizController.js
│   │   │   ├── taskController.js
│   │   │   └── messageController.js
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.js          # JWT authentication
│   │   │   ├── errorHandler.js  # Error handling
│   │   │   └── validation.js    # Request validation
│   │   ├── models/              # Mongoose database models
│   │   │   ├── User.js
│   │   │   ├── StudyGroup.js
│   │   │   ├── Task.js
│   │   │   └── Message.js
│   │   ├── routes/              # API route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── studyGroupRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   └── invitationRoutes.js
│   │   ├── services/            # Business logic services
│   │   │   ├── aiService.js     # GROQ AI integration
│   │   │   ├── emailService.js  # Email notifications
│   │   │   └── socketService.js # Real-time events
│   │   ├── utils/               # Helper functions
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   └── server.js            # Main server entry point
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── dashboard/       # Dashboard components
│   │   │   ├── study-groups/    # Study group features
│   │   │   ├── messaging/       # Chat and messaging
│   │   │   ├── tasks/           # Task management
│   │   │   ├── video/           # Video call components
│   │   │   └── shared/          # Reusable components
│   │   ├── contexts/            # React context providers
│   │   │   ├── AuthContext.tsx
│   │   │   ├── SocketContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── services/            # API service functions
│   │   │   ├── api.ts           # Axios configuration
│   │   │   ├── authService.ts
│   │   │   ├── taskService.ts
│   │   │   └── messageService.ts
│   │   ├── types/               # TypeScript type definitions
│   │   │   ├── auth.types.ts
│   │   │   ├── task.types.ts
│   │   │   └── message.types.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useSocket.ts
│   │   ├── App.tsx              # Main app component
│   │   └── main.tsx             # Application entry point
│   ├── public/                  # Static assets
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── tsconfig.json            # TypeScript configuration
│   └── vite.config.ts           # Vite configuration
├── docs/                        # Additional documentation
├── tests/                       # Test files (if applicable)
└── README.md                    # This file
```

---

## 🔗 API Integration Guide

### RapidAPI - Balancing Studies Integration

The platform integrates with external educational resources through RapidAPI:

**Backend Proxy Endpoint:**
```
GET /api/resources/balancing-studies
```

**Query Parameters:**
- `path` (optional): Appended to the upstream URL (e.g., `topics`, `categories/math`)
- Additional query params are forwarded (e.g., `subject=math&level=beginner`)

**Authentication:** Requires Bearer token. Backend uses `RAPIDAPI_KEY` from environment variables.

**Frontend Usage Example:**
```typescript
import { fetchBalancingStudies } from '@/services/balancingStudiesService';

// Fetch math topics for beginners
const data = await fetchBalancingStudies({ 
  path: 'topics', 
  subject: 'math',
  level: 'beginner'
});
```

### Socket.IO Events

The platform uses Socket.IO for real-time communication:

#### Study Group Chat Events
```javascript
'study-group:join'      // Join a group chat room
'study-group:leave'     // Leave a group chat room
'chat:message'          // Send a message to the group
'chat:new-message'      // Receive a new message
'typing:start'          // User starts typing notification
'typing:stop'           // User stops typing notification
```

#### Private Messaging Events
```javascript
'private-message:send'  // Send a private message
'private-message:new'   // Receive a private message
'message:read'          // Mark message as read
'user:online'           // User online status update
'user:offline'          // User offline status update
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve the platform:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Revision_Assistant_platform.git
   cd Revision_Assistant_platform
   ```

3. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m 'Add some amazing feature'
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request** on the original repository

### Development Guidelines

- **Code Style**: Follow TypeScript and ES6+ best practices
- **Commit Messages**: Write clear, descriptive commit messages
- **Testing**: Include tests for new features when applicable
- **Documentation**: Update README and code comments as needed
- **Code Review**: Be open to feedback and suggestions
- **Issue First**: For major changes, open an issue first to discuss

### Areas for Contribution

- 🐛 Bug fixes and issue resolution
- ✨ New feature implementation
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🌍 Internationalization (i18n)
- 🧪 Test coverage expansion
- ⚡ Performance optimizations

---

## 🎯 Roadmap & Future Enhancements

### Phase 1 ✅ (Completed)
- [x] Secure authentication system with JWT
- [x] Role-based dashboards (Student/Teacher/Admin)
- [x] Responsive mobile-first design
- [x] Real-time infrastructure with Socket.IO
- [x] WhatsApp-style group chat
- [x] Video collaboration with Jitsi Meet
- [x] Task calendar and management
- [x] AI-powered quiz generation
- [x] Educational resources integration

### Phase 2 🚧 (In Progress)
- [ ] Advanced analytics and reporting
- [ ] Peer tutoring marketplace
- [ ] Live study sessions with breakout rooms
- [ ] Gamification (badges, points, leaderboards)
- [ ] Mobile application (React Native)
- [ ] File sharing in group chats
- [ ] Voice messages
- [ ] Message reactions and threading

### Phase 3 🔮 (Planned)
- [ ] AI-powered study planning and recommendations
- [ ] Integration with external learning platforms (Coursera, Udemy)
- [ ] Virtual whiteboard for collaborative learning
- [ ] Spaced repetition flashcard system
- [ ] Study buddy matching algorithm
- [ ] Parent/guardian monitoring dashboard
- [ ] Offline mode capabilities
- [ ] Multi-language support (i18n)

---

## 🆘 Troubleshooting & Support

### Common Issues

#### Backend Connection Issues
```bash
# Ensure MongoDB is running
sudo systemctl status mongodb
# or
mongod --version

# Check if backend server is running
curl http://localhost:5000/api/health
```

#### Frontend Not Loading
```bash
# Clear cache and reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Socket.IO Connection Failed
- Verify both backend and frontend are running
- Check CORS configuration in backend
- Ensure firewall allows connections on ports 3000 and 5000

#### Video Calls Not Working
- Allow camera and microphone permissions in browser
- Use Chrome or Firefox for best compatibility
- Check internet connection stability
- Verify Jitsi Meet is accessible

### Getting Help

If you encounter issues or have questions:

1. **Check Documentation**: Review this README and other docs in the `/docs` folder
2. **Search Issues**: Look through [existing issues](https://github.com/your-repo/issues) on GitHub
3. **Create New Issue**: If your problem is unique, open a new issue with:
   - Detailed description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Your environment (OS, Node version, browser)

### Contact & Support

**Developer:** Enock Mugisha

📧 **Email:** [e.mugisha4@alustudent.com](mailto:e.mugisha4@alustudent.com)

📱 **Phone:** +250 793 214 141

🌐 **Live Platform:** [https://revision-assistant-platform-enock-mugishas-projects.vercel.app/](https://revision-assistant-platform-enock-mugishas-projects.vercel.app/)

💼 **GitHub:** [View Repository](https://github.com/your-username/Revision_Assistant_platform)

**Response Time:** Typically within 24-48 hours

---

## 📄 License

This project is licensed under the **MIT License**.

### What this means:
- ✅ Free to use for personal and commercial projects
- ✅ Modify and distribute as needed
- ✅ Include in proprietary software
- ⚠️ Must include original license and copyright notice
- ⚠️ No warranty provided

See the [LICENSE](LICENSE) file for complete details.

---

## 🙏 Acknowledgments

### Special Thanks To:

- **Open Source Community** - For amazing tools and libraries
- **ALU (African Leadership University)** - For educational support
- **React Team** - For the incredible React framework
- **MongoDB Team** - For the robust database solution
- **Jitsi Team** - For free video conferencing
- **GROQ** - For AI capabilities
- **Contributors** - Everyone who has contributed to this project

### Technologies & Libraries Used:

Built with love using:
- React, TypeScript, Tailwind CSS
- Node.js, Express, MongoDB
- Socket.IO, Jitsi Meet, GROQ AI
- And many more amazing open-source projects

### Inspired By:

The need for accessible, collaborative, and intelligent learning platforms that empower students worldwide.

---

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/your-username/Revision_Assistant_platform)
![GitHub issues](https://img.shields.io/github/issues/your-username/Revision_Assistant_platform)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/Revision_Assistant_platform)

**Current Version:** 2.0.0

**Status:** ✅ Production Ready

**Last Updated:** November 2024

---

## 🌟 Show Your Support

If you find this project helpful, please consider:

- ⭐ **Starring the repository** on GitHub
- 🐛 **Reporting bugs** to help improve the platform
- 💡 **Suggesting features** for future development
- 📢 **Sharing** with others who might benefit
- 🤝 **Contributing** code or documentation

---

## 📚 Additional Resources

### Documentation
- [API Documentation](docs/API.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

### Tutorials & Guides
- [Setting Up Development Environment](docs/SETUP.md)
- [Creating Your First Study Group](docs/STUDY_GROUPS.md)
- [Using the AI Quiz Generator](docs/AI_QUIZZES.md)
- [Task Management Best Practices](docs/TASKS.md)

### Demo & Screenshots
- Watch the full demo video in the `/demo` folder
- View screenshots in the `/screenshots` folder
- Try the live platform at [https://revision-assistant-platform-enock-mugishas-projects.vercel.app/](https://revision-assistant-platform-enock-mugishas-projects.vercel.app/)

---

<div align="center">

### 💙 Made with love for learners everywhere 💙

**Transform your learning experience today!**

[🚀 Visit Live Platform](https://revision-assistant-platform-enock-mugishas-projects.vercel.app/) • [📧 Contact Developer](mailto:e.mugisha4@alustudent.com) • [⭐ Star on GitHub](https://github.com/your-username/Revision_Assistant_platform)

---

© 2024 Revision Assistant Platform. All rights reserved.

</div>
