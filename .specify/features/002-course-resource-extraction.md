# Feature Specification: Course Resource Extraction & Integration

**Feature Branch**: `002-course-resource-extraction`
**Created**: 2025-12-07
**Status**: Implemented
**Purpose**: Extract educational resources from Google Docs and YouTube playlists, score by relevance, and integrate with proper attribution

## User Scenarios & Testing

### User Story 1 - Extract Resources from Course Documents (Priority: P1)

The system needs to fetch all links and embedded content from a course's Google Docs (curriculum, warm-ups, description, extra resources) to provide teachers with relevant materials for lesson planning.

**Why this priority**: Without resource extraction, lesson plans would be generic and lack course-specific materials. This is the foundation of TeachLeague's value proposition.

**Independent Test**: Given a course with curriculum doc URL, system calls Google Apps Script and returns array of links with titles and URLs. Verify at least 10 links extracted from a typical curriculum document.

**Acceptance Scenarios**:

1. **Given** course has curriculum document URL, **When** extraction runs, **Then** system returns links array with {text, url, type}
2. **Given** Google Doc contains hyperlinks, **When** extracted, **Then** each link includes visible text and target URL
3. **Given** extraction succeeds, **When** results returned, **Then** Google Doc URL itself is included as a resource
4. **Given** multiple doc types (curriculum, warmups, extra), **When** extracted, **Then** each resource is tagged with docType

---

### User Story 2 - Extract Videos from YouTube Playlists (Priority: P1)

The system needs to fetch video metadata (title, URL, description) from course YouTube playlists to include video resources in lesson plans.

**Why this priority**: Videos are critical educational resources. Teachers need multimedia materials for diverse learners (UDL principles).

**Independent Test**: Given a course with YouTube playlist URL, system returns array of videos with titles, URLs, and descriptions. Verify minimum 5 videos from typical playlist.

**Acceptance Scenarios**:

1. **Given** course has YouTube playlist URL, **When** extraction runs, **Then** system returns videos array with {title, url, description}
2. **Given** playlist contains 20+ videos, **When** extracted, **Then** all videos are returned (no pagination issues)
3. **Given** video has description, **When** extracted, **Then** description is included for relevance scoring
4. **Given** multiple playlist fields (youtube, extrayoutube, extrayoutube1), **When** extracted, **Then** videos from all playlists are returned

---

### User Story 3 - Score Resources by Keyword Relevance (Priority: P1)

Given a lesson topic (e.g., "Civil War battles"), the system needs to rank extracted resources by relevance to ensure the most pertinent materials are selected for the lesson plan.

**Why this priority**: Courses may have 50+ resources. Without relevance scoring, lesson plans would include random or irrelevant materials.

**Independent Test**: Extract resources for "World War I". Verify that resources with "world war", "WWI", "trench warfare" in titles score higher than generic history resources.

**Acceptance Scenarios**:

1. **Given** topic "photosynthesis", **When** scoring links, **Then** links with "photosynthesis" in title get +15 points
2. **Given** topic "French Revolution", **When** scoring, **Then** partial matches (e.g., "France", "revolution") get +8 points
3. **Given** keyword in URL, **When** scoring, **Then** add +5 points to relevance score
4. **Given** two resources with equal keyword matches, **When** one is curriculum doc, **Then** curriculum doc scores +12 points higher

---

### User Story 4 - Enforce Balanced Resource Mix (Priority: P2)

The system must ensure lesson plans include a balanced mix of resource types (40% documents, 30% videos minimum) to support diverse learning styles and comply with UDL principles.

**Why this priority**: Constitution Principle III requires balanced resources. All-video or all-document lessons are pedagogically weak.

**Independent Test**: Generate lesson requiring 10 resources. Verify final selection has minimum 4 documents and 3 videos, even if videos score higher on relevance.

**Acceptance Scenarios**:

1. **Given** 10 resources requested, **When** selection runs, **Then** minimum 4 are documents (40%)
2. **Given** 10 resources requested, **When** selection runs, **Then** minimum 3 are videos (30%)
3. **Given** videos score higher than documents, **When** balancing enforced, **Then** lower-scoring documents are still included to meet quotas
4. **Given** not enough videos available, **When** selection runs, **Then** fill remaining slots with highest-scoring documents

---

### User Story 5 - Attribute Resources to Course Creators (Priority: P1)

Every resource in a lesson plan must be attributed to the original course creator with course name and document type, ensuring proper credit and building trust with educators.

**Why this priority**: Constitution Principle III mandates attribution. Without it, we violate intellectual property norms and lose educator trust.

**Independent Test**: Extract resources from "AP US History" course's curriculum doc. Verify each resource displays "From: AP US History - curriculum" in lesson plan.

**Acceptance Scenarios**:

