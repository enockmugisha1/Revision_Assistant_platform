# 📸 Visual Deployment Guide - Step by Step

This guide provides detailed visual instructions for deploying your app.

---

## 🗄️ Step 1: MongoDB Atlas Setup

### 1.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub or email
3. Select "Free" tier

### 1.2 Create Cluster
**What you'll see:**
- Welcome screen with "Build a Database" button
- Click "Build a Database"
- Choose "M0 FREE" option
- Select cloud provider (AWS recommended)
- Choose region closest to you
- Cluster name: Keep default or name it "RevisionAssistant"
- Click "Create"

**Wait time:** 3-5 minutes for cluster creation

### 1.3 Security Setup

#### Database Access
**Navigate to:** Security → Database Access → Add New Database User
- **Authentication Method:** Password
- **Username:** `revision_admin` (or your choice)
- **Password:** Click "Autogenerate Secure Password" (SAVE THIS!)
- **Database User Privileges:** Read and write to any database
- Click "Add User"

#### Network Access
**Navigate to:** Security → Network Access → Add IP Address
- Click "Allow Access from Anywhere"
- IP Address: `0.0.0.0/0` (will be auto-filled)
- Click "Confirm"

> ⚠️ **Important:** For production, restrict to specific IPs for better security

### 1.4 Get Connection String
**Navigate to:** Database → Connect → Connect your application
- **Driver:** Node.js
- **Version:** 5.5 or later
- Copy the connection string (looks like):
  ```
  mongodb+srv://revision_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `<password>` with your actual password
- Add database name: `/revision_assistant` after `.net`

**Final format:**
```
mongodb+srv://revision_admin:YourPassword123@cluster0.xxxxx.mongodb.net/revision_assistant?retryWrites=true&w=majority
```

**✅ SAVE THIS CONNECTION STRING** - You'll need it for Render

---

## 🔑 Step 2: Get GROQ API Key

### 2.1 Create Account
1. Go to https://console.groq.com
2. Click "Sign Up" or "Get Started"
3. Sign up with Google/GitHub (easiest)

### 2.2 Create API Key
**What you'll see:**
- Dashboard with "API Keys" in sidebar
- Click "API Keys"
- Click "Create API Key"
- Name: "Revision Assistant Production"
- Click "Create"
- **Copy the key** (starts with `gsk_`)

> ⚠️ **Important:** Key is shown only once! Save it immediately.

**✅ SAVE THIS API KEY**

---

## 🖥️ Step 3: Deploy Backend to Render

### 3.1 Prepare GitHub Repository

**If not already done:**
```bash
# In your project root
cd /home/enock/Revision_Assistant_platform

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for deployment"

# Create repo on GitHub (via website)
# Then connect:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 3.2 Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended for easy integration)
4. Authorize Render to access your repositories

### 3.3 Create Web Service

**Dashboard → New → Web Service**

**What you'll see:**
- List of your GitHub repositories
- Click "Connect" next to your repository
- If repo not visible, click "Configure account" to grant access

### 3.4 Configure Service

**You'll see a form with these fields:**

#### Basic Settings
- **Name:** `revision-assistant-backend` (or your choice)
  - This will be part of your URL
- **Region:** Oregon (US West) or closest to you
- **Branch:** `main`
- **Root Directory:** `backend` ⚠️ **IMPORTANT**
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`

#### Instance Type
- Select **Free** (or upgrade as needed)
- Note: Free tier spins down after 15 min inactivity

### 3.5 Add Environment Variables

**Scroll down to "Environment Variables" section**

Click "Add Environment Variable" for each of these:

#### Copy-Paste These Variables:

```bash
NODE_ENV
production

PORT
5000

MONGODB_URI
[Your MongoDB connection string from Step 1.4]

JWT_SECRET
[Generate: openssl rand -base64 48]

JWT_REFRESH_SECRET
[Generate different one: openssl rand -base64 48]

JWT_EXPIRES_IN
15m

JWT_REFRESH_EXPIRES_IN
30d

FRONTEND_URL
https://temporary-placeholder.vercel.app

GROQ_API_KEY
[Your GROQ key from Step 2.2]

GROQ_MODEL
llama-3.3-70b-versatile

RATE_LIMIT_WINDOW
900000

RATE_LIMIT_MAX
100
```

#### How to Generate JWT Secrets:
```bash
# On Mac/Linux terminal
openssl rand -base64 48

# Or use online: https://www.random.org/strings/
# Settings: 48 characters, alphanumeric
```

**Generate TWO different secrets!**

### 3.6 Deploy

1. Review all settings
2. Click "Create Web Service"
3. **Wait 5-10 minutes** for deployment

**You'll see:**
- Build logs scrolling
- "Build successful" message
- "Deploy successful" message
- Your service URL: `https://revision-assistant-backend.onrender.com`

**✅ SAVE YOUR RENDER URL** - You'll need it for frontend

### 3.7 Verify Backend

**Test your backend:**
```bash
curl https://your-app.onrender.com/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected"
}
```

---

## 🎨 Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access repositories

### 4.2 Import Project

**Dashboard → Add New... → Project**

**What you'll see:**
- "Import Git Repository" section
- List of your GitHub repos
- Find your repository
- Click "Import"

### 4.3 Configure Project

**You'll see a configuration screen:**

#### Project Settings
- **Framework Preset:** Vite (should auto-detect)
- **Root Directory:** Click "Edit" → Enter `frontend` ⚠️ **IMPORTANT**
- **Build Command:** `npm run build` (auto-filled)
- **Output Directory:** `dist` (auto-filled)
- **Install Command:** `npm install` (auto-filled)

#### Environment Variables

Click "Add" under Environment Variables section:

**Add these TWO variables:**

