# Google OAuth Diagnostic Checklist

## ✅ Things to verify:

### 1. Firebase Console - Google Sign-In Provider
- [ ] Go to: https://console.firebase.google.com/project/teach-league/authentication/providers
- [ ] Check if "Google" provider shows as **Enabled** (should have green toggle)
- [ ] Support email should be: `eitanfire@gmail.com`

### 2. Google Cloud Console - OAuth Consent Screen
- [ ] Go to: https://console.cloud.google.com/apis/credentials/consent?project=teach-league
- [ ] **Publishing status** at top should say: **"Testing"**
- [ ] **Test users** section should list: `eitanfire@gmail.com`
- [ ] **Scopes** section should include: `https://www.googleapis.com/auth/drive.readonly`

### 3. Google Cloud Console - OAuth Credentials
- [ ] Go to: https://console.cloud.google.com/apis/credentials?project=teach-league
- [ ] Should see an OAuth 2.0 Client ID (created automatically by Firebase)
- [ ] Authorized JavaScript origins should include: `http://localhost:3000`
- [ ] Authorized redirect URIs should include: `http://localhost/__/auth/handler`

### 4. Cloud Functions Deployment
- [ ] Run: `firebase deploy --only functions:setupDriveFolder,functions:searchGoogleDrive`
- [ ] Should see success message for both functions

### 5. Test Sign-In
- [ ] Clear browser cookies/cache OR use incognito window
- [ ] Go to: http://localhost:3000
- [ ] Click "Login" button
- [ ] Click "Sign in with Google (enables Drive search)"
- [ ] Should see Google account picker
- [ ] Select `eitanfire@gmail.com`
- [ ] May see "This app isn't verified" - click "Advanced" → "Go to teach-league (unsafe)"
- [ ] Should see permission request for Drive access
- [ ] Click "Allow"
- [ ] Should redirect back to app and be logged in

## Common Error Messages & Solutions

### "Access blocked: teach-league.firebaseapp.com has not completed the Google verification process"
**Solution:** Add yourself as test user (you've done this!)

### "Error 400: redirect_uri_mismatch"
**Solution:** Check authorized redirect URIs in OAuth credentials

### "auth/popup-closed-by-user"
**Solution:** User closed the popup - not a real error, just try again

### "auth/unauthorized-domain"
**Solution:** Add domain to authorized domains in Firebase console

## What to share if it still doesn't work:

1. Publishing status (Testing / In production / etc)
2. Full error message from browser console
3. Screenshot of test users section
4. Whether functions deployed successfully
