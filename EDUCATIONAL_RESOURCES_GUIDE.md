# 📚 Educational Resources Integration Guide

## Overview
This integration provides free educational resources from:
1. **Khan Academy** (No API key needed!)
2. **YouTube Educational Videos** (Requires free Google API)
3. **Educational Notes/PDFs** (Requires free Google API)

---

## 🚀 Quick Start (Khan Academy Only)

Khan Academy works immediately without any setup:

```bash
# Just restart your backend
cd backend
npm run dev
```

Test it:
```
GET http://localhost:5000/api/educational-resources/search?query=photosynthesis
```

---

## 🔧 Full Setup (YouTube + Notes)

### Step 1: Get Google Custom Search API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Custom Search API**:
   - Click "Enable APIs and Services"
   - Search for "Custom Search API"
   - Click "Enable"
4. Create credentials:
   - Go to "Credentials" tab
   - Click "Create Credentials" → "API Key"
   - Copy your API key

**Important**: This gives you **100 free searches per day**!

---

### Step 2: Create YouTube Search Engine

1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/controlpanel/all)
2. Click **"Add"** to create a new search engine
3. Configure it:

   **Name**: `YouTube Educational Videos`
   
   **What to search**: Select "Search specific sites or pages"
   
   **Sites to search**:
   ```
   youtube.com/c/khanacademy
   youtube.com/c/crashcourse
   youtube.com/c/byjus
   youtube.com/c/unacademy
   youtube.com/c/veritasium
   youtube.com/@3blue1brown
   youtube.com/@TED-Ed
   youtube.com
   ```

4. Click "Create"
5. Go to "Setup" → "Basic" → Copy your **Search Engine ID** (looks like: `a1b2c3d4e5f6g7h8i`)

---

### Step 3: Create Educational Notes Search Engine

1. Create another search engine
2. Configure it:

   **Name**: `Educational Notes and PDFs`
   
   **Sites to search**:
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
   ```

3. Click "Create"
4. Copy the **Search Engine ID**

---

### Step 4: Update Backend Environment Variables

Edit `backend/.env`:

```bash
# Google Custom Search API (for YouTube & Educational Resources)
GOOGLE_SEARCH_API_KEY=AIzaSyAbc123def456ghi789jkl012mno345pqr  # Your API key
GOOGLE_YOUTUBE_CX=a1b2c3d4e5f6g7h8i                           # YouTube Search Engine ID
GOOGLE_NOTES_CX=z9y8x7w6v5u4t3s2r                             # Notes Search Engine ID
```

---

### Step 5: Restart Backend

```bash
cd backend
npm run dev
```

---

## 🧪 Test Your Integration

### Test Configuration
```bash
curl http://localhost:5000/api/educational-resources/test-config
```

Should return:
```json
{
  "success": true,
  "configuration": {
    "khanAcademy": { "enabled": true, "requiresKey": false },
    "youtube": { "enabled": true, "hasApiKey": true, "hasSearchEngineId": true },
    "educationalNotes": { "enabled": true, "hasApiKey": true, "hasSearchEngineId": true }
  }
}
```

### Test Search (English)
```bash
curl "http://localhost:5000/api/educational-resources/search?query=photosynthesis%20class%207"
```

### Test Search (French)
```bash
curl "http://localhost:5000/api/educational-resources/search?query=linear%20equations%20class%208&language=fr"
```

### Test Search (Hindi)
```bash
curl "http://localhost:5000/api/educational-resources/search?query=quadratic%20equations&language=hi"
```

---

## 🎨 Frontend Usage

### Option 1: Full Search Page

Add route to your app:

```typescript
// In your router configuration
import EducationalResourceSearch from './components/resources/EducationalResourceSearch';

// Add route
{
  path: '/resources/search',
  element: <EducationalResourceSearch />
}
```

### Option 2: Dashboard Widget

Add to your dashboard:

```typescript
import QuickSearchWidget from './components/resources/QuickSearchWidget';

