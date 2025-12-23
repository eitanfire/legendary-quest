# Debug Authentication

Open browser console (F12) and run these commands:

```javascript
// Check if user is logged in with Firebase
firebase.auth().currentUser

// Check Redux state
window.store.getState().user

// Check if we have the access token
window.store.getState().user.currentUser?.googleAccessToken
```

Let me know what you see!
