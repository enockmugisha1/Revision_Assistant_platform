#!/bin/bash

echo "🚀 Setting Up Role-Based Features & Video Calls"
echo "==============================================="
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Step 1: Installing backend dependencies..."
cd backend
npm install nodemailer --save
echo "✅ Backend dependencies installed"
echo ""

echo "📝 Step 2: Setting up environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating template..."
    cat > .env << 'EOF'
# Existing variables (don't change these)
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/revision_assistant
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key

# NEW: Email Configuration (for invitations)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# NEW: Frontend URL
FRONTEND_URL=http://localhost:3000

# OPTIONAL: Daily.co (only if using Daily instead of Jitsi)
# DAILY_API_KEY=your_daily_api_key
# DAILY_DOMAIN=your-domain.daily.co
EOF
    echo "✅ .env template created. Please update with your credentials."
else
    echo "✅ .env file already exists"
fi
echo ""

cd ..

echo "⚙️  Step 3: Checking frontend setup..."
cd frontend

# Check if react-router-dom is installed
if ! npm list react-router-dom &> /dev/null; then
    echo "⚠️  react-router-dom not found, installing..."
    npm install react-router-dom
fi

echo "✅ Frontend dependencies checked"
cd ..
echo ""

echo "📋 Step 4: Creating route configuration file..."
cat > frontend/src/routes-config.txt << 'EOF'
// Add these routes to your App.tsx or router configuration:

import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { VideoCallRoom } from './components/video/VideoCallRoom';
import { PrivateMessaging } from './components/messaging/PrivateMessaging';
import { EnhancedStudyGroupsPage } from './components/study-groups/EnhancedStudyGroupsPage';

// In your Routes:
<Route 
  path="/dashboard" 
  element={
    user?.role === 'teacher' || user?.role === 'admin'
      ? <TeacherDashboard /> 
      : <StudentDashboard />
  } 
/>
<Route path="/video-call/:roomId" element={<VideoCallRoom />} />
<Route path="/messages" element={<PrivateMessaging />} />
<Route path="/study-groups" element={<EnhancedStudyGroupsPage />} />

// Optional: Accept invitation route
<Route path="/accept-invite/:token" element={<AcceptInvitation />} />
EOF

echo "✅ Route configuration saved to frontend/src/routes-config.txt"
echo ""