function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Your other dashboard widgets */}
      
      <div className="lg:col-span-1">
        <QuickSearchWidget 
          onViewAll={() => navigate('/resources/search')}
        />
      </div>
    </div>
  );
}
```

---

## 📊 API Response Format

```json
{
  "success": true,
  "query": "photosynthesis class 7",
  "language": "en",
  "totalResults": 24,
  "results": {
    "khanAcademy": [
      {
        "id": "photosynthesis-intro",
        "title": "Photosynthesis | Biology | Science",
        "description": "Learn how plants make their own food...",
        "thumbnail": "https://cdn.kastatic.org/...",
        "url": "https://www.khanacademy.org/science/biology/photosynthesis",
        "type": "video",
        "source": "Khan Academy",
        "priority": 1
      }
    ],
    "youtube": [
      {
        "id": "abc123xyz",
        "title": "Photosynthesis Explained - Class 7 Biology",
        "description": "Complete explanation of photosynthesis...",
        "thumbnail": "https://img.youtube.com/vi/abc123xyz/mqdefault.jpg",
        "url": "https://www.youtube.com/watch?v=abc123xyz",
        "type": "video",
        "source": "YouTube",
        "channel": "Khan Academy",
        "priority": 2
      }
    ],
    "educationalNotes": [
      {
        "id": "def456uvw",
        "title": "Photosynthesis Notes PDF - Class 7",
        "description": "Download free notes on photosynthesis...",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "url": "https://example.com/notes.pdf",
        "type": "pdf",
        "source": "byjus.com",
        "priority": 3
      }
    ],
    "all": [
      // All results sorted by priority
    ]
  }
}
```

---

## 🎯 Features

✅ **Always Free**: Khan Academy works without any API key  
✅ **Priority Ordering**: Khan Academy → YouTube → Notes/PDFs  
✅ **Multi-language**: Supports English, French, Hindi  
✅ **Beautiful Cards**: Responsive design with thumbnails  
✅ **Safe Content**: Only trusted educational sources  
✅ **Fast Search**: Parallel API calls for quick results  
✅ **Dashboard Widget**: Quick search from anywhere  

---

## 🌍 Language Support

- **English** (`en`): Default
- **French** (`fr`): For Rwanda/French-speaking regions
- **Hindi** (`hi`): For India

Example searches:
```
"photosynthesis class 7" (English)
"équations linéaires classe 8" (French)
"द्विघात समीकरण कक्षा 10" (Hindi)
```

---

## 💡 Best Practices

1. **Start with Khan Academy only** - It works immediately
2. **Add Google API later** - For YouTube and more resources
3. **Monitor API usage** - 100 free searches/day per API
4. **Cache results** - Store frequently searched topics
5. **Add more sites** - Customize search engines for your region

---

## 🆓 Cost Breakdown

| Service | Cost | Limit |
|---------|------|-------|
| Khan Academy API | **FREE** | Unlimited |
| Google Custom Search | **FREE** | 100 searches/day |
| Total | **$0.00** | Perfect for students! |

---

## 🔒 Security Notes

- Never commit API keys to Git
- Use environment variables only
- Restrict API key to your domains in Google Cloud Console
- Monitor API usage in Google Cloud Console

---

## 📝 Example Queries to Test

```
"photosynthesis class 7"
"quadratic equations grade 10"
"world war 2 history"
"cell division biology"
"linear equations class 8 explanation in french"
"pythagoras theorem proof"
"periodic table chemistry"
"fractions mathematics grade 5"
```

---

## 🚨 Troubleshooting

### Khan Academy not working?
- Check internet connection
- Khan Academy API might be temporarily down
- Try different search terms

### YouTube results empty?
- Verify `GOOGLE_SEARCH_API_KEY` is set
- Verify `GOOGLE_YOUTUBE_CX` is set
- Check you haven't exceeded 100 searches/day
- Test API key in Google Cloud Console

### Notes results empty?
- Verify `GOOGLE_NOTES_CX` is set
- Check search engine configuration
- Add more trusted educational sites

---

## 📞 Support

If you need help:
1. Check backend logs: `npm run dev`
2. Test configuration: `/api/educational-resources/test-config`
3. Check environment variables are loaded
4. Verify API key has Custom Search API enabled

---

## 🎉 You're All Set!

Your students can now search for **100% free educational resources** from the best sources on the internet!
