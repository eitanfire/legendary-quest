# Google Apps Script Redeployment Instructions

## What Changed

I've updated the Google Apps Script with better error handling and debugging. The script now:
- Logs detailed information about what it's extracting
- Reports errors instead of silently returning empty arrays
- Helps diagnose permission and authorization issues

## Steps to Redeploy

### 1. Open Your Existing Script
1. Go to https://script.google.com
2. Open your "TeachLeague Resource Extractor" project

### 2. Update the Code
1. Open the [GOOGLE_APPS_SCRIPT.js](GOOGLE_APPS_SCRIPT.js) file in this project folder
2. **Select ALL the code** (Cmd+A or Ctrl+A)
3. **Copy it** (Cmd+C or Ctrl+C)
4. Go back to the Google Apps Script editor
5. **Select all existing code** in Code.gs
6. **Paste the new code** to replace it (Cmd+V or Ctrl+V)
7. Click **Save** (disk icon or Cmd+S)

### 3. Re-run the Test Function (IMPORTANT)
This step re-authorizes the script after adding YouTube Data API v3:

1. In the toolbar dropdown, select **`testExtraction`** (NOT `doGet` - that will fail!)
2. Click the **Run** button (▶️)
3. You may be prompted to **authorize again** - this is normal after adding new services
4. Click **Review Permissions**
5. Choose your Google account
6. Click **Advanced** → **Go to TeachLeague Resource Extractor (unsafe)**
7. Click **Allow**
8. Wait for the test to complete

**Note**: If you see an error like "Cannot read properties of undefined (reading 'parameter')", that means you tried to run `doGet` instead of `testExtraction`. The `doGet` function is only called by HTTP requests from your web app, not directly in the editor.

**Alternative Tests**: You can also run these simpler tests:
- **`testYouTubeOnly`** - Only tests YouTube API (faster, good for debugging)
- **`testDocOnly`** - Only tests Google Docs reading (faster, good for debugging)

### 4. Check the Execution Log
1. Click **Execution log** at the bottom of the screen
2. You should see detailed logs like:
   ```
   === Extracting resources for course: Film ===
   Attempting to extract links from doc: 1yR1lESYS7ZWYixmg3kjDqU4PGZwXBjFEgef_vt8vqZk
   Found 23 paragraphs in doc
   Extracted 15 links from doc 1yR1lESYS7ZWYixmg3kjDqU4PGZwXBjFEgef_vt8vqZk
   Attempting to extract playlist: PLhwsqXANwnd3iClUxi6_5BDGKUZqSy8dJ
   Fetching page 1 for playlist PLhwsqXANwnd3iClUxi6_5BDGKUZqSy8dJ
   Received 50 items
   Total videos extracted: 50
   ```

3. **If you see errors**, check:
   - **"YouTube service not available"** → YouTube Data API v3 not added (go to Services and add it)
   - **"Document not found"** → Google Docs need to be publicly accessible (anyone with link can view)
   - **"Permission denied"** → Re-run authorization in step 3

### 5. Redeploy (Optional - Only if URL Changed)
If you created a NEW deployment instead of updating the existing one, you'll need a new URL:

1. Click **Deploy** → **New deployment**
2. Type: **Web app**
3. Description: "TeachLeague Resource Extractor v2"
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Click **Deploy**
7. Copy the new **Web App URL**
8. Update your `.env` file with the new URL

**However**, if you want to keep the same URL:
1. Click **Deploy** → **Manage deployments**
2. Click the **edit icon** (pencil) next to your existing deployment
3. Version: **New version**
4. Click **Deploy**
5. Your URL stays the same (no need to update `.env`)

## Testing the Updated Script

After redeploying, test the endpoint directly:

```bash
# Test playlist extraction
curl -sL "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?type=playlist&playlistId=PLhwsqXANwnd3iClUxi6_5BDGKUZqSy8dJ"
```

You should now see either:
- **Success**: A JSON response with videos
- **Error with details**: A clear error message explaining what went wrong

## Common Issues & Solutions

### Issue: Still getting empty arrays
**Solution**:
- Make sure you re-ran the test function to re-authorize
- Check Google Docs are set to "Anyone with the link can view"
- Verify YouTube Data API v3 is added under Services

### Issue: "YouTube service not available"
**Solution**:
1. Click the **+ icon next to "Services"** in the left sidebar
2. Search for **"YouTube Data API v3"**
3. Click **Add**
4. Re-run the test function

### Issue: "Document not found" or "Permission denied"
**Solution**:
1. Open each Google Doc (description, warmups, curriculum, extra)
2. Click **Share**
3. Change to **"Anyone with the link"** → **"Viewer"**
4. Re-run the test

## Next Steps

Once the script is redeployed and tested:
1. Restart your React dev server (if it's running)
2. Generate a new lesson plan
3. Check the browser console for detailed extraction logs
4. The lesson plan should now include individual links and videos

---

**Need Help?**
Check the execution logs in Google Apps Script for detailed error messages. The new logging will show exactly where the extraction is failing.
