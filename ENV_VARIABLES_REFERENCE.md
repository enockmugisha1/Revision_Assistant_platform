# 🔑 Environment Variables Quick Reference

## Backend Environment Variables (Render)

Copy these to your Render service environment variables section:

### ✅ REQUIRED Variables

```bash
# Core Configuration
NODE_ENV=production
PORT=5000

# Database (Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/revision_assistant?retryWrites=true&w=majority

# JWT Authentication (Generate random strings)
JWT_SECRET=your-super-long-random-secret-minimum-32-characters-here
JWT_REFRESH_SECRET=another-different-super-long-random-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# CORS (Your Vercel frontend URL - update after deploying frontend)
FRONTEND_URL=https://your-app-name.vercel.app

# AI Configuration (Get from console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### 📧 OPTIONAL - Email Configuration (For notifications)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM="Revision Assistant <no-reply@example.com>"
```

### 🖼️ OPTIONAL - Cloudinary (For image uploads)

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 🔍 OPTIONAL - Google Search API (For educational resources)

```bash
GOOGLE_SEARCH_API_KEY=your-google-api-key
GOOGLE_YOUTUBE_CX=your-youtube-search-engine-id
GOOGLE_NOTES_CX=your-notes-search-engine-id
```

---

## Frontend Environment Variables (Vercel)

Copy these to your Vercel project environment variables section:

```bash
# API Configuration (Your Render backend URL)
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
VITE_SOCKET_URL=https://your-backend-name.onrender.com
```

---

## 🎯 Step-by-Step Setup Order

### 1. Get MongoDB Connection String
1. Create MongoDB Atlas cluster (free)
2. Create database user
3. Allow network access (0.0.0.0/0)
4. Get connection string → Use as `MONGODB_URI`

### 2. Get GROQ API Key
1. Visit console.groq.com
2. Sign up/login
3. Create API key → Use as `GROQ_API_KEY`

### 3. Generate JWT Secrets
Use this command to generate secure random strings:
```bash
# On Mac/Linux
openssl rand -base64 48

# Or use this online: https://www.random.org/strings/
# Generate 2 different strings (min 32 chars each)
```

### 4. Deploy Backend to Render
1. Connect GitHub repo
2. Set root directory: `backend`
3. Add all REQUIRED environment variables above
4. Save your Render URL (e.g., `https://your-app.onrender.com`)

### 5. Deploy Frontend to Vercel
1. Connect GitHub repo
2. Set root directory: `frontend`
3. Add environment variables with your Render backend URL
4. Save your Vercel URL (e.g., `https://your-app.vercel.app`)

### 6. Update Backend with Frontend URL
1. Go back to Render
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Service will automatically redeploy

---

## 🧪 Testing Your Deployment

### Test Backend
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Should return: {"status":"ok","message":"Server is running","database":"connected"}
```

### Test Frontend
1. Open your Vercel URL in browser
2. Try to register/login
3. Test main features

---

## 🔐 Security Notes

### JWT Secrets
- ✅ Must be minimum 32 characters
- ✅ Use random, unpredictable strings
- ✅ Keep them secret, never commit to Git
- ✅ Use different secrets for JWT and JWT_REFRESH

### MongoDB URI
- ✅ URL encode special characters in password
- ✅ Never commit to Git
- ✅ Use strong passwords

### API Keys
- ✅ Keep all API keys secret
- ✅ Rotate them periodically
- ✅ Use environment variables, never hardcode

---

## ❓ Common Issues

### Issue: "MongoDB connection failed"
**Solution**: 
- Check IP whitelist (allow 0.0.0.0/0)
- Verify username/password
- URL encode special characters in password

### Issue: "CORS error"
**Solution**: 
- Ensure `FRONTEND_URL` matches your Vercel URL exactly
- No trailing slash in URL
- Update and redeploy backend

### Issue: "GROQ API error"
**Solution**:
- Verify API key is correct
- Check GROQ quota/limits
- Ensure model name is correct

### Issue: "Environment variables not working in frontend"
**Solution**:
- Must use `VITE_` prefix for Vite
- Redeploy after adding variables
- Clear browser cache

---

## 📋 Deployment Checklist

### Before Deploying
- [ ] MongoDB cluster created
- [ ] GROQ API key obtained
- [ ] JWT secrets generated
- [ ] Code pushed to GitHub

### Backend Deployment
- [ ] Render service created
- [ ] Root directory set to `backend`
- [ ] All required environment variables added
- [ ] Service deployed successfully
- [ ] Backend URL saved

### Frontend Deployment
- [ ] Vercel project created
- [ ] Root directory set to `frontend`
- [ ] Environment variables added with backend URL
- [ ] Project deployed successfully
- [ ] Frontend URL saved

### After Deployment
- [ ] Updated backend `FRONTEND_URL` with Vercel URL
- [ ] Tested backend API endpoint
- [ ] Tested frontend application
- [ ] Verified user registration/login works

---

## 🆘 Need Help?

1. **Check Logs**:
   - Render: Dashboard → Service → Logs
   - Vercel: Dashboard → Project → Deployments → Logs

2. **Review Documentation**:
   - Full guide: `DEPLOYMENT_GUIDE.md`
   - Render docs: https://render.com/docs
   - Vercel docs: https://vercel.com/docs

3. **Test Locally First**:
   ```bash
   # Backend
   cd backend
   npm install
   npm run dev
   
   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

---

## 🎉 Success Checklist

✅ Backend deployed and accessible  
✅ Frontend deployed and accessible  
✅ User can register/login  
✅ AI features working  
✅ No CORS errors  
✅ Database connected  

**Your app is live! 🚀**

---

**Quick Links**:
- MongoDB Atlas: https://cloud.mongodb.com/
- Render Dashboard: https://dashboard.render.com/
- Vercel Dashboard: https://vercel.com/dashboard
- GROQ Console: https://console.groq.com/
