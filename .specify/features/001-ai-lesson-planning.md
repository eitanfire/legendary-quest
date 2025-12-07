# Feature Specification: AI-Powered Lesson Planning (Backward Design)

**Feature Branch**: `001-ai-lesson-planning`
**Created**: 2025-12-07
**Status**: Implemented
**Purpose**: Generate classroom-ready lesson plans using backward design methodology and course-specific resources

## User Scenarios & Testing

### User Story 1 - Basic Lesson Plan Generation (Priority: P1)

A teacher needs a complete lesson plan for teaching a specific topic or skill. They enter the topic (e.g., "Civil War causes and effects") and receive a backward-design lesson plan with objectives, assessment, and instruction phases, integrated with relevant course resources.

**Why this priority**: This is the core value proposition of TeachLeague. Without this, the platform has no purpose.

**Independent Test**: Teacher can input "French Revolution" and receive a complete, classroom-ready lesson plan with at least 5 specific resource links from the course library within 30 seconds.

**Acceptance Scenarios**:

1. **Given** teacher is on lesson planner page, **When** they enter "The water cycle" and click Generate, **Then** system returns lesson plan with OBJECTIVE → ASSESSMENT → INSTRUCTION structure
2. **Given** teacher enters a topic, **When** lesson plan is generated, **Then** plan includes 5-7 specific resource links with exact URLs and titles
3. **Given** lesson plan is displayed, **When** teacher reviews content, **Then** plan contains NO meta-commentary about which resources were excluded
4. **Given** multiple courses match the topic, **When** resources are selected, **Then** mix includes 40% documents and 30% videos minimum

---

### User Story 2 - Customized Lesson with Criteria (Priority: P1)

A teacher needs to generate a lesson plan that meets specific educational requirements (grade level, standards, district policies, UDL principles). They select criteria before generation and receive a customized plan aligned with those requirements.

**Why this priority**: Teachers work under strict educational standards and must differentiate for diverse learners. Generic plans aren't classroom-ready.

**Independent Test**: Teacher selects "9-12 grades", "Common Core Standards", and "UDL Principles" then generates a lesson on "Pythagorean Theorem". The output explicitly addresses these criteria.

**Acceptance Scenarios**:

1. **Given** teacher selects grades 6-8, **When** lesson is generated, **Then** activities and assessments are age-appropriate for middle school
2. **Given** teacher selects UDL principles, **When** lesson is generated, **Then** plan includes multiple means of representation, engagement, and expression
3. **Given** teacher selects a school district, **When** lesson is generated, **Then** standards references match that state's framework
4. **Given** teacher specifies standard (e.g., "CCSS.MATH.8.G.B.7"), **When** lesson is generated, **Then** objectives directly address that standard

---

### User Story 3 - AI Provider Selection & Fallback (Priority: P2)

A teacher generates a lesson, but their preferred AI provider (OpenAI) is experiencing rate limits. The system automatically falls back to the alternative provider (Gemini) without user intervention, ensuring continuous service.

**Why this priority**: Teachers work on deadlines. Service interruptions are unacceptable. This provides reliability.

**Independent Test**: Simulate OpenAI rate limit error. System should retry 3 times, then switch to Gemini and successfully return lesson plan.

**Acceptance Scenarios**:

1. **Given** OpenAI API returns 429 rate limit, **When** system retries, **Then** system attempts exponential backoff (1s, 2s, 4s)
2. **Given** OpenAI fails after 3 retries, **When** fallback triggers, **Then** system switches to Gemini and completes generation
3. **Given** both providers fail, **When** error occurs, **Then** user receives clear error message with retry button
4. **Given** generation succeeds on fallback, **When** response returns, **Then** UI indicates which provider was used (for debugging)

---

### User Story 4 - Resource Relevance & Attribution (Priority: P1)

