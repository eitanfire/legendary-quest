# TeachLeague Analytics Dashboard

Real-time analytics dashboard for monitoring AI lesson plan generation usage.

## Features

- **Real-time Overview**: Total requests, success rate, avg response time, total tokens
- **Time Series Graphs**: Request volume, response time trends over time
- **Distribution Charts**: Provider split (OpenAI vs Gemini), model usage, error types
- **Performance Metrics**: Token usage by provider, generation time analysis
- **Recent Activity Feed**: Last 20 requests with detailed metadata

## Tech Stack

- **Frontend**: Vanilla JavaScript with ES6 modules
- **Charts**: Chart.js 4.4.0
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Data Source**: Firebase Cloud Functions + Firestore
- **Build Tool**: Webpack 5

## Development

### Install Dependencies

```bash
cd dashboard
npm install
```

### Run Development Server

```bash
npm run dev
```

Opens at http://localhost:3002

### Build for Production

```bash
npm run build
```

Outputs to `dashboard/public/`

## Deployment

### 1. Configure Firebase Hosting Targets

Before deploying, you need to set up the hosting targets:

```bash
# Set up the dashboard subdomain
firebase target:apply hosting dashboard teach-league-dashboard

# Set up the main site
firebase target:apply hosting main teach-league
```

### 2. Deploy Dashboard Only

```bash
firebase deploy --only hosting:dashboard
```

### 3. Deploy Everything (Functions + Both Sites)

```bash
# First, rebuild the dashboard
cd dashboard && npm run build && cd ..

# Deploy functions and hosting
firebase deploy
```

### 4. Set Up Custom Domain (Optional)

In Firebase Console:
1. Go to Hosting
2. Click "Add custom domain"
3. Enter: `dashboard.teachleague.com`
4. Follow DNS verification steps

## Security

### Admin Access

Currently, any authenticated Google user can access the dashboard. To restrict access:

1. Update `functions/index.js` in the `getAnalytics` function
2. Uncomment the admin check code:

```javascript
const userDoc = await admin.firestore().collection('users').doc(request.auth.uid).get();
if (!userDoc.exists || !userDoc.data().isAdmin) {
  throw new HttpsError('permission-denied', 'User must be an admin to access analytics');
}
```

3. Create a `users` collection in Firestore
4. Add admin users with `{isAdmin: true}`

### Data Privacy

- Only shows data from users who opted in (analyticsConsent = true)
- Prompts are hashed, not stored in full
- Topics truncated to 500 characters
- 90-day TTL on all analytics data

## Troubleshooting

### Build Warnings

The webpack build shows warnings about bundle size (352 KB). This is expected due to Chart.js and Firebase SDK. To optimize:

- Consider code splitting for Chart.js
- Use Firebase modular SDK imports
- Enable tree shaking

### Authentication Errors

If login fails:
- Check Firebase Console > Authentication > Sign-in providers
- Ensure Google provider is enabled
- Verify authorized domains include your hosting URL

### No Data Showing

If dashboard loads but shows no data:
- Ensure users have opted in to analytics (checkbox in lesson planner)
- Check Firestore rules allow authenticated reads on `promptLogs`
- Verify Cloud Function deployed successfully: `firebase deploy --only functions:getAnalytics`

## File Structure

```
dashboard/
├── src/
│   ├── app.js          # Main application logic
│   ├── styles.css      # Dashboard styling
│   └── index.html      # HTML template
├── public/             # Build output (generated)
├── package.json        # Dependencies
├── webpack.config.js   # Build configuration
└── README.md          # This file
```

## Analytics Data Structure

The `getAnalytics` Cloud Function returns:

```javascript
{
  totalRequests: number,
  successfulRequests: number,
  failedRequests: number,
  successRate: number,
  providers: { openai: number, gemini: number },
  models: { [modelName]: number },
  avgGenerationTime: number,
  totalTokens: number,
  avgTokensPerRequest: number,
  errors: { [errorType]: number },
  timeline: {
    [date]: {
      requests: number,
      successes: number,
      failures: number,
      totalTime: number,
      totalTokens: number
    }
  },
  recentActivity: Array<{
    timestamp: string,
    topic: string,
    provider: string,
    model: string,
    success: boolean,
    generationTime: number,
    tokensUsed: number
  }>,
  tokensByProvider: { openai: number, gemini: number }
}
```

## Future Enhancements

- [ ] Cost estimation dashboard (calculate $ based on token usage)
- [ ] Email alerts for error rate spikes
- [ ] Export data to CSV
- [ ] Customizable date range picker
- [ ] Real-time updates (Firebase Realtime Database or polling)
- [ ] User-specific analytics (for teachers to see their own usage)
