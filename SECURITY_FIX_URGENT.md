# 🚨 URGENT: API Key Security Issue & Fix

## What Happened

Your OpenAI API key was leaked because **React environment variables are embedded in the frontend JavaScript bundle**, making them publicly accessible to anyone who visits your website.

### How the Leak Occurred

1. You added API keys to `.env` using `REACT_APP_*` variables
2. Create React App bundles these into `build/static/js/*.js` at build time
3. Your Firebase hosting serves these files publicly
4. Anyone can view the browser source code and extract your API keys

### Evidence

Your build file contains the exposed key:
```
build/static/js/main.f8b16611.js contains: sk-proj-RAXO9N...577QA
```

## ✅ Immediate Steps (Do Now)

### 1. Get New API Keys

**OpenAI:**
- Visit: https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the new key
- Paste it into `.env` file: `REACT_APP_OPENAI_KEY=sk-proj-...`

**Gemini (Recommended to rotate):**
- Visit: https://aistudio.google.com/app/apikey
- Create a new API key
- Paste it into `.env` file: `REACT_APP_GEMINI_KEY=AIza...`

### 2. Update Your .env File

Replace the placeholders in `.env`:
```bash
REACT_APP_GEMINI_KEY=your_actual_gemini_key
REACT_APP_OPENAI_KEY=your_actual_openai_key
```

### 3. Rebuild and Clear Old Files

```bash
# Delete the old build with exposed keys
rm -rf build/

# Rebuild with new keys
npm run build

# Clear browser cache completely
# Chrome: Settings > Privacy > Clear browsing data > Cached images and files
```

### 4. Redeploy to Firebase

```bash
firebase deploy
```

## ⚠️ CRITICAL: This is NOT a Permanent Solution

**The new keys will STILL be exposed in your frontend code.**

Anyone can still extract them by:
- Opening browser DevTools
- Viewing page source
- Inspecting network requests
- Looking at the built JavaScript files

## 🔒 Proper Long-Term Solution: Backend Proxy

You **MUST** move API calls to a backend server. Here are your options:

### Option 1: Firebase Cloud Functions (Recommended)

**Benefits:**
- Already using Firebase
- Serverless (no server to maintain)
- Built-in authentication
- Auto-scales

**Implementation:**
```javascript
// functions/index.js
const functions = require('firebase-functions');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: functions.config().openai.key  // Stored securely
});

exports.generateCurriculum = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }

  const { prompt, provider } = data;

  // Make API call server-side
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }]
  });

  return { content: response.choices[0].message.content };
});
```

**Setup:**
```bash
# Install Firebase CLI tools
npm install -g firebase-tools

# Initialize Cloud Functions
firebase init functions

# Set API keys (stored securely, never in code)
firebase functions:config:set openai.key="sk-proj-..."
firebase functions:config:set gemini.key="AIza..."

# Deploy
firebase deploy --only functions
```

**Frontend changes:**
```javascript
// Instead of calling OpenAI directly:
const response = await functions().httpsCallable('generateCurriculum')({
  prompt: userInput,
  provider: 'openai'
});
```

### Option 2: Express Backend Server

Create a simple Express server that proxies API requests.

### Option 3: Netlify/Vercel Functions

If you migrate away from Firebase, these platforms offer serverless functions.

## 📋 Immediate Checklist

- [ ] Create new OpenAI API key at https://platform.openai.com/api-keys
- [ ] (Optional) Create new Gemini API key at https://aistudio.google.com/app/apikey
- [ ] Update `.env` with new keys
- [ ] Delete `build/` folder: `rm -rf build/`
- [ ] Rebuild: `npm run build`
- [ ] Verify keys not in new build: `grep -r "sk-proj" build/` (should find nothing)
- [ ] Deploy to Firebase: `firebase deploy`
- [ ] Clear browser cache
- [ ] Test that app works with new keys
- [ ] **PLAN** to implement backend proxy (Firebase Functions recommended)

## 🎯 Why Frontend API Keys Are Dangerous

1. **Unlimited Usage**: Anyone can use YOUR API keys to make requests
2. **Cost**: You pay for all requests, even from attackers
3. **Rate Limits**: Malicious use can exhaust your quotas
4. **Data Access**: Keys may have access to your OpenAI/Google account data
5. **Billing**: Could result in unexpected large bills

## 📚 Resources

- [Firebase Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [OpenAI Best Practices for API Key Safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- [React Environment Variables Guide](https://create-react-app.dev/docs/adding-custom-environment-variables/)

## 🔍 How to Check If Keys Are Still Exposed

After rebuilding:
```bash
# Should return nothing if keys are removed
grep -r "sk-proj" build/
grep -r "AIza" build/
```

If you see your keys, they're still exposed!

## ⚡ Quick Test After Fix

1. Rebuild app: `npm run build`
2. Check build output:
   ```bash
   # This should find NOTHING
   grep -r "your_actual_key" build/
   ```
3. If found, keys are still exposed - you need the backend proxy solution
4. If not found, you're temporarily secure (but still need backend proxy)

---

## Summary

**What you must do NOW:**
1. Get new API keys
2. Update `.env`
3. Rebuild and redeploy

**What you must do SOON:**
- Implement Firebase Cloud Functions to hide API keys
- Move all API calls server-side
- Never put API keys in frontend code again

**Remember**: Any API key in `REACT_APP_*` variables will be publicly visible in your website's JavaScript!