```bash
VITE_API_BASE_URL
https://your-backend.onrender.com/api

VITE_SOCKET_URL
https://your-backend.onrender.com
```

> ⚠️ Replace `your-backend.onrender.com` with YOUR actual Render URL from Step 3.6

**Environment:** Select "Production, Preview, and Development"

### 4.4 Deploy

1. Review all settings
2. Click "Deploy"
3. **Wait 2-5 minutes** for build

**You'll see:**
- "Building" progress bar
- Build logs
- "Deploying" message
- Success confetti 🎉
- Your live URL: `https://your-app.vercel.app`

**✅ SAVE YOUR VERCEL URL**

### 4.5 Test Frontend

**Open your Vercel URL in browser:**
1. Page should load without errors
2. Try registering a new account
3. Try logging in
4. Check if AI features work

---

## 🔄 Step 5: Final Configuration

### 5.1 Update Backend CORS

**Go back to Render:**
1. Open your backend service
2. Click "Environment" tab
3. Find `FRONTEND_URL` variable
4. Click "Edit"
5. Update value to your actual Vercel URL:
   ```
   https://your-app.vercel.app
   ```
6. Click "Save Changes"

**Service will automatically redeploy** (wait 2-3 minutes)

### 5.2 Test Everything

**Full Integration Test:**

1. **Visit Frontend** (`https://your-app.vercel.app`)
2. **Register Account**
   - Enter email and password
   - Should succeed without CORS errors
3. **Login**
   - Use credentials from registration
   - Should redirect to dashboard
4. **Test AI Features**
   - Try generating a quiz
   - Should work without errors
5. **Check Browser Console**
   - Press F12 → Console tab
   - Should have no red errors

### 5.3 Check Logs

**Backend Logs (Render):**
1. Render Dashboard → Your Service
2. Click "Logs" tab
3. Should see "Server running on port 5000"
4. Should see "MongoDB connected successfully"
5. Watch for any errors

**Frontend Logs (Vercel):**
1. Vercel Dashboard → Your Project
2. Click on latest deployment
3. Click "Logs" tab
4. Should see "Build completed"
5. No red errors

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] MongoDB cluster created and running
- [ ] Database user created with password saved
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained and tested
- [ ] GROQ API key obtained
- [ ] JWT secrets generated (2 different ones)
- [ ] Code pushed to GitHub

### Backend Deployment (Render)
- [ ] Web Service created
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] All environment variables added
- [ ] Service deployed successfully
- [ ] Health check endpoint returns OK
- [ ] Render URL saved

### Frontend Deployment (Vercel)
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] Build command: `npm run build`
- [ ] Environment variables added with Render URL
- [ ] Project deployed successfully
- [ ] Vercel URL saved
- [ ] Frontend loads without errors

### Post-Deployment
- [ ] Backend `FRONTEND_URL` updated with Vercel URL
- [ ] Backend redeployed with new CORS settings
- [ ] User registration works
- [ ] User login works
- [ ] AI features work (quiz generation, etc.)
- [ ] No CORS errors in browser console
- [ ] Database operations work
- [ ] Real-time features work (if any)

---

## 🎯 Common Screens You'll See

### Successful Deployment Screens

#### Render Success
```
✓ Build successful
✓ Deploy successful
🟢 Live (Your service is running)
```

#### Vercel Success
```
✓ Build completed
✓ Deployed to production
🎉 Congratulations! Your project is live!
```

### Error Screens (and fixes)

#### Render: "Build failed"
**Look for:**
- `npm ERR!` in logs
- Missing dependencies
- Wrong build command

**Fix:**
- Check `package.json` has all dependencies
- Verify build command is `npm install`
- Check Node version compatibility

#### Vercel: "Build failed"
**Look for:**
- TypeScript errors
- Missing dependencies
- Environment variable issues

**Fix:**
- Test build locally: `npm run build`
- Check all dependencies in `package.json`
- Verify environment variables have `VITE_` prefix

#### Browser: "Network Error" or CORS
**Symptoms:**
- Red errors in console
- API calls fail
- Login doesn't work

**Fix:**
- Update `FRONTEND_URL` in Render
- Verify backend URL in Vercel env vars
- Clear browser cache
- Check backend is running

---

## 📱 What Users Will See

### First Visit
1. **Landing Page** (if you have one) or **Login Page**
2. Clean, responsive design
3. Register/Login buttons

### After Registration
1. **Dashboard** with user stats
2. **Quiz Generation** interface
3. **Educational Resources** search
4. **Profile** section

### Performance
- **First Load:** 2-3 seconds (cold start on free tier)
- **Subsequent Loads:** < 1 second
- **API Calls:** < 500ms (after warm-up)

---

## 🆘 Getting Help

### If Stuck
1. **Check Logs First**
   - Render: Service → Logs
   - Vercel: Deployment → Logs
   
2. **Review Error Messages**
   - Copy full error message
   - Search in documentation
   
3. **Test Locally**
   - Does it work on localhost?
   - Compare local vs production config
   
4. **Verify URLs**
   - Backend URL correct in frontend?
   - Frontend URL correct in backend?
   
5. **Check Environment Variables**
   - All required vars present?
   - No typos in variable names?
   - Values correct and complete?

### Resources
- 📖 Full Guide: `DEPLOYMENT_GUIDE.md`
- 🔑 Env Variables: `ENV_VARIABLES_REFERENCE.md`
- 🌐 Render Docs: https://render.com/docs
- 🚀 Vercel Docs: https://vercel.com/docs

---

## 🎉 Success!

Your app is now live and accessible worldwide!

**Share these URLs:**
- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-backend.onrender.com/api`

**Next Steps:**
1. Add custom domain (optional)
2. Set up monitoring
3. Enable analytics
4. Share with users
5. Collect feedback

---

**Happy Deploying! 🚀**
