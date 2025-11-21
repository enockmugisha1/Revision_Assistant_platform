# 🔧 Fix Vercel Environment Variables

## ⚠️ THE PROBLEM

Your Vercel frontend doesn't have the backend API URL configured as an environment variable.
This causes the frontend to try calling the wrong URL.

---

## ✅ THE SOLUTION (3 Steps)

### Step 1: Go to Vercel Dashboard

**Click this link:**
👉 **https://vercel.com/dashboard**

Then click on your project: **revision-assistant-platform**

---

### Step 2: Add Environment Variables

1. Click on **"Settings"** tab
2. Click on **"Environment Variables"** in the left sidebar
3. Add these THREE variables:

#### Variable 1:
```
Name:  VITE_API_BASE_URL
Value: https://revision-assistant-platform.onrender.com/api
```

#### Variable 2:
```
Name:  VITE_SOCKET_URL
Value: https://revision-assistant-platform.onrender.com
```

#### Variable 3:
```
Name:  VITE_APP_NAME
Value: Revision Assistant
```

**Important:** Make sure to select **All Environments** (Production, Preview, Development)

---

### Step 3: Redeploy

After adding the variables:

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

## 🧪 VERIFY IT WORKS

After redeploying, open your app:
👉 **https://revision-assistant-platform.vercel.app**

Open browser console (F12) and run:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
```

**Expected Output:**
```
https://revision-assistant-platform.onrender.com/api
```

If you see `undefined`, the environment variables weren't set correctly.

---

## 📸 VISUAL GUIDE

**Step-by-step with screenshots locations:**

1. **Vercel Dashboard** → Your Project
2. **Settings** → Environment Variables
3. Click **"Add New"**
4. Enter Name and Value
5. Select "Production, Preview, and Development"
6. Click **"Save"**
7. Repeat for all 3 variables
8. Go to **Deployments** → Click **"..."** → **"Redeploy"**

---

## 🎯 QUICK LINKS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Project Settings:** https://vercel.com/mutangana-benonis-projects/revision-assistant-platform/settings
- **Environment Variables:** https://vercel.com/mutangana-benonis-projects/revision-assistant-platform/settings/environment-variables

---

## ⚡ ALTERNATIVE: Redeploy from GitHub

If the above doesn't work:

1. Make sure `.env` is in `.gitignore` (it should be)
2. Push any small change to your GitHub repo
3. Vercel will auto-deploy with the new env vars

---

## 🔍 TROUBLESHOOTING

### Problem: Still getting 404
**Solution:** 
- Clear browser cache completely (Ctrl+Shift+Delete)
- Open in Incognito/Private mode
- Check Vercel deployment logs for build errors

### Problem: Environment variables not showing
**Solution:**
- Make sure you clicked "Save" after adding each variable
- Verify they appear in the Environment Variables list
- Redeploy is required for changes to take effect

### Problem: Can't find project in Vercel
**Solution:**
- Check you're logged into the correct Vercel account
- Check project name matches: revision-assistant-platform
- Look under your team/organization if applicable

---

## ✅ CHECKLIST

- [ ] Opened Vercel Dashboard
- [ ] Found revision-assistant-platform project
- [ ] Clicked Settings → Environment Variables
- [ ] Added VITE_API_BASE_URL
- [ ] Added VITE_SOCKET_URL  
- [ ] Added VITE_APP_NAME
- [ ] Selected "All Environments" for each
- [ ] Clicked Save for each
- [ ] Went to Deployments tab
- [ ] Clicked Redeploy
- [ ] Waited 1-2 minutes
- [ ] Tested the app

---

## 🎉 After This Works

Once your environment variables are set and redeployed:

1. ✅ Your app will connect to the backend
2. ✅ Registration/Login will work
3. ✅ All API calls will succeed
4. ✅ No more 404 errors

**That's it!** 🚀
