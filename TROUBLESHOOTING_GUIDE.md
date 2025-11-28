# 🔧 Deployment Troubleshooting Guide

Complete troubleshooting reference for common deployment issues.

---

## 🗄️ MongoDB Issues

### Issue 1: "MongoServerError: Authentication failed"
**Symptoms:**
- Backend logs show authentication error
- Can't connect to database
- "Invalid username or password"

**Causes:**
- Wrong username/password in connection string
- Special characters not URL encoded
- Database user not created

**Solutions:**
```bash
# 1. Verify credentials in MongoDB Atlas
# Security → Database Access → Check username

# 2. URL encode special characters in password
# Example: If password is "P@ss#123"
# Use: "P%40ss%23123"

# 3. Recreate connection string
# MongoDB Atlas → Database → Connect → Connect your application
# Copy fresh connection string

# 4. Test connection locally first
# Create test-db.js:
```

```javascript
import mongoose from 'mongoose';

const uri = 'your-connection-string-here';

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
```

```bash
# Run test
node test-db.js
```

### Issue 2: "MongoServerError: IP not in whitelist"
**Symptoms:**
- "Connection refused"
- "IP address not allowed"
- Can't reach database

**Solution:**
1. MongoDB Atlas → Security → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere"
4. IP: `0.0.0.0/0`
5. Click "Confirm"
6. Wait 1-2 minutes for update

### Issue 3: "Connection timed out"
**Symptoms:**
- Long wait then timeout
- No response from database
- Intermittent connections

**Solutions:**
1. **Check cluster status**
   - MongoDB Atlas → Database
   - Ensure cluster is not paused
   - Free tier pauses after inactivity

2. **Verify connection string format**
   ```bash
   # Correct format:
   mongodb+srv://username:password@cluster.mongodb.net/dbname?options
   
   # NOT:
   mongodb://... (missing +srv)
   ```

3. **Check firewall**
   - Verify Network Access settings
   - Add 0.0.0.0/0 if restricted

4. **Test with MongoDB Compass**
   - Download MongoDB Compass
   - Try connecting with same string
   - Helps isolate if issue is with app or MongoDB

---

## 🖥️ Render Backend Issues

### Issue 1: "Application failed to start"
**Symptoms:**
- "Deploy failed" message
- Service won't start
- Build succeeds but start fails

**Solutions:**

1. **Check start command**
   ```bash
   # In package.json, should be:
   "scripts": {
     "start": "node src/server.js"
   }
   
   # NOT:
   "start": "nodemon src/server.js"  # ❌ Wrong for production
   ```

2. **Verify main file exists**
   ```bash
   # Check file path
   ls backend/src/server.js  # Should exist
   ```

3. **Check logs for error**
   - Render Dashboard → Service → Logs
   - Look for red errors at bottom
   - Common errors:
     - Missing dependencies
     - Environment variable missing
     - Port binding issue

4. **Ensure PORT is from environment**
   ```javascript
   // In server.js, should be:
   const PORT = process.env.PORT || 5000;
   
   // NOT hardcoded:
   const PORT = 5000;  // ❌ Wrong for Render
   ```

### Issue 2: "Build failed"
**Symptoms:**
- Red "Build failed" status
- NPM errors in logs
- Missing dependencies

**Solutions:**

1. **Check build logs**
   ```bash
   # Look for:
   npm ERR! code ENOENT
   npm ERR! missing script: ...
   ```

2. **Verify package.json**
   ```json
   {
     "name": "revision-assistant-backend",
     "type": "module",  // Important for ES modules
     "main": "src/server.js",
     "scripts": {
       "start": "node src/server.js"
     }
   }
   ```

3. **Test build locally**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