1. **Given** resource from "World History" course, **When** formatted, **Then** displays "From 'World History' Course"
2. **Given** link from curriculum document, **When** displayed, **Then** shows doc type (e.g., "World History - Curriculum Document")
3. **Given** video from playlist, **When** displayed, **Then** shows "World History - YouTube"
4. **Given** multiple courses contribute resources, **When** displayed, **Then** resources are grouped by course name in lesson plan

---

### Edge Cases

- **What happens when Google Apps Script is unreachable?** (network timeout, service down)
  - System attempts 3 retries with 2-second intervals
  - If still failing, log error and proceed without resource extraction
  - Lesson plan displays warning: "Resource extraction unavailable. Lesson generated without course materials."

- **What happens when Google Doc is private/restricted?** (permission denied)
  - Google Apps Script returns empty links array
  - System treats as "no resources found" for that doc type
  - Proceeds with resources from other doc types

- **What happens when YouTube playlist is deleted/unavailable?**
  - Apps Script returns empty videos array
  - System proceeds with document resources only
  - If no resources at all, generates lesson without course materials

- **What happens when extracted links are malformed?** (missing http://, broken URLs)
  - System validates URLs using URL constructor
  - Invalid URLs are filtered out before scoring
  - Only well-formed URLs included in lesson plans

- **What happens when topic keywords don't match any resources?** (e.g., topic "Knitting" in history course)
  - All resources get base relevance score (+5 for links, +2 for videos)
  - Selection proceeds with highest base scores
  - No "no resources found" error - uses best available

- **What happens when course has no Google Docs or playlists?** (URLs are null/empty)
  - System skips extraction for that course
  - Moves to next relevant course in ranking
  - If top 5 courses all empty, proceeds without resources

## Requirements

### Functional Requirements

- **FR-001**: System MUST extract resources from Google Docs via Apps Script endpoint
- **FR-002**: System MUST extract videos from YouTube playlists via Apps Script
- **FR-003**: System MUST support extraction from 4 doc types: description, warmups, extra, curriculum
- **FR-004**: System MUST support extraction from 3 playlist types: youtube, extrayoutube, extrayoutube1
- **FR-005**: System MUST add Google Doc URL itself as a resource (not just links from inside the doc)
- **FR-006**: System MUST score resources by keyword relevance using topic keywords
- **FR-007**: System MUST enforce balanced resource mix (40% documents, 30% videos minimum)
- **FR-008**: System MUST attribute resources to original course (course name + doc type)
- **FR-009**: System MUST format resources for AI prompt with clear markdown structure
- **FR-010**: System MUST handle extraction errors gracefully (timeouts, permission denied, service down)
- **FR-011**: System MUST filter out malformed URLs before scoring
- **FR-012**: System MUST extract from top 5 relevant courses before selecting top 10 resources
- **FR-013**: System MUST bonus curriculum documents (+12), warmups (+8), extra (+6) in scoring
- **FR-014**: System MUST prioritize Google Docs (+8) and YouTube links (+4) over external links
- **FR-015**: System MUST log extraction results for debugging (resource count, course names)

### Relevance Scoring Algorithm

**Link Relevance Score**:
- Exact keyword match in title: +15 points per keyword
- Partial keyword match (5+ chars): +8 points per keyword
- Keyword in URL: +5 points per keyword
- Document type bonus:
  - Curriculum: +12 points
  - Warmups: +8 points
  - Extra: +6 points
- Link type bonus:
  - Google Doc: +8 points
  - YouTube: +4 points
- Base score: +5 points (all links)

**Video Relevance Score**:
- Exact keyword match in title: +20 points per keyword
- Partial keyword match (5+ chars): +10 points per keyword
- Keyword in description: +7 points per keyword
- Base score: +2 points (all videos)

**Keyword Extraction**:
- Split topic on whitespace
- Filter out words < 4 characters (e.g., "the", "and", "in")
- Convert to lowercase for matching

### Key Entities

- **ExtractedResource**: Collection of links and videos from a single course
  - Attributes: course (Course object), resources {description, warmups, extra, curriculum, youtube, extrayoutube, extrayoutube1}
  - Each resource type contains: links[] or videos[], url (doc/playlist URL)

- **Link**: Individual hyperlink extracted from Google Doc
  - Attributes: text (visible link text), url, type (google_doc, youtube, external), relevanceScore
  - Enhanced with: courseName, docType, source

- **Video**: Individual YouTube video from playlist
  - Attributes: title, url, description, relevanceScore
  - Enhanced with: courseName, playlistType, source

- **ScoredResource**: Link or Video with relevance score and attribution
  - Attributes: type (link/video), text/title, url, relevanceScore, courseName, docType/playlistType, source
  - Used for: Selection and formatting in lesson plans

### External Dependencies

- **Google Apps Script Endpoint**: `REACT_APP_RESOURCE_EXTRACTOR_URL`
  - Method: GET
  - Params: `action=extractAll&urls=doc1,doc2,...,playlist1,playlist2,...`
  - Returns: JSON object with resources per URL
  - Timeout: 10 seconds per course (Cloud Function timeout)

### Performance Considerations

- **PERF-001**: Extraction limited to top 5 courses (avoid overwhelming Apps Script)
- **PERF-002**: Extraction requests batched (single call with multiple URLs)
- **PERF-003**: Extraction timeout: 10 seconds per course, 50 seconds total
- **PERF-004**: Resource selection limited to 25 resources before scoring (avoid processing 100+ resources)
- **PERF-005**: Keyword matching uses simple string.includes() (avoid regex overhead)

### Security & Privacy

- **SEC-001**: Google Apps Script must validate URLs before fetching (prevent SSRF attacks)
- **SEC-002**: Extracted URLs must be validated on client before rendering (prevent XSS)
- **SEC-003**: Apps Script must sanitize extracted text (strip scripts, malicious content)
- **SEC-004**: CORS enabled on Apps Script to allow teachleague.com, Firebase domains

## Technical Architecture

### Components

**Frontend** (`src/utils/courseResourceExtractor.js`)
- `extractResourcesForCourses(courses, lessonTopic)` - Main extraction orchestrator
  - Inputs: courses (top 5 ranked), lessonTopic
  - Calls: Google Apps Script with course URLs
  - Returns: ExtractedResource[] with links and videos

- `selectRelevantResources(extractedResources, lessonTopic, maxItems)` - Score and select
  - Inputs: extracted resources, topic, max count (default 10)
  - Scores: All links and videos by keyword relevance
  - Enforces: Balanced mix (40% docs, 30% videos)
  - Returns: ScoredResource[] (top 10 by relevance)

- `formatResourcesForPrompt(resources)` - Format for AI
  - Groups resources by course name
  - Adds clear markdown headers and instructions
  - Returns: Markdown string for AI prompt

- `calculateLinkRelevance(link, topicKeywords)` - Score individual link
- `calculateVideoRelevance(video, topicKeywords)` - Score individual video

**External Service** (Google Apps Script)
- Endpoint: `https://script.google.com/macros/s/.../exec`
- Method: GET
- Params:
  - `action=extractAll`
  - `urls=https://docs.google.com/...,https://www.youtube.com/playlist?list=...`
- Response:
  ```json
  {
    "https://docs.google.com/...": {
      "links": [{"text": "...", "url": "..."}],
      "url": "https://docs.google.com/..."
    },
    "https://www.youtube.com/playlist?list=...": {
      "videos": [{"title": "...", "url": "...", "description": "..."}],
      "url": "https://www.youtube.com/..."
    }
  }
  ```

### Data Flow

```
1. Frontend: Rank courses by topic relevance
   ↓
2. Frontend: Select top 5 courses
   ↓
3. Frontend: Build URL list from courses:
   - course.description (Google Doc)
   - course.warmups (Google Doc)
   - course.extra (Google Doc)
   - course.curriculum (Google Doc)
   - course.youtube (YouTube playlist)
   - course.extrayoutube (YouTube playlist)
   - course.extrayoutube1 (YouTube playlist)
   ↓
4. Frontend: Call Google Apps Script with URLs
   ↓
5. Apps Script: Fetch each Google Doc
   ↓
6. Apps Script: Extract all hyperlinks with visible text
   ↓
7. Apps Script: Fetch YouTube playlists via YouTube Data API
   ↓
8. Apps Script: Return JSON with links and videos per URL
   ↓
9. Frontend: Parse response, add Google Doc URLs themselves as resources
   ↓
10. Frontend: Calculate relevance score for each resource
   ↓
11. Frontend: Sort resources by score (descending)
   ↓
12. Frontend: Enforce balanced mix (40% docs, 30% videos)
   ↓
13. Frontend: Select top 10 resources
   ↓
14. Frontend: Format resources with attribution for AI prompt
   ↓
15. Frontend: Include formatted resources in lesson plan prompt
```

### Constitution Compliance

- ✅ **Resource Attribution**: All resources credited with course name and doc type
- ✅ **Balanced Resources**: 40% docs, 30% videos enforced
- ✅ **Production-Ready**: No meta-commentary about resource selection in output
- ✅ **Security**: URLs validated, malicious content filtered

## Implementation Notes

**Current Status**: Feature is fully implemented and deployed to production.

**Known Issues**:
- Google Apps Script occasionally times out on large documents (>100 links)
  - Mitigation: 10-second timeout with retry logic
- YouTube API quota limits (10,000 units/day)
  - Mitigation: Apps Script caches playlist results for 1 hour

**Future Enhancements**:
- Cache extracted resources in Firestore (reduce Apps Script calls)
- Use TF-IDF for relevance scoring (more sophisticated than keyword matching)
- Support additional resource types (PDFs, presentations, external websites)
- Allow teachers to manually add/remove resources from lesson plans
- Track resource usage analytics (which resources most included in lessons)
