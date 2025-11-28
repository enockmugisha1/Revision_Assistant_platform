# 🚀 Quick Deploy - README

**Deploy your Revision Assistant Platform in under 30 minutes!**

---

## 📚 Documentation Index

Choose the guide that fits your needs:

### 1. **DEPLOYMENT_GUIDE.md** (Comprehensive)
   - 📖 Full detailed guide
   - Complete step-by-step instructions
   - All configuration options
   - Security best practices
   - **Best for:** First-time deployers, complete reference

### 2. **VISUAL_DEPLOYMENT_GUIDE.md** (Step-by-Step)
   - 📸 Visual walkthrough with screen descriptions
   - What you'll see at each step
   - Click-by-click instructions
   - Screenshots descriptions
   - **Best for:** Visual learners, beginners

### 3. **ENV_VARIABLES_REFERENCE.md** (Quick Reference)
   - 🔑 All environment variables in one place
   - Copy-paste ready format
   - Quick setup order
   - Testing commands
   - **Best for:** Quick reference, experienced deployers

### 4. **TROUBLESHOOTING_GUIDE.md** (Problem Solving)
   - 🔧 Common issues and solutions
   - Error messages explained
   - Debugging steps
   - Health checks
   - **Best for:** When things go wrong

### 5. **THIS FILE** (30-Minute Quick Start)
   - ⚡ Fastest path to deployment
   - Essential steps only
   - Copy-paste commands
   - **Best for:** Experienced users, quick deployment

---

## ⚡ 30-Minute Quick Deploy

Follow these steps in order. No skipping!

### Prerequisites (5 min)
- [ ] GitHub account
- [ ] Code pushed to GitHub repository

### Step 1: Database (7 min)

**MongoDB Atlas:**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up → Create free M0 cluster
3. Security → Database Access → Add user (save password!)
4. Security → Network Access → Allow 0.0.0.0/0
5. Database → Connect → Get connection string
6. Add `/revision_assistant` before the `?` in the URL

**Save this:** `mongodb+srv://user:pass@cluster.net/revision_assistant?retryWrites=true&w=majority`

### Step 2: API Keys (3 min)

**GROQ:**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up → API Keys → Create
3. Copy key (starts with `gsk_`)

**JWT Secrets:**
```bash
# Generate two different secrets:
openssl rand -base64 48
openssl rand -base64 48
```

### Step 3: Backend Deploy (8 min)

**Render:**
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. New → Web Service → Connect your repo
3. Configure:
   - Name: `your-app-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Instance: Free

4. Add Environment Variables (click "Add Environment Variable"):

```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=https://temporary.vercel.app
GROQ_API_KEY=<your-groq-key>
GROQ_MODEL=llama-3.3-70b-versatile
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

5. Click "Create Web Service"
6. **Wait 5-10 minutes** for deployment
7. **Copy your Render URL:** `https://your-app.onrender.com`

**Test:**
```bash
curl https://your-app.onrender.com/api/health
# Should return: {"status":"ok",...}
```

### Step 4: Frontend Deploy (5 min)

**Vercel:**
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. New Project → Import your repo
3. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `dist`

4. Add Environment Variables:

```
VITE_API_BASE_URL=https://your-app.onrender.com/api
VITE_SOCKET_URL=https://your-app.onrender.com
```

5. Click "Deploy"
6. **Wait 2-5 minutes**
7. **Copy your Vercel URL:** `https://your-app.vercel.app`

### Step 5: Connect Them (2 min)

**Update Backend CORS:**
1. Go back to Render → Your service
2. Environment tab
3. Edit `FRONTEND_URL` variable
4. Set to: `https://your-app.vercel.app`
5. Save (auto-redeploys in 2-3 min)

### Step 6: Test (3 min)

1. Open `https://your-app.vercel.app`
2. Register a new account
3. Login
4. Try generating a quiz
5. Check browser console (F12) - should be no red errors

**✅ If all works: You're live!**
**❌ If errors: See [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md)**

---

## 🎯 Essential URLs to Save