4. **Check Node version**
   ```bash
   # Add engines to package.json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

### Issue 3: "Service unavailable" or 503 errors
**Symptoms:**
- API returns 503
- Service shows as "Live" but doesn't respond
- Intermittent availability

**Causes:**
- Free tier cold start (15+ min inactive)
- Service restarting
- Memory limit exceeded

**Solutions:**

1. **Wait for cold start**
   - First request after inactivity takes 30-60 seconds
   - Subsequent requests fast

2. **Implement keep-alive** (optional)
   ```javascript
   // Use a service like UptimeRobot to ping every 14 minutes
   // Free: https://uptimerobot.com
   ```

3. **Check memory usage**
   - Render Dashboard → Metrics
   - Free tier has 512MB limit
   - Optimize if exceeding

4. **Upgrade to paid tier**
   - $7/month for always-on
   - No cold starts
   - More reliable

### Issue 4: "CORS policy error"
**Symptoms:**
- Frontend can't reach backend
- Browser console shows CORS error
- "Access-Control-Allow-Origin" error

**Solutions:**

1. **Verify FRONTEND_URL**
   ```bash
   # In Render environment variables:
   FRONTEND_URL=https://your-app.vercel.app
   
   # NO trailing slash!
   # NOT: https://your-app.vercel.app/
   ```

2. **Check CORS configuration in code**
   ```javascript
   // In server.js or app.js:
   import cors from 'cors';
   
   const corsOptions = {
     origin: process.env.FRONTEND_URL,
     credentials: true
   };
   
   app.use(cors(corsOptions));
   ```

3. **For multiple URLs (production + preview)**
   ```bash
   # Use FRONTEND_URLS (plural) if your code supports it:
   FRONTEND_URLS=https://app.vercel.app,https://app-git-main.vercel.app
   ```

4. **Redeploy after changing**
   - Environment variable changes trigger auto-redeploy
   - Wait 2-3 minutes

---

## 🎨 Vercel Frontend Issues

### Issue 1: "Build failed"
**Symptoms:**
- Red "Failed" status
- TypeScript errors
- Build logs show errors

**Solutions:**

1. **Check TypeScript errors**
   ```bash
   # Test locally:
   cd frontend
   npm run build
   
   # Fix any TypeScript errors shown
   ```

2. **Common TypeScript fixes**
   ```typescript
   // Add type assertions for undefined checks:
   const user = data?.user;  // Safe navigation
   
   // Or use non-null assertion (if you're sure):
   const user = data!.user;
   
   // Add proper types:
   interface User {
     id: string;
     name: string;
   }
   ```

3. **Check dependencies**
   ```bash
   # Ensure all imports have corresponding packages:
   npm install
   
   # If package is missing:
   npm install package-name
   ```

4. **Disable type checking temporarily** (not recommended)
   ```json
   // In package.json:
   "scripts": {
     "build": "vite build",  // No type check
     // Instead of:
     "build": "tsc && vite build"  // With type check
   }
   ```

### Issue 2: "Page not found on refresh" (404 error)
**Symptoms:**
- App works on first load
- Refreshing any route shows 404
- Direct URL access doesn't work

**Solution:**

Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Then redeploy:
```bash
git add frontend/vercel.json
git commit -m "Fix 404 on refresh"
git push
```

### Issue 3: "Environment variables not working"
**Symptoms:**
- `import.meta.env.VITE_API_BASE_URL` is undefined
- API calls go to undefined URL
- Console shows "undefined/api/..."

**Solutions:**

1. **Check variable prefix**
   ```bash
   # Must start with VITE_:
   VITE_API_BASE_URL=...  # ✅ Correct
   API_BASE_URL=...       # ❌ Won't work
   ```

2. **Redeploy after adding variables**
   - Changes don't apply to existing deployments
   - Trigger new deployment:
     ```bash
     git commit --allow-empty -m "Redeploy"
     git push
     ```

3. **Check environment scope**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Ensure variables are for "Production"

4. **Access in code correctly**
   ```typescript
   // Correct:
   const apiUrl = import.meta.env.VITE_API_BASE_URL;
   
   // NOT:
   const apiUrl = process.env.VITE_API_BASE_URL;  // ❌ Wrong
   ```

### Issue 4: "Network Error" or API calls failing
**Symptoms:**
- API calls return errors
- Console shows network errors
- "Failed to fetch"

**Solutions:**

1. **Verify backend URL**
   ```bash
   # Test backend is accessible:
   curl https://your-backend.onrender.com/api/health
   ```

2. **Check environment variable value**
   - Vercel Dashboard → Settings → Environment Variables
   - Verify URL is correct
   - Should end with `/api`

3. **Check for CORS errors**
   - F12 → Console
   - Look for CORS-related messages
   - Fix backend CORS settings (see Render CORS section)

4. **Test in Network tab**
   - F12 → Network tab
   - Make API call
   - Click on failed request
   - Check:
     - Request URL (is it correct?)
     - Response (what error is backend returning?)
     - Headers (CORS headers present?)

---

## 🔑 Environment Variable Issues

### Issue 1: "JWT_SECRET not defined"
**Symptoms:**
- "Secret must be provided"
- Authentication fails
- Token generation errors

**Solutions:**

1. **Generate proper secret**
   ```bash
   # On Mac/Linux:
   openssl rand -base64 48
   
   # Or use online:
   # https://www.random.org/strings/
   ```

2. **Add to Render**
   - Dashboard → Service → Environment
   - Add `JWT_SECRET` variable
   - Add `JWT_REFRESH_SECRET` variable
   - Use DIFFERENT values for each

3. **Minimum length**
   - At least 32 characters
   - Use random, unpredictable strings

### Issue 2: "GROQ_API_KEY invalid"
**Symptoms:**
- AI features don't work
- 401 Unauthorized errors
- "Invalid API key"

**Solutions:**

1. **Verify key format**
   ```bash
   # Should start with: gsk_
   GROQ_API_KEY=gsk_your_key_here
   ```

2. **Check key is active**
   - Go to console.groq.com
   - API Keys section
   - Verify key exists and is enabled

3. **Check quotas**
   - GROQ Console → Usage
   - Ensure not over limit

4. **Regenerate key**
   - Delete old key
   - Create new one
   - Update in Render

### Issue 3: "Cannot read property of undefined"
**Symptoms:**
- App crashes on start
- Missing config errors

**Solutions:**

1. **Check all required variables are set**
   ```bash
   # Required in Render:
   NODE_ENV
   PORT
   MONGODB_URI
   JWT_SECRET
   JWT_REFRESH_SECRET
   GROQ_API_KEY
   FRONTEND_URL
   ```

2. **Add fallback values in code** (for development)
   ```javascript
   const config = {
     mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dev',
     jwtSecret: process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod'
   };
   ```

3. **Validate on startup**
   ```javascript
   const required = [
     'MONGODB_URI',
     'JWT_SECRET',
     'GROQ_API_KEY'
   ];
   
   const missing = required.filter(key => !process.env[key]);
   
   if (missing.length > 0) {
     console.error('Missing required environment variables:', missing);
     process.exit(1);
   }
   ```

---

## 🌐 General Network Issues

### Issue 1: "Timeout errors"
**Possible Causes & Solutions:**

1. **Backend cold start**
   - First request after 15 min: 30-60 sec wait
   - Solution: Upgrade to paid tier or implement keep-alive

2. **Large payload**
   - Increase timeout in axios:
   ```typescript
   axios.create({
     baseURL: API_URL,
     timeout: 30000  // 30 seconds
   });
   ```

3. **Slow database query**
   - Add indexes to MongoDB
   - Optimize queries
   - Check MongoDB Atlas metrics

### Issue 2: "SSL/HTTPS errors"
**Symptoms:**
- "Certificate error"
- "SSL handshake failed"

**Solutions:**
- Both Render and Vercel provide automatic HTTPS
- No configuration needed
- If errors persist, clear browser cache
- Check DNS propagation if using custom domain

### Issue 3: "502 Bad Gateway"
**Symptoms:**
- Vercel shows 502
- Backend returns 502

**Solutions:**

1. **Check backend is running**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

2. **Check Render service status**
   - Dashboard → Service
   - Should show "Live" with green indicator

3. **Check logs**
   - Render → Logs
   - Look for crash or restart messages

4. **Restart service**
   - Render Dashboard → Service
   - Click menu → "Restart Service"

---

## 🧪 Testing & Debugging

### Quick Health Checks

#### Test Backend
```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Expected response:
# {"status":"ok","message":"Server is running","database":"connected"}

