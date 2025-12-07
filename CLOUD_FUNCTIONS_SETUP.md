# Firebase Cloud Functions Setup - Secure API Keys

## ✅ What We've Done

1. ✅ Created `/functions` directory with Cloud Functions code
2. ✅ Installed dependencies (OpenAI SDK, Gemini SDK, Firebase Functions)
3. ✅ Updated `firebase.json` to include functions configuration
4. ✅ Upgraded Node.js to v20 (required for Firebase Functions)

## 🔐 Next Steps: Set API Keys Securely

Your API keys must be stored as **Firebase secrets** (not in code). Here's how:

### Step 1: Set API Keys as Firebase Secrets

Run these commands to securely store your API keys server-side:

```bash
# Set OpenAI API key
firebase functions:secrets:set OPENAI_KEY
# When prompted, paste your OpenAI API key from https://platform.openai.com/api-keys

# Set Gemini API key
firebase functions:secrets:set GEMINI_KEY
# When prompted, paste your Gemini API key from https://aistudio.google.com/app/apikey
```

**Important**: These secrets are stored securely in Google Cloud Secret Manager and are NEVER exposed in your code or to clients.

### Step 2: Deploy Cloud Functions

```bash
# Deploy functions to Firebase
firebase deploy --only functions
```

This will deploy two Cloud Functions:
1. `generateCurriculum` - Secure proxy for AI API calls
2. `healthCheck` - Verify functions are working

### Step 3: Update Frontend to Use Cloud Functions

I'll need to update your frontend code to call the Cloud Functions instead of calling OpenAI/Gemini directly.

## 📁 Files Created

- `functions/package.json` - Dependencies for Cloud Functions
- `functions/index.js` - Main Cloud Function code
- `functions/.gitignore` - Ignore node_modules
- `firebase.json` - Updated with functions configuration

## 🔒 How It Works

### Before (Insecure):
```
Browser → OpenAI API (with exposed key)
```

### After (Secure):
```
Browser → Firebase Cloud Function → OpenAI API (key hidden server-side)
```

## 📊 Cloud Function API

### generateCurriculum

**Input:**
```javascript
{
  prompt: "Create a lesson plan about...",
  provider: "openai" | "gemini",
  systemPrompt: "You are a helpful assistant..." (optional),
  model: "gpt-4o-mini" (optional)
}
```

**Output:**
```javascript
{
  content: "Generated curriculum content...",
  provider: "openai",
  tokensUsed: {
    prompt: 150,
    completion: 500,
    total: 650
  },
  timestamp: "2025-11-18T..."
}
```

### healthCheck

**Output:**
```javascript
{
  status: "ok",
  timestamp: "2025-11-18T...",
  providers: {
    openai: true,
    gemini: true
  }
}
```

## 💰 Cost Considerations

Cloud Functions pricing:
- First 2 million invocations/month: **FREE**
- After that: $0.40 per million invocations

Your AI costs remain the same (OpenAI/Gemini pricing).

## 🧪 Testing

After deployment, test the function:

```bash
# Test health check
curl https://us-central1-teach-league.cloudfunctions.net/healthCheck

# Or use Firebase CLI
firebase functions:shell
```

## 🚀 After Deployment

Once deployed, I'll update these files to use the Cloud Functions:
- `src/utils/aiProviderFactory.js` - Change to call Cloud Functions
- `src/utils/generateAIWarmUps.js` - Use new API
- Remove `REACT_APP_OPENAI_KEY` and `REACT_APP_GEMINI_KEY` from `.env`

## ⚠️ Important Notes

1. **Don't commit secrets** - They're stored in Google Cloud, not in your code
2. **Functions run server-side** - API keys never reach the browser
3. **CORS is enabled** - Your frontend can call these functions
4. **No authentication required** (optional) - You can enable it later

## 📝 Checklist

- [ ] Run `firebase functions:secrets:set OPENAI_KEY`
- [ ] Run `firebase functions:secrets:set GEMINI_KEY`
- [ ] Run `firebase deploy --only functions`
- [ ] Verify deployment succeeded
- [ ] Update frontend to use Cloud Functions (I'll help with this)
- [ ] Remove API keys from `.env` file
- [ ] Test the application

## 🆘 Troubleshooting

### "Error: HTTP Error: 403, The caller does not have permission"

You need to enable the Secret Manager API:
1. Go to: https://console.cloud.google.com/marketplace/product/google/secretmanager.googleapis.com
2. Select your project "teach-league"
3. Click "Enable"

### "Functions failed to deploy"

Check the logs:
```bash
firebase functions:log
```

### "CORS error when calling function"

The functions are configured with `cors: true`. If you still see errors, check the browser console for details.

---

## Ready to Deploy?

Run these commands in order:

```bash
# 1. Set secrets
firebase functions:secrets:set OPENAI_KEY
firebase functions:secrets:set GEMINI_KEY

# 2. Deploy
firebase deploy --only functions

# 3. Test
curl https://us-central1-teach-league.cloudfunctions.net/healthCheck
```

Let me know when deployment is complete, and I'll update your frontend code!
