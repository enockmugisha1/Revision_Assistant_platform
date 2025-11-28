# 🚀 Complete Deployment Guide

## Overview
This guide covers deploying the Revision Assistant Platform:
- **Backend** → Render (Node.js/Express API)
- **Frontend** → Vercel (React/Vite)

---

## 📋 Prerequisites

### Required Accounts
1. **GitHub Account** (for code repository)
2. **Render Account** - [render.com](https://render.com) (Backend hosting - FREE tier available)
3. **Vercel Account** - [vercel.com](https://vercel.com) (Frontend hosting - FREE tier available)
4. **MongoDB Atlas** - [mongodb.com/atlas](https://mongodb.com/atlas) (Database - FREE tier available)

### Required API Keys
- **GROQ API Key** - [console.groq.com](https://console.groq.com) (AI features)
- **Google Search API Key** (Optional - for educational resources)
- **Cloudinary Account** (Optional - for image uploads)
- **SMTP Credentials** (Optional - for email notifications)

---

## 🗄️ Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up or log in
3. Create a **FREE cluster** (M0 Sandbox)
4. Choose your preferred cloud provider and region
5. Click **"Create Cluster"**

### Step 2: Configure Database Access
1. In the **Security** section, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username and password (save these!)
5. Set privileges to **"Read and write to any database"**
6. Click **"Add User"**

### Step 3: Configure Network Access
1. Go to **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add specific IPs for better security
4. Click **"Confirm"**

### Step 4: Get Connection String
1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your actual credentials
5. Add database name after `.net/`: 
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/revision_assistant?retryWrites=true&w=majority
   ```

---

## 🖥️ Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend for Render
1. Ensure your `backend/package.json` has the correct start script:
   ```json
   "scripts": {
     "start": "node src/server.js"
   }
   ```

2. Make sure your backend listens on `process.env.PORT`:
   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

### Step 2: Push Code to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Render

#### 3.1: Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

#### 3.2: Configure Service
- **Name**: `revision-assistant-backend` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (or upgrade as needed)

#### 3.3: Add Environment Variables
Click **"Add Environment Variable"** and add the following:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `5000` | Render auto-assigns, but good to set |
| `MONGODB_URI` | `your-mongodb-atlas-connection-string` | From Part 1 |
| `JWT_SECRET` | `your-super-secret-jwt-key-here-min-32-chars` | Generate strong random string |
| `JWT_REFRESH_SECRET` | `another-super-secret-jwt-refresh-key-here` | Different from JWT_SECRET |
| `JWT_EXPIRES_IN` | `15m` | Token expiry |
| `JWT_REFRESH_EXPIRES_IN` | `30d` | Refresh token expiry |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Your Vercel URL (add after frontend deploy) |
| `GROQ_API_KEY` | `your-groq-api-key` | From console.groq.com |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Or your preferred model |
| `RATE_LIMIT_WINDOW` | `900000` | 15 minutes |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

#### Optional Environment Variables (add if needed):
```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM="Revision Assistant <no-reply@yourdomain.com>"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Search API (for educational resources)
GOOGLE_SEARCH_API_KEY=your-google-api-key
GOOGLE_YOUTUBE_CX=your-youtube-search-engine-id
GOOGLE_NOTES_CX=your-notes-search-engine-id

# OpenAI (if using instead of GROQ)
OPENAI_API_KEY=your-openai-api-key
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://revision-assistant-backend.onrender.com`
4. **Save this URL** - you'll need it for frontend configuration

### Step 5: Update CORS Settings
After getting your Vercel frontend URL (from Part 3), update the `FRONTEND_URL` environment variable:
1. Go to your Render service
2. Click **"Environment"** tab
3. Update `FRONTEND_URL` with your actual Vercel URL
4. Service will auto-redeploy

---

## 🎨 Part 3: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Vercel

#### 1.1: Create/Update `.env.production` file
Create `frontend/.env.production`:
```bash
# API URL from Render deployment
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

#### 1.2: Ensure Build Configuration
Your `frontend/package.json` should have:
```json
"scripts": {
  "build": "vite build",
  "preview": "vite preview"
}
```

#### 1.3: Create `vercel.json` (Optional but Recommended)
Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended for beginners)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in (use GitHub account for easy integration)

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select your GitHub repository
   - Click **"Import"**

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. **Add Environment Variables**
   Click **"Environment Variables"** and add:
   
   | Key | Value |
   |-----|-------|
   | `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` |
   | `VITE_SOCKET_URL` | `https://your-backend.onrender.com` |

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-5 minutes for build and deployment
   - You'll get a URL like: `https://your-app.vercel.app`

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? revision-assistant-frontend
# - Directory? ./
# - Override settings? No

# For production deployment
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## 🔄 Part 4: Final Configuration & Testing

### Step 1: Update Backend with Frontend URL
1. Go to your Render service
2. Navigate to **"Environment"** tab
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. If you have multiple URLs (preview deployments):
   ```
   FRONTEND_URLS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
   ```
5. Save and wait for automatic redeployment

### Step 2: Test the Deployment

#### Test Backend API
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Should return: {"status": "ok", "message": "Server is running"}
```

#### Test Frontend
1. Visit your Vercel URL
2. Try to register/login
3. Test main features:
   - Dashboard loads
   - AI quiz generation works
   - Educational resources search works
   - Real-time features (if any) work

### Step 3: Monitor Deployments

#### Render Monitoring
- View logs: Render Dashboard → Your Service → **"Logs"**
- Check metrics: **"Metrics"** tab
- Set up alerts: **"Alerts"** (upgrade required)

#### Vercel Monitoring
- View deployments: Vercel Dashboard → Your Project → **"Deployments"**
- Check analytics: **"Analytics"** tab
- View logs: Click on any deployment → **"Logs"**

---

## 🔧 Environment Variables Reference

### Backend Environment Variables (Render)

#### Required Variables
```bash
# Core Configuration
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/revision_assistant

# JWT Configuration
JWT_SECRET=your-very-long-random-secret-at-least-32-characters
JWT_REFRESH_SECRET=another-very-long-random-secret-different-from-above
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
FRONTEND_URL=https://your-app.vercel.app

# AI Configuration
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

#### Optional Variables
```bash
# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="Revision Assistant <no-reply@example.com>"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Search API (for educational resources)
GOOGLE_SEARCH_API_KEY=your-google-api-key
GOOGLE_YOUTUBE_CX=your-youtube-search-cx
GOOGLE_NOTES_CX=your-notes-search-cx

# OpenAI (alternative to GROQ)
OPENAI_API_KEY=sk-your-openai-key
```

### Frontend Environment Variables (Vercel)

```bash
# API Configuration
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

---

## 🔐 Getting API Keys

### 1. GROQ API Key (Required for AI Features)
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up with GitHub/Google
3. Go to **"API Keys"**
4. Click **"Create API Key"**
5. Copy and save the key (starts with `gsk_`)

### 2. MongoDB Atlas (Required for Database)
- See **Part 1: Database Setup** above

### 3. Google Search API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **"Custom Search API"**
4. Create credentials → **API Key**
5. Create search engines at [Programmable Search Engine](https://programmablesearchengine.google.com/)

### 4. Cloudinary (Optional for Image Uploads)
1. Visit [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to **Dashboard**
4. Copy: Cloud Name, API Key, API Secret

### 5. Gmail SMTP (Optional for Email)
1. Enable 2-Factor Authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate app password for "Mail"
4. Use this password in `SMTP_PASS`

---

## 🚨 Troubleshooting

### Backend Issues

#### "Application failed to start"
- **Check logs** in Render dashboard
- Verify `start` script in package.json
- Ensure all required environment variables are set
- Check MongoDB connection string is correct

#### "MongoDB connection failed"
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check connection string format
- Ensure username/password don't have special characters (URL encode if needed)
- Test connection string locally first

#### "CORS errors"
- Update `FRONTEND_URL` environment variable with correct Vercel URL
- Include both production and preview URLs if needed
- Clear browser cache

#### "API responds slowly"
- Render free tier spins down after inactivity (cold start ~30 seconds)
- Consider upgrading to paid tier for always-on
- Or implement a keep-alive ping service

### Frontend Issues

#### "Build failed"
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`
- Check for TypeScript errors

#### "API calls failing"
- Verify `VITE_API_BASE_URL` is correct
- Check browser console for CORS errors
- Ensure backend is running (visit backend URL directly)
- Check network tab for actual error responses

#### "Environment variables not working"
- Vite requires `VITE_` prefix for client-side variables
- Redeploy after changing environment variables
- Clear browser cache

#### "404 on page refresh"
- Ensure `vercel.json` has correct rewrites configuration
- See **Part 3, Step 1.3** above

### Database Issues

#### "Database queries timing out"
- Check MongoDB Atlas cluster status
- Verify network access settings
- Check if cluster is paused (free tier auto-pauses after inactivity)
- Review query performance and add indexes if needed

---

## 🔄 Continuous Deployment

### Automatic Deployments

#### Render (Backend)
- Automatically deploys on every push to `main` branch
- Configure in: **Settings** → **Build & Deploy**
- Can set up preview environments for branches

#### Vercel (Frontend)
- Automatically deploys on every push
- Creates preview deployments for pull requests
- Production deployment on push to `main`
- Configure in: **Settings** → **Git**

### Manual Deployments

#### Render
```bash
# Via Dashboard
Render Dashboard → Your Service → "Manual Deploy" → "Deploy latest commit"

# Via API (requires API key)
curl -X POST https://api.render.com/v1/services/YOUR_SERVICE_ID/deploys \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Vercel
```bash
# Via CLI
cd frontend
vercel --prod

# Via Dashboard
Vercel Dashboard → Your Project → Deployments → "Redeploy"
```

---

## 📊 Monitoring & Maintenance

### Health Checks

#### Backend Health Endpoint
Create `backend/src/routes/health.js`:
```javascript
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  res.status(200).json(health);
});

export default router;
```

### Logging

#### Backend Logging
- Render provides built-in logging
- Access via: Dashboard → Service → **Logs**
- Download logs for analysis
- Set up log retention (paid plans)

#### Frontend Logging
- Vercel provides runtime logs
- Access via: Dashboard → Project → Deployment → **Logs**
- Use Vercel Analytics for user insights

### Performance Monitoring

#### Free Tools
- **Render Metrics** (CPU, Memory, Response time)
- **Vercel Analytics** (Page views, Performance)
- **MongoDB Atlas Monitoring** (Cluster performance)

#### Recommended Tools
- **Sentry** (Error tracking) - Has free tier
- **LogRocket** (Session replay) - Has free tier
- **Google Analytics** (User analytics) - Free

---

## 💰 Cost Estimates

### Free Tier Limits

#### Render (Backend)
- **Free Plan**: 
  - 750 hours/month
  - Spins down after 15 minutes of inactivity
  - 512 MB RAM
  - Good for development/testing

#### Vercel (Frontend)
- **Hobby Plan** (Free):
  - 100 GB bandwidth/month
  - 100 builds/day
  - Unlimited projects
  - Perfect for personal projects

#### MongoDB Atlas (Database)
- **M0 (Free) Cluster**:
  - 512 MB storage
  - Shared RAM
  - Good for small applications
  - ~10,000 users capacity

### When to Upgrade

#### Upgrade Backend when:
- Users complain about slow load times (cold starts)
- Need more than 512 MB RAM
- Need guaranteed uptime
- **Cost**: ~$7/month for always-on starter instance

#### Upgrade Frontend when:
- Exceed 100 GB bandwidth
- Need team collaboration
- Need advanced analytics
- **Cost**: $20/month for Pro plan

#### Upgrade Database when:
- Exceed 512 MB storage
- Need dedicated resources
- Need backups
- **Cost**: ~$57/month for M10 (2GB RAM)

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files to Git
- ✅ Use strong, random JWT secrets (minimum 32 characters)
- ✅ Rotate API keys periodically
- ✅ Use different secrets for development and production

### 2. Database Security
- ✅ Use strong database passwords
- ✅ Enable MongoDB Atlas firewall rules
- ✅ Regular backups (Atlas M10+ tier)
- ✅ Implement rate limiting on auth endpoints

### 3. API Security
- ✅ Use HTTPS only (both Render and Vercel provide free SSL)
- ✅ Implement CORS properly
- ✅ Add helmet.js for security headers
- ✅ Validate all inputs
- ✅ Implement rate limiting

### 4. Authentication
- ✅ Use httpOnly cookies for tokens
- ✅ Implement refresh token rotation
- ✅ Add account lockout after failed attempts
- ✅ Implement password strength requirements

---

## 📝 Deployment Checklist

### Before Deployment
- [ ] Code pushed to GitHub
- [ ] All dependencies in `package.json`
- [ ] Environment variables documented
- [ ] Database created and configured
- [ ] API keys obtained
- [ ] CORS configured correctly
- [ ] Build tested locally (`npm run build`)

### During Deployment
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set on both platforms
- [ ] Database connected successfully
- [ ] URLs updated (frontend URL in backend, backend URL in frontend)

### After Deployment
- [ ] Test user registration/login
- [ ] Test main features (AI generation, resources, etc.)
- [ ] Check API responses
- [ ] Verify real-time features
- [ ] Monitor error logs
- [ ] Set up health check monitoring
- [ ] Configure custom domain (optional)
- [ ] Set up analytics (optional)

---

## 🆘 Support & Resources

### Official Documentation
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Vite Docs](https://vitejs.dev/)
- [Express Docs](https://expressjs.com/)

### Community Support
- [Render Community](https://community.render.com/)
- [Vercel Discord](https://vercel.com/discord)
- [MongoDB Community](https://www.mongodb.com/community/forums/)

### Quick Links
- [GROQ API Docs](https://console.groq.com/docs)
- [Google Search API](https://developers.google.com/custom-search)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

## 🎉 Success!

Your Revision Assistant Platform should now be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

### Next Steps
1. Share your app URL with users
2. Monitor usage and performance
3. Collect user feedback
4. Plan feature updates
5. Consider custom domain
6. Set up monitoring and alerts

---

## 📞 Quick Commands Reference

### Local Testing
```bash
# Test backend locally
cd backend
npm install
npm run dev

# Test frontend locally
cd frontend
npm install
npm run dev

# Test production build
npm run build
npm run preview
```

### Deployment Commands
```bash
# Deploy backend (via Render - auto-deploys on git push)
git add .
git commit -m "Update backend"
git push origin main

# Deploy frontend (via Vercel CLI)
cd frontend
vercel --prod

# Or via git (auto-deploys)
git add .
git commit -m "Update frontend"
git push origin main
```

### Monitoring Commands
```bash
# Check backend health
curl https://your-backend.onrender.com/api/health

# View Render logs
# (In Render Dashboard → Service → Logs)

# View Vercel logs
vercel logs your-app.vercel.app
```

---

**Made with ❤️ for Education**

Need help? Review the troubleshooting section or check the official documentation links above.
