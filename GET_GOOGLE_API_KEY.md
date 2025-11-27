# 🔑 GET YOUR FREE GOOGLE API KEY - STEP BY STEP

## What You Need:
- A Google account (Gmail)
- 5 minutes
- Your Search Engine IDs (you already have these!):
  - YouTube CX: `66f89c62de83b4f14`
  - Notes CX: `4729b0f660b2e4e87`

---

## 📋 Step-by-Step Guide

### Step 1: Go to Google Cloud Console
1. Open this link in your browser:
   ```
   https://console.cloud.google.com/
   ```
2. Sign in with your Google account

### Step 2: Create a Project (or Select Existing)
1. Click the project dropdown at the top (next to "Google Cloud")
2. Click **"New Project"**
3. Enter name: `Education Platform` (or any name you like)
4. Click **"Create"**
5. Wait 10-20 seconds for project creation

### Step 3: Enable Custom Search API
1. In the search bar at top, type: `Custom Search API`
2. Click on "Custom Search API" from results
3. Click the blue **"ENABLE"** button
4. Wait for activation (5-10 seconds)

### Step 4: Create API Key
1. Click **"Credentials"** in left sidebar
2. Click **"+ CREATE CREDENTIALS"** at top
3. Select **"API key"**
4. Your API key appears! It looks like:
   ```
   AIzaSyAbc123def456ghi789jkl012mno345pqr
   ```
5. **COPY IT IMMEDIATELY** and save it somewhere safe!

### Step 5: (Optional) Restrict Your API Key
1. Click **"RESTRICT KEY"** (or edit the key later)
2. Under "API restrictions":
   - Select "Restrict key"
   - Check ONLY "Custom Search API"
3. Click **"Save"**

---

## ⚡ Quick Setup in Your Backend

### Option 1: Using Command Line
```bash
cd backend
nano .env
# or use any text editor you like
```

Find this line:
```bash
GOOGLE_SEARCH_API_KEY=YOUR_API_KEY_HERE
```

Replace with your actual API key:
```bash
GOOGLE_SEARCH_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr
```

Save the file (Ctrl+O, Enter, Ctrl+X in nano)

### Option 2: Direct Edit
Open `backend/.env` file and update:
```bash
# Google Custom Search API (for YouTube & Educational Resources)
GOOGLE_SEARCH_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr
GOOGLE_YOUTUBE_CX=66f89c62de83b4f14
GOOGLE_NOTES_CX=4729b0f660b2e4e87
```

---

## 🚀 Restart Your Backend

```bash
cd backend
npm run dev
```

---

## 🧪 Test Your Setup

### Test 1: Check Configuration
```bash
curl "http://localhost:5000/api/educational-resources/test-config" | python3 -m json.tool
```

**Expected Output:**
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

### Test 2: Search for Resources
```bash
curl "http://localhost:5000/api/educational-resources/search?query=photosynthesis" | python3 -m json.tool
```

You should see results from YouTube and educational sites!

### Test 3: Search in French
```bash
curl "http://localhost:5000/api/educational-resources/search?query=équations%20linéaires&language=fr" | python3 -m json.tool
```

---

## 🎯 What You Get For FREE

| Feature | Free Limit |
|---------|-----------|
| Khan Academy API | ✅ Unlimited |
| Google Custom Search | ✅ 100 searches/day |
| YouTube Videos | ✅ Included in 100 searches |
| Educational PDFs/Notes | ✅ Included in 100 searches |

**Total Cost: $0.00** 🎉

---

## 📱 Open Test Page in Browser

1. Start your backend: `npm run dev`
2. Open in browser:
   ```
   file:///home/enock/Revision_Assistant_platform/test-educational-resources.html
   ```
3. Or copy the file to your browser

---

## ❓ Troubleshooting

### Problem: "API key not valid"
**Solutions:**
- Make sure you copied the entire key (no spaces)
- Wait 1-2 minutes after creating the key
- Check "Custom Search API" is enabled in Google Cloud Console

### Problem: "Quota exceeded"
**Solution:**
- You've used 100 searches today
- Resets at midnight Pacific Time
- Or upgrade to paid ($5 per 1000 queries)

### Problem: Still not working?
**Quick fixes:**
```bash
# 1. Check your .env file
cat backend/.env | grep GOOGLE

# 2. Make sure backend restarted
pkill -f "node src/server.js"
cd backend && npm run dev

# 3. Verify API key is loaded
curl http://localhost:5000/api/educational-resources/test-config
```

---

## 🎓 Example Searches to Try

```bash
# Science
curl "http://localhost:5000/api/educational-resources/search?query=photosynthesis%20class%207"

# Math
curl "http://localhost:5000/api/educational-resources/search?query=quadratic%20equations%20grade%2010"

# History
curl "http://localhost:5000/api/educational-resources/search?query=world%20war%202%20history"

# French
curl "http://localhost:5000/api/educational-resources/search?query=révolution%20française&language=fr"

# Physics
curl "http://localhost:5000/api/educational-resources/search?query=newton%20laws%20of%20motion"
```

---

## 📞 Need Help?

**Google Cloud Support:**
- Console: https://console.cloud.google.com/
- Help: https://cloud.google.com/support

**API Status:**
- https://status.cloud.google.com/

---

## ✅ Final Checklist

Before testing, make sure:
- [ ] Created Google Cloud project
- [ ] Enabled Custom Search API
- [ ] Created API key
- [ ] Copied API key to backend/.env
- [ ] Have your CX IDs (you already have these!)
- [ ] Restarted backend server
- [ ] Tested configuration endpoint

---

## 🎉 You're Ready!

Your platform can now search:
1. ✅ **Khan Academy** - Unlimited free content
2. ✅ **YouTube Educational Videos** - Best channels (100/day)
3. ✅ **Educational PDFs & Notes** - Trusted sites (100/day)

**All 100% FREE for your students!** 🚀

---

## 💡 Pro Tips

1. **Start Simple**: Khan Academy works immediately without API key
2. **Monitor Usage**: Check Google Cloud Console for daily quota
3. **Cache Results**: Store popular searches to save API calls
4. **Add More Sites**: Customize your search engines for local content

Enjoy! 🎓📚