After deployment, save these:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend (Users)** | `https://your-app.vercel.app` | Share with users |
| **Backend (API)** | `https://your-app.onrender.com` | For API calls |
| **MongoDB** | `https://cloud.mongodb.com` | Database management |
| **Render Dashboard** | `https://dashboard.render.com` | Backend monitoring |
| **Vercel Dashboard** | `https://vercel.com/dashboard` | Frontend monitoring |
| **GROQ Console** | `https://console.groq.com` | API usage/limits |

---

## ⚙️ Environment Variables Summary

### Backend (Render) - Required:
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<random-string-48-chars>
JWT_REFRESH_SECRET=<different-random-string-48-chars>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=<your-vercel-url>
GROQ_API_KEY=<your-groq-api-key>
GROQ_MODEL=llama-3.3-70b-versatile
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Frontend (Vercel) - Required:
```bash
VITE_API_BASE_URL=<your-render-url>/api
VITE_SOCKET_URL=<your-render-url>
```

**Note:** Frontend variables MUST start with `VITE_`

---

## 🔍 Health Check Commands

### Test Backend:
```bash
# Health endpoint
curl https://your-app.onrender.com/api/health

# Expected: {"status":"ok","message":"Server is running","database":"connected"}
```

### Test Frontend:
```bash
# Open in browser
open https://your-app.vercel.app

# Check console (F12) for errors
```

### Test Database:
```bash
# In your local terminal
mongosh "your-connection-string-here"

# Or use MongoDB Compass GUI
```

---

## 🚨 Common Issues (Quick Fixes)

### "MongoDB connection failed"
```bash
# Fix: Check Network Access in MongoDB Atlas
# Ensure 0.0.0.0/0 is allowed
```

### "CORS error in browser"
```bash
# Fix: Update FRONTEND_URL in Render
# Must match your Vercel URL exactly
```

### "Build failed on Render"
```bash
# Fix: Check package.json has:
"scripts": {
  "start": "node src/server.js"
}
```

### "Environment variables not working"
```bash
# Frontend: Must start with VITE_
# After changing: Redeploy
```

### "503 Service Unavailable"
```bash
# Free tier cold start (30-60 sec wait)
# Or service is restarting
```

---

## 📊 Monitoring Your App

### Backend Monitoring (Render)
- Dashboard → Your Service → **Logs** (live logs)
- Dashboard → Your Service → **Metrics** (CPU, memory)
- Dashboard → Your Service → **Events** (deploys, restarts)

### Frontend Monitoring (Vercel)
- Dashboard → Your Project → **Deployments** (history)
- Dashboard → Your Project → **Analytics** (traffic)
- Dashboard → Deployment → **Logs** (build/runtime)

### Database Monitoring (MongoDB)
- Atlas → Database → **Metrics** (operations, connections)
- Atlas → Database → **Performance Advisor** (optimization)

---

## 💡 Pro Tips

### 1. **Free Tier Limitations**
- **Render**: Spins down after 15 min (30-60 sec cold start)
- **Vercel**: 100 GB bandwidth/month (plenty for testing)
- **MongoDB**: 512 MB storage (good for ~10k users)

### 2. **Improve Performance**
```bash
# Keep backend alive (free service):
# Use UptimeRobot to ping every 14 minutes
# URL to ping: https://your-app.onrender.com/api/health
```

### 3. **Multiple Environments**
```bash
# Vercel creates preview deployments automatically for PRs
# Render can be configured for multiple environments

# Add preview URLs to backend CORS:
FRONTEND_URLS=https://app.vercel.app,https://app-git-main.vercel.app
```

### 4. **Custom Domain** (Optional)
- **Vercel**: Settings → Domains → Add (free SSL)
- **Render**: Settings → Custom Domain (free SSL on paid plan)

### 5. **Enable Analytics**
```bash
# Vercel: Settings → Analytics (free tier available)
# Add Google Analytics in your frontend
# Use Sentry for error tracking (free tier)
```

---

## 🔒 Security Checklist

Before going live:

