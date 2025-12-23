# Google Authentication Debugging Guide

## How to Test if Google Login is Working

### 1. Open Browser Console
- Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows/Linux)
- Go to the "Console" tab

### 2. Click "Sign in with Google"
Watch the console for these messages:

#### **Expected Console Output on Redirect:**
```
🔍 Checking for Google redirect result...
✅ Google sign-in successful: {email: "...", displayName: "...", photoURL: "...", hasAccessToken: true}
💾 Access token saved to localStorage
🔄 Auth state changed - user logged in: your.email@gmail.com
```

If you see `hasAccessToken: false` or errors, there's a problem with the OAuth flow.

### 3. Check localStorage
In the browser console, type:
```javascript
localStorage.getItem('google_access_token')
```

You should see a long string (the access token). If it returns `null`, the token isn't being saved.

### 4. Check Redux State
In the browser console, type:
```javascript
window.__REDUX_DEVTOOLS_EXTENSION__ && console.log(JSON.stringify(window.store.getState().user, null, 2))
```

Or use Redux DevTools extension to inspect the `user` state.

You should see:
```json
{
  "currentUser": {
    "uid": "...",
    "email": "your.email@gmail.com",
    "displayName": "Your Name",
    "photoURL": "...",
    "driveEnabled": true,
    "googleAccessToken": "ya29...."
  }
}
```

If `driveEnabled` is `false` or `googleAccessToken` is `null`, the Drive integration won't work.

### 5. Check User Avatar
After logging in, you should see:
- Your Google profile photo in the top right (instead of the "Login" button)
- The GoogleDriveSearch component should show "Your Google Drive Materials" instead of asking you to sign in

## Common Issues

### Issue 1: Access Token is Null
**Symptom:** `hasAccessToken: false` in console

**Possible Causes:**
1. OAuth scope not granted - Check Firebase Console → Authentication → Settings → Authorized domains
2. Scope not requested properly in `UserLoginForm.js`
3. CORS issues with Firebase Functions

**Fix:** Check that line 59 in `UserLoginForm.js` includes:
```javascript
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
```

### Issue 2: Redirect Loop
**Symptom:** Page keeps redirecting

**Possible Causes:**
1. `redirectHandled.current` flag issue
2. Multiple `getRedirectResult()` calls

**Fix:** Clear localStorage and try again:
```javascript
localStorage.clear()
```

### Issue 3: User Logged In but Drive Search Doesn't Work
**Symptom:** User avatar shows, but Drive search says "Sign in with Google"

**Check:**
1. Is `driveEnabled` true in Redux state?
2. Is `googleAccessToken` present in Redux state?
3. Are Firebase Functions deployed?

## Testing Firebase Functions Locally

To test if the Drive API functions work:

```bash
# In functions directory
npm run serve

# Then in browser console:
fetch('http://localhost:5001/YOUR_PROJECT_ID/us-central1/setupDriveFolder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      accessToken: 'YOUR_ACCESS_TOKEN_FROM_LOCALSTORAGE'
    }
  })
}).then(r => r.json()).then(console.log)
```

## Need More Help?

1. Check Firebase Console → Authentication → Users (should show your Google account)
2. Check Firebase Console → Functions → Logs (for backend errors)
3. Check `TEST_GOOGLE_AUTH.md` for OAuth configuration

## What the Fix Changed

### Before:
- Access token stored only in Redux state (in-memory)
- Page reload → Redux reset → access token lost
- User appears logged out even though Firebase says they're logged in

### After:
- Access token persisted to `localStorage`
- On page load, token retrieved from `localStorage` if user is logged in
- Token survives page reloads
- Token cleared on logout

### Files Modified:
1. `src/App.js` - Lines 67-72, 111-116, 133-135
   - Added `localStorage` persistence for access token
   - Retrieve token from `localStorage` on auth state change
   - Clear token on logout
