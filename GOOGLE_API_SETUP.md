# 🔑 Google Custom Search API Setup Guide

## Step-by-Step Tutorial with Screenshots

### Part 1: Get Your Free Google API Key

#### Step 1: Go to Google Cloud Console
1. Open your browser and go to: **https://console.cloud.google.com/**
2. Sign in with your Google account

#### Step 2: Create a New Project
1. Click on the project dropdown (top left, next to "Google Cloud")
2. Click **"New Project"**
3. Enter project name: `Education Platform`
4. Click **"Create"**
5. Wait for project creation (takes 10-30 seconds)

#### Step 3: Enable Custom Search API
1. In the search bar at the top, type: **"Custom Search API"**
2. Click on **"Custom Search API"** from results
3. Click the blue **"Enable"** button
4. Wait for activation (takes 5-10 seconds)

#### Step 4: Create API Key
1. Click **"Credentials"** in the left sidebar
2. Click **"Create Credentials"** at the top
3. Select **"API Key"**
4. Your API key will be created instantly!
5. **COPY IT IMMEDIATELY** - it looks like: `AIzaSyAbc123def456ghi789jkl012mno345pqr`
6. Click **"Restrict Key"** (recommended for security)

#### Step 5: Restrict Your API Key (Optional but Recommended)
1. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check **"Custom Search API"** only
2. Under **"Application restrictions"** (optional):
   - Select **"HTTP referrers"**
   - Add your domain: `*.yourdomain.com/*`
   - Add localhost for testing: `localhost:*`
3. Click **"Save"**

✅ **You now have your API key!**

---

### Part 2: Create YouTube Search Engine

#### Step 1: Go to Programmable Search Engine
1. Open: **https://programmablesearchengine.google.com/controlpanel/all**
2. Sign in with the same Google account

#### Step 2: Create New Search Engine
1. Click the blue **"Add"** button
2. You'll see a form - fill it out as follows:

#### Step 3: Configure YouTube Search Engine

**Name of the search engine:**
```
YouTube Educational Videos
```

**What to search:**
- Select **"Search specific sites or pages"**

**Sites to search:** (Add these one by one by clicking "Add")
```
youtube.com/c/khanacademy
youtube.com/c/crashcourse
youtube.com/c/byjus
youtube.com/c/unacademy
youtube.com/c/veritasium
youtube.com/@3blue1brown
youtube.com/@TED-Ed
youtube.com/@AsapSCIENCE
youtube.com/@Vsauce
youtube.com
```

**Language:** 
- Select **"English"** (or your preferred language)

**Search engine keywords:**
```
education, learning, tutorial, lesson, class
```

#### Step 4: Create the Search Engine
1. Click **"Create"**
2. You'll be redirected to the Overview page

#### Step 5: Get Your Search Engine ID (CX)
1. Look for **"Search engine ID"** on the Overview page
2. It looks like: `a1b2c3d4e5f6g7h8i` or `012345678901234567890:abcdefghijk`
3. **COPY THIS ID** - this is your `GOOGLE_YOUTUBE_CX`

#### Step 6: Enable Image Search (Important!)
1. Click **"Setup"** in the left sidebar
2. Go to **"Basics"** tab
3. Turn ON **"Image search"**
4. Turn ON **"Search the entire web"** (optional, for broader results)
5. Click **"Update"**

---

### Part 3: Create Educational Notes Search Engine

#### Step 1: Create Another Search Engine
1. Go back to: https://programmablesearchengine.google.com/controlpanel/all
2. Click **"Add"** again

#### Step 2: Configure Notes Search Engine

**Name:**
```
Educational Notes and PDFs
```

**What to search:**
- Select **"Search specific sites or pages"**

**Sites to search:** (Add these trusted educational sites)
```
khanacademy.org
byjus.com
ncert.nic.in
cbse.gov.in
education.gov.rw
toppr.com
vedantu.com
learn.org
coursera.org
edx.org
brilliant.org
ck12.org
openstax.org
arxiv.org
scholar.google.com
```

**For Rwanda-specific resources, add:**
```
reb.rw
education.gov.rw
mineduc.gov.rw
```

**For India-specific resources, add:**
```
ncert.nic.in
cbse.gov.in
nios.ac.in
swayam.gov.in
diksha.gov.in
```

#### Step 3: Create and Get Search Engine ID
1. Click **"Create"**
2. Copy the **"Search engine ID"**
3. This is your `GOOGLE_NOTES_CX`

---

### Part 4: Add to Your Backend

#### Open your `.env` file:
```bash
cd backend
nano .env
# or use any text editor
```

#### Add these three lines:
```bash
# Google Custom Search API (Free - 100 searches/day)
GOOGLE_SEARCH_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr
GOOGLE_YOUTUBE_CX=a1b2c3d4e5f6g7h8i
GOOGLE_NOTES_CX=z9y8x7w6v5u4t3s2r
```

Replace with your actual values!

#### Restart your backend:
```bash
npm run dev
```

---

## 🧪 Testing Your Setup

### Test 1: Check Configuration
```bash
curl http://localhost:5000/api/educational-resources/test-config
```