echo "🎨 Step 5: Creating quick test page..."
cat > test-new-features.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test New Features</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .card {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .feature {
            margin: 15px 0;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #4CAF50;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 5px;
        }
        .btn:hover {
            background: #45a049;
        }
        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .status.done { background: #4CAF50; color: white; }
        .status.pending { background: #FFC107; color: black; }
    </style>
</head>
<body>
    <h1>🎉 New Features Implementation Status</h1>
    
    <div class="card">
        <h2>✅ Implemented Features</h2>
        
        <div class="feature">
            <h3>1. Role-Based Dashboards <span class="status done">DONE</span></h3>
            <p><strong>Teacher Dashboard:</strong> Class overview, student analytics, grading queue</p>
            <p><strong>Student Dashboard:</strong> Study progress, upcoming quizzes, goals</p>
            <a href="http://localhost:3000/dashboard" class="btn">Test Dashboard</a>
        </div>
        
        <div class="feature">
            <h3>2. Video Call Integration <span class="status done">DONE</span></h3>
            <p><strong>Providers:</strong> Jitsi Meet (default), Whereby, Daily.co</p>
            <p><strong>Features:</strong> Screen share, mute, video toggle, invite links</p>
            <a href="http://localhost:3000/video-call/test-room-123" class="btn">Test Video Call</a>
        </div>
        
        <div class="feature">
            <h3>3. Private Messaging <span class="status done">DONE</span></h3>
            <p><strong>Features:</strong> 1-on-1 chat, email invites, video calls from chat</p>
            <p><strong>Real-time:</strong> WebSocket powered messaging</p>
            <a href="http://localhost:3000/messages" class="btn">Test Messaging</a>
        </div>
        
        <div class="feature">
            <h3>4. Enhanced Study Groups <span class="status done">DONE</span></h3>
            <p><strong>New:</strong> Video call buttons, email invites, better UI</p>
            <a href="http://localhost:3000/study-groups" class="btn">Test Study Groups</a>
        </div>
    </div>
    
    <div class="card">
        <h2>📝 Setup Checklist</h2>
        <p><input type="checkbox"> Install nodemailer: <code>cd backend && npm install nodemailer</code></p>
        <p><input type="checkbox"> Configure email in <code>backend/.env</code></p>
        <p><input type="checkbox"> Add routes to your router (see routes-config.txt)</p>
        <p><input type="checkbox"> Start backend: <code>cd backend && npm start</code></p>
        <p><input type="checkbox"> Start frontend: <code>cd frontend && npm start</code></p>
        <p><input type="checkbox"> Test video call in study groups</p>
        <p><input type="checkbox"> Test private messaging</p>
        <p><input type="checkbox"> Test role switching (teacher vs student)</p>
    </div>
    
    <div class="card">
        <h2>🎥 Video Provider Options</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f0f0f0;">
                <th style="padding: 10px; text-align: left;">Provider</th>
                <th style="padding: 10px; text-align: left;">Free Tier</th>
                <th style="padding: 10px; text-align: left;">Setup</th>
                <th style="padding: 10px; text-align: left;">Status</th>
            </tr>
            <tr>
                <td style="padding: 10px;"><strong>Jitsi Meet</strong></td>
                <td style="padding: 10px;">Unlimited</td>
                <td style="padding: 10px;">None needed</td>
                <td style="padding: 10px;"><span class="status done">DEFAULT</span></td>
            </tr>
            <tr>
                <td style="padding: 10px;"><strong>Whereby</strong></td>
                <td style="padding: 10px;">Up to 4 users</td>
                <td style="padding: 10px;">None needed</td>
                <td style="padding: 10px;"><span class="status done">READY</span></td>
            </tr>
            <tr>
                <td style="padding: 10px;"><strong>Daily.co</strong></td>
                <td style="padding: 10px;">1000 min/month</td>
                <td style="padding: 10px;">API key needed</td>
                <td style="padding: 10px;"><span class="status pending">OPTIONAL</span></td>
            </tr>
        </table>
    </div>
    
    <div class="card">
        <h2>📚 Documentation</h2>
        <ul>
            <li>📄 <a href="IMPLEMENTATION_COMPLETE.md">Complete Implementation Guide</a></li>
            <li>📄 <a href="ROLE_BASED_FEATURES.md">Role-Based Features Details</a></li>
            <li>📄 <a href="frontend/src/routes-config.txt">Route Configuration</a></li>
        </ul>
    </div>
    
    <div class="card" style="background: #E3F2FD; border-left: 4px solid #2196F3;">
        <h2>💡 Quick Start</h2>
        <ol>
            <li>Configure email in <code>backend/.env</code> (optional but recommended)</li>
            <li>Add routes from <code>routes-config.txt</code> to your App.tsx</li>
            <li>Start both servers</li>
            <li>Navigate to <code>/dashboard</code> to see role-based UI</li>
            <li>Go to <code>/study-groups</code> and click video icon to test calls</li>
            <li>Try <code>/messages</code> for private messaging</li>
        </ol>
    </div>
</body>
</html>
EOF

echo "✅ Test page created: test-new-features.html"
echo ""

echo "════════════════════════════════════════════"
echo "✨ Setup Complete!"
echo "════════════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure email (optional):"
echo "   - Edit backend/.env"
echo "   - Add your Gmail credentials"
echo ""
echo "2. Add routes to your frontend:"
echo "   - Check: frontend/src/routes-config.txt"
echo "   - Add routes to App.tsx"
echo ""
echo "3. Start servers:"
echo "   cd backend && npm start"
echo "   cd frontend && npm start"
echo ""
echo "4. Open test page:"
echo "   Open: test-new-features.html in browser"
echo ""
echo "📖 Full documentation: IMPLEMENTATION_COMPLETE.md"
echo ""
echo "🎉 All new features are ready to use!"
echo ""

