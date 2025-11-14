# Google Apps Script Setup Guide

## Overview

This guide will help you set up a Google Apps Script that extracts individual links from your course Google Docs and individual videos from YouTube playlists. This extracted data will then be used in your AI-generated lesson plans.

## Why We Need This

Currently, your Firestore only has URLs to full Google Docs and YouTube playlists. To include **specific relevant links** in lesson plans, we need to:

1. **Extract all links** from your Google Docs (warmups, curriculum, extra credit, description)
2. **Extract individual videos** from YouTube playlists with titles and descriptions
3. **Make this data available** to your React app via a simple API

## Step 1: Create the Google Apps Script

1. **Open Google Apps Script**
   - Go to https://script.google.com
   - Make sure you're logged in with the same Google account that owns your TeachLeague Google Docs

2. **Create New Project**
   - Click "+ New Project"
   - Name it: "TeachLeague Resource Extractor"

3. **Copy the Code**
   - Open the file `GOOGLE_APPS_SCRIPT.js` in your project folder
   - Copy ALL the code
   - Paste it into the Code.gs editor in Google Apps Script (replace any existing code)

## Step 2: Enable YouTube Data API

1. **Click on "Services" (+)**
   - In the left sidebar of the Apps Script editor, click the "+" icon next to "Services"

2. **Add YouTube Data API v3**
   - Search for "YouTube Data API v3"
   - Select it
   - Click "Add"
   - Keep the identifier as "YouTube"

## Step 3: Test the Script (Optional but Recommended)

1. **Select the Test Function**
   - In the toolbar dropdown, select `testExtraction`
   - Click the "Run" button (▶️)

2. **Authorize the Script**
   - You'll be prompted to authorize the script
   - Click "Review Permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to TeachLeague Resource Extractor (unsafe)"
   - Click "Allow"

3. **View Results**
   - Click "Execution log" at the bottom
   - You should see extracted links and videos from the Film course
   - If you see errors, check that your Google Docs are accessible

## Step 4: Deploy as Web App

1. **Click "Deploy" → "New deployment"**

2. **Configure Deployment**
   - Type: **Web app**
   - Description: "TeachLeague Resource Extractor v1"
   - Execute as: **Me** (your Google account)
   - Who has access: **Anyone**
     - ⚠️ Important: Select "Anyone" so your React app can call it
     - The script is read-only and won't expose sensitive data

3. **Deploy**
   - Click "Deploy"
   - Copy the **Web App URL** (it will look like: `https://script.google.com/macros/s/ABC.../exec`)

## Step 5: Add Web App URL to Your React App

1. **Open `.env` file** in your project root

2. **Add this line** (replace with your actual URL):
   ```
   REACT_APP_RESOURCE_EXTRACTOR_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

3. **Restart your development server**
   ```bash
   npm start
   ```

## Step 6: Verify It Works

1. **Test the endpoint** by visiting this URL in your browser:
   ```
   YOUR_WEB_APP_URL?type=playlist&playlistId=PLhwsqXANwnd3iClUxi6_5BDGKUZqSy8dJ
   ```

2. **You should see JSON response** like:
   ```json
   {
     "success": true,
     "videos": [
       {
         "title": "Video Title",
         "videoId": "abc123",
         "url": "https://www.youtube.com/watch?v=abc123",
         ...
       }
     ]
   }
   ```

## Permissions Required

The script needs these permissions:
- ✅ **Read your Google Docs** - To extract links from course documents
- ✅ **Access YouTube Data API** - To fetch playlist videos
- ✅ **Run as a web app** - So your React app can call it

## Privacy & Security

- The script only **reads** your Google Docs (it doesn't modify them)
- It only extracts **links and titles** (no personal data)
- The web app URL is public but requires knowing the exact URL to use
- You can revoke access anytime from your Google Account settings

## Troubleshooting

### Error: "Authorization required"
- Re-run the test function and complete authorization again
- Make sure you're logged in with the correct Google account

### Error: "Document not found"
- Check that your Google Docs are not restricted to specific users
- Make the docs "Anyone with the link can view" if they're currently private

### Error: "YouTube quota exceeded"
- YouTube API has daily quotas
- If you hit the limit, wait 24 hours or request quota increase from Google

### Web app returns empty data
- Check that your course Google Docs and playlists are publicly accessible
- Verify the doc IDs and playlist IDs are correct

## Next Steps

Once you've deployed the script:
1. The React app will automatically start using it
2. When generating lesson plans, it will extract relevant links
3. The AI will select only the most relevant resources for each lesson
4. Your lesson plans will have specific, targeted resources instead of generic doc links

## Updating the Script

If you need to update the script later:
1. Make changes in the Apps Script editor
2. Click "Deploy" → "Manage deployments"
3. Click the edit icon (pencil) next to your deployment
4. Update the version or description
5. Click "Deploy"
6. The Web App URL stays the same (no need to update `.env`)