**Expected Response:**
```json
{
  "success": true,
  "configuration": {
    "khanAcademy": {
      "enabled": true,
      "requiresKey": false
    },
    "youtube": {
      "enabled": true,
      "hasApiKey": true,
      "hasSearchEngineId": true
    },
    "educationalNotes": {
      "enabled": true,
      "hasApiKey": true,
      "hasSearchEngineId": true
    }
  }
}
```

### Test 2: Search Khan Academy (Works Without API Key)
```bash
curl "http://localhost:5000/api/educational-resources/search?query=photosynthesis"
```

### Test 3: Full Search (With YouTube + Notes)
```bash
curl "http://localhost:5000/api/educational-resources/search?query=quadratic%20equations%20class%2010"
```

### Test 4: French Language Search
```bash
curl "http://localhost:5000/api/educational-resources/search?query=équations%20linéaires&language=fr"
```

---

## 📊 API Limits & Costs

| Service | Free Tier | Cost After Free Tier |
|---------|-----------|---------------------|
| Khan Academy API | ✅ Unlimited | Always Free |
| Google Custom Search | ✅ 100 queries/day | $5 per 1000 queries |
| **Total Daily** | **100 free searches** | Only if you exceed |

### How to Stay Within Free Limits:

1. **Cache Results**: Store popular searches in database
2. **Prioritize Khan Academy**: Always search Khan Academy first (unlimited!)
3. **Smart Throttling**: Limit searches per user per day
4. **Use Wisely**: Only call YouTube/Notes APIs when needed

---

## 🔒 Security Best Practices

### 1. Restrict Your API Key

In Google Cloud Console:
- Go to Credentials
- Click on your API key
- Add **HTTP referrer restrictions**:
  ```
  *.yourdomain.com/*
  localhost:*
  ```

### 2. Never Commit Keys to Git

Add to `.gitignore`:
```bash
.env
.env.local
.env.production
```

### 3. Use Environment Variables Only

❌ **NEVER do this:**
```javascript
const apiKey = 'AIzaSyAbc123def456ghi789jkl012mno345pqr';
```

✅ **ALWAYS do this:**
```javascript
const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
```

### 4. Monitor Usage

Check usage in Google Cloud Console:
- Go to **"APIs & Services"** → **"Dashboard"**
- Click on **"Custom Search API"**
- View your daily quota usage

---

## ❓ Troubleshooting

### Problem: "API key not valid"
**Solution:**
1. Check API key is copied correctly (no spaces)
2. Make sure Custom Search API is enabled
3. Wait 1-2 minutes after creating key (propagation delay)
4. Check API restrictions aren't blocking your requests

### Problem: "Search engine not found"
**Solution:**
1. Verify Search Engine ID (CX) is correct
2. Make sure search engine status is "Active"
3. Check you're using the right CX for each search type

### Problem: "Quota exceeded"
**Solution:**
1. You've used 100 searches today
2. Wait until midnight (Pacific Time) for reset
3. Consider caching popular searches
4. Or upgrade to paid tier ($5/1000 queries)

### Problem: No YouTube results
**Solution:**
1. Make sure "Search the entire web" is ON
2. Check sites list includes `youtube.com`
3. Try a different search query
4. Verify API key has Custom Search API enabled

### Problem: Backend can't read .env file
**Solution:**
```bash
# Make sure dotenv is loaded first in server.js
import dotenv from 'dotenv';
dotenv.config();

# Check file permissions
chmod 600 backend/.env

# Verify environment variables are loaded
node -e "require('dotenv').config(); console.log(process.env.GOOGLE_SEARCH_API_KEY)"
```

---

## 🎯 Advanced Tips

### Tip 1: Add More Trusted Sites

You can add any educational site:
```
mit.edu
stanford.edu
harvard.edu
physics.org
mathisfun.com
biologycorner.com
chemguide.co.uk
```

### Tip 2: Create Multiple Search Engines

Create different search engines for:
- Science resources only
- Math resources only
- Language learning
- Specific grade levels

### Tip 3: Boost Specific Channels

In YouTube search engine, add `*` next to priority channels:
```
youtube.com/c/khanacademy*
youtube.com/c/crashcourse*
```

### Tip 4: Exclude Sites

Add `-` before domains you want to exclude:
```
-spam-site.com
-ads-site.com
```

---

## 📞 Need Help?

1. **Google Cloud Support**: https://cloud.google.com/support
2. **Custom Search Help**: https://support.google.com/programmable-search/
3. **Check Status**: https://status.cloud.google.com/

---

## ✅ Checklist

Before going live, verify:

- [ ] API key created and copied
- [ ] Custom Search API enabled
- [ ] YouTube search engine created
- [ ] Notes search engine created
- [ ] Both Search Engine IDs copied
- [ ] .env file updated
- [ ] Backend restarted
- [ ] Test configuration endpoint works
- [ ] Khan Academy search works
- [ ] YouTube search works
- [ ] Notes search works
- [ ] API key restrictions set
- [ ] .env in .gitignore
- [ ] Usage monitoring enabled

---

## 🎉 You're Done!

Your platform now has access to the best free educational resources on the internet!

**Next Steps:**
1. Test with real queries
2. Monitor API usage
3. Consider caching popular searches
4. Add more trusted educational sites
5. Share with students!