A teacher generates a lesson on "Industrial Revolution labor conditions" and the system intelligently selects the most relevant resources from the course library, properly attributed to the original course creators, and meaningfully integrated into the lesson activities.

**Why this priority**: Constitution Principle III (Resource Attribution) is non-negotiable. Poor resource matching wastes teachers' time.

**Independent Test**: Generate lesson on "Photosynthesis". Verify that:
- Resources contain keywords like "photosynthesis", "plants", "chlorophyll"
- Each resource is attributed to original course (e.g., "From 'AP Biology' course")
- Resources appear in lesson activities, not just in Materials section

**Acceptance Scenarios**:

1. **Given** teacher inputs "Electoral College", **When** resources are selected, **Then** titles/descriptions contain electoral, voting, election keywords
2. **Given** resources are extracted, **When** relevance is scored, **Then** exact keyword matches score higher than partial matches
3. **Given** curriculum documents exist, **When** scoring occurs, **Then** curriculum docs receive +12 bonus points
4. **Given** lesson plan is generated, **When** resources are displayed, **Then** each link shows course name and document type (e.g., "US History - Curriculum Document")

---

### User Story 5 - Multi-Course Resource Integration (Priority: P2)

A teacher generates a lesson on "Climate change policy" which spans multiple courses (Geography, Government, Science). The system extracts resources from all relevant courses and presents them grouped by course.

**Why this priority**: Interdisciplinary topics require resources from multiple domains. This enables richer, more comprehensive lessons.

**Independent Test**: Generate lesson on "Immigration policy". Resources should come from at least 2 courses (e.g., US History, Government, Geography).

**Acceptance Scenarios**:

1. **Given** topic spans multiple subjects, **When** courses are ranked, **Then** top 5 most relevant courses are selected for resource extraction
2. **Given** resources from multiple courses, **When** they are displayed in lesson, **Then** they are grouped by course name
3. **Given** 25+ resources extracted, **When** selection occurs, **Then** final lesson includes top 10 by relevance score
4. **Given** resources from different courses, **When** balanced mix is enforced, **Then** output has 40% docs, 30% videos, regardless of source course

---

### Edge Cases

- **What happens when no courses match the topic?** (e.g., "Knitting techniques")
  - System generates lesson using AI general knowledge only
  - Warning displayed: "No course resources found. Lesson generated without course-specific materials."
  - No broken links or attribution errors

- **What happens when Google Apps Script resource extractor is down?**
  - System attempts to fetch from cached resources in Firestore
  - If cache miss, proceeds without resource extraction
  - User sees: "Resource extraction temporarily unavailable. Lesson generated without course materials."

- **What happens when user inputs extremely long or complex topic?** (500+ characters)
  - Input is truncated to 500 characters
  - Warning: "Topic shortened to 500 characters for optimal AI processing"
  - Generation proceeds normally

- **What happens when AI returns markdown with embedded scripts/HTML?**
  - Markdown renderer sanitizes output (react-markdown with rehype-sanitize)
  - Scripts and malicious HTML are stripped
  - Links are preserved and rendered as clickable

- **What happens when lesson generation takes > 30 seconds?**
  - Loading spinner with progress message
  - If > 60 seconds, timeout warning displayed
  - User can cancel and retry

## Requirements

### Functional Requirements