# Test CORS (from frontend domain)
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://your-backend.onrender.com/api/health

# Should include CORS headers in response
```

#### Test Frontend
1. Open `https://your-app.vercel.app`
2. Press F12 (Developer Tools)
3. Console tab - check for errors
4. Network tab - check API calls

### Debug Mode

#### Enable Backend Logging
```javascript
// In server.js:
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Detailed logs
} else {
  app.use(morgan('dev'));
}
```

#### Enable Frontend Logging
```typescript
// Add to axios instance:
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);
```

---

## 📋 Debugging Checklist

When something doesn't work:

### 1. Check Services Status
- [ ] Render service shows "Live" (green)
- [ ] Vercel deployment successful (green)
- [ ] MongoDB cluster running (not paused)

### 2. Check URLs
- [ ] Backend URL correct in frontend env vars
- [ ] Frontend URL correct in backend env vars
- [ ] No trailing slashes in URLs

### 3. Check Environment Variables
- [ ] All required variables present
- [ ] No typos in variable names
- [ ] Values are correct (no extra spaces)
- [ ] Frontend vars have `VITE_` prefix

### 4. Check Logs
- [ ] Render logs show no errors
- [ ] Vercel build logs successful
- [ ] Browser console has no red errors
- [ ] Network tab shows successful API calls

