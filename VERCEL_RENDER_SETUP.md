# 🚀 QUICK SETUP - Connect Vercel Frontend to Render Backend

## Your Vercel URLs

You have these Vercel deployment URLs:
```
Production: https://revision-assistant-platform-enock-mugishas-projects.vercel.app
Git Main:   https://revision-assistant-platform-git-main-enock-mugishas-projects.vercel.app
Preview:    https://revision-assistant-platform-au8bgech6-enock-mugishas-projects.vercel.app
```

**Use the Production URL:** `https://revision-assistant-platform-enock-mugishas-projects.vercel.app`

---

## ⚡ STEP 1: Update Render Backend (REQUIRED!)

### Go to Render Dashboard:
1. Visit: https://dashboard.render.com
2. Click on your backend service: **revision-assistant-platform**
3. Click the **"Environment"** tab

### Update FRONTEND_URL:
Find the `FRONTEND_URL` variable and set it to:
```
FRONTEND_URL=https://revision-assistant-platform-enock-mugishas-projects.vercel.app
```

**OR** if you want to support all Vercel URLs (recommended):
```
FRONTEND_URLS=https://revision-assistant-platform-enock-mugishas-projects.vercel.app,https://revision-assistant-platform-git-main-enock-mugishas-projects.vercel.app,https://revision-assistant-platform-au8bgech6-enock-mugishas-projects.vercel.app
```

### Click "Save Changes"
- Render will automatically redeploy (takes 2-3 minutes)
- Wait for the green "Live" indicator

---

## ⚡ STEP 2: Update Vercel Environment Variables

### Go to Vercel Dashboard:
1. Visit: https://vercel.com/dashboard
2. Click on your project: **revision-assistant-platform**
3. Go to **Settings** → **Environment Variables**

### Add/Update these variables:

**Variable 1:**
```
Name:  VITE_API_BASE_URL
Value: https://revision-assistant-platform-tbc0.onrender.com/api
Environment: Production, Preview, Development
```

**Variable 2:**
```
Name:  VITE_SOCKET_URL
Value: https://revision-assistant-platform-tbc0.onrender.com
Environment: Production, Preview, Development
```

### Redeploy Vercel:
After adding variables:
1. Go to **Deployments** tab
2. Find latest deployment
3. Click the ⋮ (three dots) menu
4. Click **"Redeploy"**
5. Wait 2-3 minutes

---

## ✅ STEP 3: Verify Everything Works

### Test Backend:
```bash
curl https://revision-assistant-platform-tbc0.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected"
}
```

### Test Frontend:
1. Open: https://revision-assistant-platform-enock-mugishas-projects.vercel.app
2. Press F12 (open Developer Tools)
3. Go to **Console** tab
4. Check for errors (should be none or minimal)
5. Try to register a new account
6. Try to login

### Check Network Calls:
1. In Developer Tools (F12)
2. Go to **Network** tab
3. Try to login/register
4. Check API calls go to: `https://revision-assistant-platform-tbc0.onrender.com/api`
5. Should return 200 status (not CORS errors)

---

## 📋 Quick Checklist

- [ ] Updated `FRONTEND_URL` in Render
- [ ] Waited for Render to redeploy (2-3 min)
- [ ] Added `VITE_API_BASE_URL` in Vercel
- [ ] Added `VITE_SOCKET_URL` in Vercel
- [ ] Redeployed Vercel
- [ ] Tested backend health endpoint
- [ ] Opened frontend URL
- [ ] No CORS errors in console
- [ ] Registration works
- [ ] Login works

---

## 🎯 Expected Results

### Render Environment Variables:
```bash
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_REFRESH_SECRET=<your-refresh-secret>
GROQ_API_KEY=<your-groq-key>

# UPDATED (one of these):
FRONTEND_URL=https://revision-assistant-platform-enock-mugishas-projects.vercel.app

# OR (to support all URLs):
FRONTEND_URLS=https://revision-assistant-platform-enock-mugishas-projects.vercel.app,https://revision-assistant-platform-git-main-enock-mugishas-projects.vercel.app,https://revision-assistant-platform-au8bgech6-enock-mugishas-projects.vercel.app
```

### Vercel Environment Variables:
```bash
VITE_API_BASE_URL=https://revision-assistant-platform-tbc0.onrender.com/api
VITE_SOCKET_URL=https://revision-assistant-platform-tbc0.onrender.com
```

---

## ⚠️ Troubleshooting

### Issue: CORS Error
**Symptom:** Console shows "Access-Control-Allow-Origin" error

**Solution:**
1. Check `FRONTEND_URL` in Render matches your Vercel URL exactly
2. No trailing slash in URLs
3. Wait 2-3 minutes after changing for Render to redeploy

### Issue: API Calls to Wrong URL
**Symptom:** Network tab shows calls to `localhost` or wrong URL

**Solution:**
1. Check `VITE_API_BASE_URL` in Vercel
2. Must include `/api` at the end
3. Redeploy Vercel after changing

### Issue: "Cannot connect to server"
**Symptom:** All API calls fail

**Solution:**
1. Check Render service is running (green "Live" indicator)
2. Test health endpoint: `curl https://revision-assistant-platform-tbc0.onrender.com/api/health`
3. Check Render logs for errors

### Issue: Environment Variables Not Working
**Symptom:** Still seeing old values

**Solution:**
1. After changing env vars in Vercel, MUST redeploy
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)

---

## 🎉 Success Indicators

When everything is working:

✅ Render shows "Live" (green)  
✅ Vercel deployment successful  
✅ Frontend loads without errors  
✅ No CORS errors in console  
✅ API calls succeed (200 status)  
✅ Can register new user  
✅ Can login  
✅ Can use AI features  

---

## 📞 Quick Reference

### Your URLs:
```
Frontend (Production): https://revision-assistant-platform-enock-mugishas-projects.vercel.app
Backend (API):         https://revision-assistant-platform-tbc0.onrender.com
Backend Health:        https://revision-assistant-platform-tbc0.onrender.com/api/health
```

### Dashboards:
```
Render:  https://dashboard.render.com
Vercel:  https://vercel.com/dashboard
MongoDB: https://cloud.mongodb.com
```

---

## 🚀 You're Ready!

**Time to complete:** 5-10 minutes

**Order of operations:**
1. Update Render (FRONTEND_URL) → Wait 2-3 min
2. Update Vercel (VITE_API_BASE_URL, VITE_SOCKET_URL) → Redeploy → Wait 2-3 min
3. Test everything

**Need more help?** See TROUBLESHOOTING_GUIDE.md

---

**Status:** ⏳ Waiting for you to update Render and Vercel environment variables

**Next:** Follow Step 1 above! 🎯
