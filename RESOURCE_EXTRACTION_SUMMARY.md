# Resource Extraction Integration - Summary

## ✅ What We Built

You now have a complete system that extracts **individual links** from Google Docs and **individual videos** from YouTube playlists, then intelligently selects the most relevant ones for each AI-generated lesson plan.

## 🎯 The Problem We Solved

**Before**: Lesson plans only had links to entire Google Docs and full YouTube playlists
**Now**: Lesson plans include specific, relevant links and videos based on the lesson topic

## 📦 Components Created

### 1. Google Apps Script (`GOOGLE_APPS_SCRIPT.js`)
**Location**: Deployed at https://script.google.com/macros/s/AKfycbyrqpFiOWeQKrwcamq6DZQZmje3Z25GXOWrZCBih2q9LFRr_NLf-Wpf2KhsdpAFkZy2hA/exec

**What it does**:
- Reads Google Docs (warmups, curriculum, extra credit, description)
- Extracts all links with their text labels
- Fetches YouTube playlist videos with titles and descriptions
- Returns clean JSON data

**Permissions required**:
- Read Google Docs
- Access YouTube Data API

### 2. React Resource Extractor (`src/utils/courseResourceExtractor.js`)
**What it does**:
- Calls the Google Apps Script endpoint
- Extracts resources from multiple courses concurrently
- Calculates relevance scores based on keyword matching
- Selects top 15 most relevant resources
- Formats them for the AI prompt

**Key Functions**:
- `extractCourseResources(course)` - Extract all resources for one course
- `extractResourcesForCourses(courses, topic)` - Extract from multiple courses
- `selectRelevantResources(data, topic, max)` - Pick most relevant items
- `formatResourcesForPrompt(resources)` - Format for AI

### 3. Updated AI Generator (`src/utils/generateAIWarmUps.js`)
**What changed**:
- Now extracts resources from top 5 most relevant courses
- Adds extracted resources section to AI prompts
- AI receives specific links and videos instead of generic doc URLs

## 🔄 How It Works

```
1. User requests lesson plan on "Revolutionary War"
   ↓
2. System finds relevant courses (e.g., "US in the 1800s")
   ↓
3. Calls Google Apps Script to extract resources
   ↓
4. Gets back:
   - Links from warmups doc
   - Links from curriculum doc
   - Links from extra credit doc
   - Individual YouTube videos with titles
   ↓
5. Calculates relevance scores for each resource
   ↓
6. Selects top 15 most relevant items
   ↓
7. Formats them for AI prompt
   ↓
8. AI generates lesson plan with specific links/videos
```

## 📊 Example Output

### What the AI Now Receives:

```markdown
## RELEVANT RESOURCES FROM TEACHLEAGUE COURSES

The following resources were extracted from our course library and are relevant to this lesson:

### From "US in the 1800s" Course:

**Relevant Links:**
- [Primary Sources on the Revolutionary War](https://example.com/...) (from curriculum)
- [Battle of Yorktown Maps](https://example.com/...) (from extra)

**Relevant Videos:**
- [Causes of the American Revolution](https://youtube.com/watch?v=...)
  A 12-minute overview of taxation and colonial grievances
- [Boston Tea Party: What Really Happened](https://youtube.com/watch?v=...)
```

## 🚀 Testing It

### Step 1: Generate a Lesson Plan
1. Go to http://localhost:3000
2. Navigate to the Curriculum Generator
3. Select **OpenAI** as your provider (Gemini is rate-limited)
4. Enter: "Analyze primary sources to understand the Revolutionary War"
5. Click "Generate Lesson Plan"

### Step 2: Check the Console
Open browser Developer Tools (F12) and look for:
```
Extracting detailed resources from top courses...
✓ Found 15 relevant resources from course docs and videos
```

### Step 3: Review the Lesson Plan
The generated lesson plan should now include:
- Specific video titles (not just "YouTube playlist")
- Individual document links (not just "see curriculum")
- Resources matched to the lesson topic

## 🔍 Monitoring & Debugging

### Check Resource Extraction
The browser console shows:
- Which courses were selected
- How many resources were extracted
- Relevance scores for each

### Common Issues

**Issue**: No resources extracted
**Solution**: Check that Google Apps Script is deployed and URL is correct in `.env`

**Issue**: Google Apps Script returns error
**Solution**:
1. Check that the script has permissions
2. Verify docs are accessible (not private)
3. Check YouTube API quota

**Issue**: Resources not relevant
**Solution**: The relevance algorithm uses keyword matching - adjust the scoring in `courseResourceExtractor.js`

## 📈 Future Enhancements

Possible improvements:
1. **Cache extracted resources** in Firestore to avoid repeated API calls
2. **Use AI for relevance matching** instead of keyword scoring
3. **Add more resource types** (images, PDFs, etc.)
4. **Pre-extract all resources** in a background job
5. **User feedback loop** - learn which resources users find helpful

## 🔐 Security & Privacy

- Google Apps Script runs with your Google account permissions
- It only reads docs (never modifies)
- Web App URL is public but requires knowing the exact URL
- No sensitive data is exposed
- All data stays within Google/Firebase ecosystem

## 💰 Cost Considerations

- **Google Apps Script**: Free (within quotas)
- **YouTube Data API**: Free (10,000 units/day)
- **OpenAI API**: ~$0.001 per lesson plan (with gpt-4o-mini)
- **Gemini API**: Free tier available

## 🎓 Educational Impact

This integration makes lesson plans **significantly more useful** because:
- Teachers get specific resources they can immediately use
- Videos are pre-selected for relevance
- Links connect directly to the right content
- Saves teachers hours of searching for materials

## 📝 Configuration

All settings are in `.env`:
```bash
# Google Apps Script endpoint
REACT_APP_RESOURCE_EXTRACTOR_URL=https://script.google.com/...

# AI Provider settings
REACT_APP_DEFAULT_AI_PROVIDER=gemini
REACT_APP_OPENAI_KEY=sk-proj-...
REACT_APP_GEMINI_KEY=AIza...
```

## ✅ Verification Checklist

- [x] Google Apps Script deployed
- [x] Web App URL added to `.env`
- [x] React utility created
- [x] AI generator updated
- [x] Dev server restarted
- [ ] Test with Revolutionary War topic
- [ ] Verify extracted resources appear in lesson plan
- [ ] Check that resources are relevant

## 📞 Next Steps

1. **Test the integration** with a sample lesson
2. **Review generated lesson plans** to ensure quality
3. **Adjust relevance scoring** if needed
4. **Consider caching** resources to improve performance
5. **Monitor API usage** to stay within quotas

---

**Status**: ✅ Ready for Testing
**Last Updated**: 2025-11-13