- **FR-001**: System MUST generate lesson plans using backward design structure: OBJECTIVE → KEY POINTS → MATERIALS → ASSESSMENT → OPENING → INTRODUCTION → GUIDED PRACTICE → INDEPENDENT PRACTICE → CLOSING
- **FR-002**: System MUST integrate minimum 5-7 specific resource links with exact titles and URLs
- **FR-003**: System MUST extract 25+ resources from top 5 relevant courses before selecting top 10 by relevance
- **FR-004**: System MUST attribute all resources to original course creators (course name + document type)
- **FR-005**: System MUST enforce balanced resource mix (40% documents, 30% videos minimum)
- **FR-006**: System MUST support optional criteria: grade levels, educational standards, school district, UDL principles
- **FR-007**: System MUST use secure Cloud Functions for AI API calls (no client-side API keys)
- **FR-008**: System MUST provide fallback between OpenAI and Gemini providers
- **FR-009**: System MUST retry failed AI requests 3 times with exponential backoff (1s, 2s, 4s)
- **FR-010**: System MUST display generated lesson in markdown format with proper headings, lists, and links
- **FR-011**: System MUST exclude meta-commentary about unused resources or generation process
- **FR-012**: System MUST validate that output is production-ready for classroom use
- **FR-013**: System MUST calculate resource relevance using keyword matching: exact match (+15 points) > partial match (+8) > base (+5)
- **FR-014**: System MUST bonus curriculum documents (+12 points), warm-ups (+8), extra resources (+6)
- **FR-015**: System MUST track and display token usage for cost monitoring

### Non-Functional Requirements

- **NFR-001**: Lesson generation MUST complete within 30 seconds (P95)
- **NFR-002**: System MUST handle 100 concurrent lesson generation requests
- **NFR-003**: Resource extraction MUST timeout after 10 seconds per course
- **NFR-004**: Generated lesson plans MUST be 1,500-3,000 words
- **NFR-005**: AI responses MUST be sanitized to prevent XSS attacks
- **NFR-006**: System MUST log all AI provider failures for monitoring

### Key Entities

- **Lesson Plan**: Generated educational document containing backward design sections, objectives, assessment criteria, instructional activities, and attributed resources
  - Attributes: topic, criteriaUsed (grades, standards, district, UDL), generatedDate, provider, tokensUsed, content (markdown)

- **Course**: Educational course containing curriculum documents, warm-up questions, YouTube playlists, and metadata
  - Attributes: name, creditType, description, curriculum (URL), warmups (URL), extra (URL), youtube (URL), extrayoutube (URL)
  - Used for: Resource extraction and relevance ranking

- **Resource**: Individual educational material extracted from course documents or playlists
  - Attributes: type (link/video), text/title, url, relevanceScore, courseName, docType/playlistType
  - Used for: Integration into lesson plans with proper attribution

- **AI Generation Request**: Server-side API call to OpenAI or Gemini
  - Attributes: prompt, provider, model, systemPrompt, timestamp
  - Returns: content, tokensUsed, provider, timestamp

- **Resource Extraction Result**: Response from Google Apps Script containing links and videos from course materials
  - Attributes: course, resources {description, warmups, extra, curriculum, youtube}
  - Each resource contains: links[], videos[], url

### Security & Privacy

- **SEC-001**: API keys (OPENAI_KEY, GEMINI_KEY) MUST be stored in Google Cloud Secret Manager
- **SEC-002**: Cloud Functions MUST use CORS to restrict access to teachleague.com, Firebase domains, localhost
- **SEC-003**: User input MUST be sanitized before sending to AI providers (remove potentially harmful prompts)
- **SEC-004**: Lesson plan output MUST be sanitized before rendering (prevent XSS)
- **SEC-005**: Firebase service account MUST have minimal permissions (functions only)

### Performance Considerations

- **PERF-001**: Course relevance ranking limited to top 10 courses (avoid processing all 50+ courses)
- **PERF-002**: Resource extraction parallelized across courses (fetch 5 courses concurrently)
- **PERF-003**: Firestore queries use indexed fields (creditType, featured, name)
- **PERF-004**: AI provider selection prefers faster models (gpt-4o-mini, gemini-1.5-flash)
- **PERF-005**: Generated content cached in user session (avoid re-generation on navigation)

## Technical Architecture

### Components

**Frontend** (`src/components/`, `src/pages/`)
- `SimpleLessonPlanner.jsx` - Compact lesson planner (homepage)
- `GenerateWarmUp.jsx` - Full-featured planner with all criteria options
- `LessonPlanDisplay.jsx` - Markdown renderer for generated plans