### 5. Test Locally
- [ ] Backend runs locally: `cd backend && npm run dev`
- [ ] Frontend runs locally: `cd frontend && npm run dev`
- [ ] Can connect to MongoDB from local
- [ ] API calls work locally

### 6. Test Production
- [ ] Backend health check responds
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Main features work

---

## 🆘 Still Stuck?

### Gather Information

1. **Backend logs** (Render → Logs)
2. **Frontend logs** (Vercel → Deployment → Logs)
3. **Browser console errors** (F12 → Console)
4. **Network errors** (F12 → Network)
5. **Exact error messages** (copy full text)

### Reset and Retry

```bash
# 1. Clear local dependencies
cd backend && rm -rf node_modules package-lock.json && npm install
cd frontend && rm -rf node_modules package-lock.json && npm install

# 2. Test locally
cd backend && npm start
cd frontend && npm run dev

# 3. If local works, redeploy
git add .
git commit -m "Redeploy"
git push

# 4. Check environment variables again
# 5. Wait for fresh deployment
```

### Contact Support

- **Render**: https://community.render.com/
- **Vercel**: https://vercel.com/support
- **MongoDB**: https://www.mongodb.com/community/forums/

Include:
- Exact error message
- What you've tried
- Logs (sanitize sensitive data!)

---

## ✅ Success Indicators

You'll know it's working when:

1. **Backend**
   - ✅ Health check returns {"status":"ok"}
   - ✅ No errors in Render logs
   - ✅ Shows "Live" status
   - ✅ MongoDB shows "connected"

2. **Frontend**
   - ✅ Page loads without errors
   - ✅ No CORS errors in console
   - ✅ API calls successful in Network tab
   - ✅ Can register and login
   - ✅ All features work

3. **Integration**
   - ✅ Frontend can reach backend
   - ✅ Authentication works
   - ✅ Database operations succeed
   - ✅ AI features respond

---

**Remember:** Most deployment issues are due to:
1. Wrong environment variables (80%)
2. CORS misconfiguration (10%)
3. Build configuration (5%)
4. Everything else (5%)

Check environment variables first! 🔑