- [ ] Strong JWT secrets (minimum 32 chars)
- [ ] Environment variables never in Git
- [ ] CORS configured (not allowing all origins)
- [ ] Rate limiting enabled
- [ ] HTTPS only (automatic on Render/Vercel)
- [ ] MongoDB network access configured
- [ ] Strong database password
- [ ] API keys rotated regularly

---

## 📈 Scaling Strategy

### When to Upgrade:

**Backend (Render):**
- Users complain about slow loading → Upgrade to $7/month (always-on)
- High traffic → Monitor metrics, may need higher tier
- Need more memory → Upgrade instance type

**Frontend (Vercel):**
- Exceed 100 GB bandwidth → Upgrade to Pro ($20/month)
- Need team features → Pro plan
- Advanced analytics → Pro plan

**Database (MongoDB):**
- Near 512 MB storage → Upgrade to M10 (~$57/month)
- Need backups → M10 or higher
- Performance issues → Add indexes, optimize queries

---

## 🎓 Learning Resources

### Platform Docs:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

### Tutorials:
- [Node.js Deployment Guide](https://nodejs.org/en/docs/guides)
- [React Deployment Best Practices](https://reactjs.org/docs/optimizing-performance.html)
- [MongoDB Connection Best Practices](https://docs.mongodb.com/manual/reference/connection-string/)

---

## 🆘 Getting Help

### If Something Goes Wrong:

1. **Check Logs First**
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Deployment → Logs
   - Browser: F12 → Console

2. **Read Error Messages**
   - Copy full error text
   - Search in documentation

3. **Use Troubleshooting Guide**
   - See [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md)

4. **Test Locally**
   ```bash
   # Backend
   cd backend && npm install && npm run dev
   
   # Frontend
   cd frontend && npm install && npm run dev
   ```

5. **Community Support**
   - [Render Community](https://community.render.com)
   - [Vercel Discord](https://vercel.com/discord)
   - [MongoDB Forums](https://www.mongodb.com/community/forums)

---

## ✅ Deployment Checklist

Print this or keep it handy:

### Pre-Deployment:
- [ ] Code works locally
- [ ] Code pushed to GitHub
- [ ] MongoDB cluster created
- [ ] GROQ API key obtained
- [ ] JWT secrets generated

### Backend:
- [ ] Render service created
- [ ] Root directory: `backend`
- [ ] Environment variables added
- [ ] Service deployed successfully
- [ ] Health check passes
- [ ] URL saved

### Frontend:
- [ ] Vercel project created
- [ ] Root directory: `frontend`
- [ ] Environment variables added
- [ ] Project deployed successfully
- [ ] URL saved

### Integration:
- [ ] Backend CORS updated with frontend URL
- [ ] Registration works
- [ ] Login works
- [ ] AI features work
- [ ] No console errors

### Go Live:
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)
- [ ] Monitoring set up
- [ ] URL shared with users

---

## 🎉 Success!

Your Revision Assistant Platform is now live at:
- 🌐 **Frontend:** `https://your-app.vercel.app`
- 🔧 **Backend:** `https://your-app.onrender.com`
- 🗄️ **Database:** MongoDB Atlas

### What's Next?

1. **Share with users** → Get feedback
2. **Monitor usage** → Check analytics
3. **Plan updates** → Add features
4. **Optimize** → Improve performance
5. **Scale** → Upgrade as needed

---

## 📞 Quick Reference

### Deploy Commands:
```bash
# Redeploy (both auto-deploy on git push)
git add .
git commit -m "Update"
git push origin main

# Manual Vercel deploy
cd frontend && vercel --prod

# Check backend health
curl https://your-app.onrender.com/api/health
```

### Important Links:
- **This Project Docs:** All MD files in project root
- **Render:** https://dashboard.render.com
- **Vercel:** https://vercel.com/dashboard
- **MongoDB:** https://cloud.mongodb.com
- **GROQ:** https://console.groq.com

---

**Made with ❤️ for Education | Deploy Time: ~30 minutes**

**Questions?** Check [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md) or [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed help.

Happy Deploying! 🚀