**Backend** (`functions/index.js`)
- `generateCurriculum` - Cloud Function v2 callable endpoint
  - Inputs: prompt, provider, systemPrompt, model
  - Outputs: content, provider, tokensUsed, timestamp
  - Providers: OpenAI (gpt-4o-mini), Gemini (gemini-1.5-flash, gemini-2.0-flash-exp)

**Business Logic** (`src/utils/`)
- `generateAIWarmUps.js` - Orchestrates lesson generation workflow
  - Ranks courses by relevance (keyword matching + credit type)
  - Extracts resources from top 5 courses
  - Selects relevant resources (keyword matching + type bonuses)
  - Formats resources for AI prompt
  - Constructs backward design prompt
  - Calls Cloud Function with retry/fallback logic

- `aiProviderFactory.js` - AI provider abstraction layer
  - Manages provider selection (OpenAI default, Gemini fallback)
  - Handles retry logic with exponential backoff
  - Detects rate limits and switches providers
  - Formats responses with token usage

- `courseResourceExtractor.js` - Resource extraction and scoring
  - Fetches resources from Google Apps Script
  - Adds Google Doc URLs themselves as resources
  - Scores resources by keyword relevance
  - Enforces balanced mix (40% docs, 30% videos)
  - Formats resources for AI prompt with attribution

**External Services**
- Google Apps Script (REACT_APP_RESOURCE_EXTRACTOR_URL)
  - Endpoint: `/exec?action=extractAll&urls=...`
  - Returns: Course resources (links, videos, metadata)

- OpenAI API (via Cloud Function)
  - Model: gpt-4o-mini (configurable)
  - Max tokens: 16000

- Google Gemini API (via Cloud Function)
  - Models: gemini-1.5-flash, gemini-2.0-flash-exp
  - Max tokens: 8192

### Data Flow

```
1. User inputs topic + criteria
   ↓
2. Frontend: Fetch all courses from Firestore
   ↓
3. Frontend: Rank courses by relevance (keyword matching + credit type)
   ↓
4. Frontend: Select top 5 courses
   ↓
5. Frontend: Call Google Apps Script to extract resources from courses
   ↓
6. Frontend: Score and select top 10 resources (keyword relevance + type bonuses)
   ↓
7. Frontend: Format resources with attribution (course name + doc type)
   ↓
8. Frontend: Build backward design prompt with resources embedded
   ↓
9. Frontend: Call Cloud Function (generateCurriculum)
   ↓
10. Backend: Cloud Function calls OpenAI API
   ↓
11. Backend: If OpenAI fails, retry 3x with backoff
   ↓
12. Backend: If still failing, switch to Gemini and retry
   ↓
13. Backend: Return {content, provider, tokensUsed}
   ↓
14. Frontend: Render lesson plan in markdown with sanitization
   ↓
15. Frontend: Display provider used and token count
```

### Constitution Compliance

- ✅ **Teacher Empowerment**: Lesson plans are editable, customizable, transparent about sources
- ✅ **Backward Design**: Enforced structure (OBJECTIVE → ASSESSMENT → INSTRUCTION)
- ✅ **Resource Attribution**: All resources credited with course name and URLs
- ✅ **Security & Privacy**: API keys server-side, no client-side secrets
- ✅ **Production-Ready**: No meta-commentary, classroom-ready output

## Implementation Notes

**Current Status**: Feature is fully implemented and deployed to production.

**Known Issues**: None blocking. Minor optimization opportunities exist:
- Resource extraction could be cached in Firestore for faster generation
- Relevance scoring could use TF-IDF instead of simple keyword matching
- AI prompts could be A/B tested for quality improvements

**Future Enhancements**:
- Save generated lesson plans to user account
- Share lesson plans via public URL
- Export lesson plans as PDF
- User ratings/feedback on lesson quality
- Fine-tuned AI model specific to educational content
