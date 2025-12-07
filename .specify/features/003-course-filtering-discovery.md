# Feature Specification: Course Filtering & Discovery

**Feature Branch**: `003-course-filtering-discovery`
**Created**: 2025-12-07
**Status**: Implemented
**Purpose**: Enable teachers to browse and filter course catalog by credit type, view course details, and discover relevant educational resources

## User Scenarios & Testing

### User Story 1 - Browse All Courses (Priority: P1)

A teacher visits the course directory and sees all available courses displayed as cards with title, description, credit type badge, and thumbnail image.

**Why this priority**: Course catalog is the entry point for discovering educational resources. Without it, teachers can't find relevant materials.

**Independent Test**: Navigate to /courses-directory. Verify all courses from Firestore are displayed with card UI, sorted by name.

**Acceptance Scenarios**:

1. **Given** teacher navigates to courses directory, **When** page loads, **Then** all courses display as cards with title, image, credit badge
2. **Given** courses are loading, **When** Firestore fetch is in progress, **Then** loading spinner displays
3. **Given** 50+ courses in database, **When** directory loads, **Then** all courses visible (no pagination needed yet)
4. **Given** course has no image, **When** card renders, **Then** placeholder image displays

---

### User Story 2 - Filter Courses by Credit Type (Priority: P1)

A teacher needs to find courses that satisfy specific credit requirements (e.g., Government credit, US History credit). They click credit type tags and see only matching courses.

**Why this priority**: Teachers work with specific curriculum requirements. Filtering by credit type is essential for finding relevant courses.

**Independent Test**: Click "Government Credit" tag. Verify only courses with creditType="governmentCredit" are displayed. Tag highlights in purple.

**Acceptance Scenarios**:

1. **Given** teacher is on course directory, **When** they click "World History" tag, **Then** only World History courses display
2. **Given** multiple credit types selected, **When** filters applied, **Then** courses matching ANY selected credit type display (OR logic)
3. **Given** credit tag is selected, **When** tag displays, **Then** background color fills (blue for WH, red for US History, green for Geography, purple for Government, orange for LA)
4. **Given** teacher clicks active tag again, **When** tag unselected, **Then** filter removed and all courses display again

---

### User Story 3 - View Course Details (Priority: P2)

A teacher clicks a course card and navigates to a detailed view showing full description, curriculum documents, YouTube playlists, warm-up questions, and extra resources.

**Why this priority**: Teachers need to evaluate course quality and resource availability before using in lesson plans.

**Independent Test**: Click "AP US History" course card. Verify navigation to /courses/[courseId] with full details, clickable resource links, embedded YouTube playlist.

**Acceptance Scenarios**:

1. **Given** teacher clicks course card, **When** detail page loads, **Then** full course description displays
2. **Given** course has curriculum doc URL, **When** detail page displays, **Then** "Curriculum Document" link is clickable and opens in new tab
3. **Given** course has YouTube playlist, **When** detail page displays, **Then** embedded playlist player shows
4. **Given** course has warm-ups doc, **When** detail page displays, **Then** "Warm-Up Questions" link displays with "Make a Copy" functionality

---

### User Story 4 - Featured Course Display (Priority: P3)

The homepage displays a featured course to highlight quality content and encourage exploration. Featured course rotates or is manually selected.

**Why this priority**: Drives engagement and discovery. Lower priority because browsing the full directory is primary discovery mechanism.

**Independent Test**: On homepage, verify one course is marked as featured and displays prominently with larger card UI.

**Acceptance Scenarios**:

1. **Given** course in Firestore has featured=true, **When** homepage loads, **Then** that course displays in Featured section
2. **Given** multiple courses have featured=true, **When** selector runs, **Then** one is selected randomly
3. **Given** no featured courses exist, **When** homepage loads, **Then** random course displays as featured
4. **Given** featured course displayed, **When** user clicks, **Then** navigates to course detail page

---

### Edge Cases

- **What happens when no courses match selected credit type?** (edge case: new credit type added, no courses yet)
  - Display message: "No courses found for selected credit types. Try selecting different filters."
  - Clear filters button displays

- **What happens when Firestore fetch fails?** (network error, permissions issue)
  - Error message displays: "Unable to load courses. Please refresh the page."
  - Retry button provided
  - No courses display (empty state)

- **What happens when course is missing required fields?** (no name, no creditType)
  - Course still displays with placeholder text ("Untitled Course")
  - Credit badge shows "Elective" as default
  - Logs warning to console for admin review

- **What happens when YouTube playlist URL is invalid?** (deleted playlist, wrong URL format)
  - Embedded player shows "Video unavailable" error
  - Rest of course details display normally
  - Does not break page rendering

- **What happens when "Make a Copy" link is for non-Google Doc URL?**
  - Button disabled or hidden
  - Only shows for docs.google.com URLs

## Requirements

### Functional Requirements

- **FR-001**: System MUST display all courses from Firestore on courses directory page
- **FR-002**: System MUST render each course as a card with title, description, image, credit badge
- **FR-003**: System MUST support filtering by credit types: World History, US History, Geography, Government, Language Arts, Electives, Mandatory
- **FR-004**: System MUST highlight selected credit type tags with filled background color
- **FR-005**: System MUST apply OR logic for multiple selected credit types (show courses matching ANY selected)
- **FR-006**: System MUST navigate to course detail page on card click
- **FR-007**: System MUST display full course details including:
  - Description
  - Curriculum document link (opens in new tab)
  - Warm-ups document link with "Make a Copy" functionality
  - Extra resources link
  - YouTube playlist (embedded player)
  - Additional playlists (extrayoutube, extrayoutube1)
- **FR-008**: System MUST display featured course on homepage
- **FR-009**: System MUST sort courses alphabetically by name in directory
- **FR-010**: System MUST show loading spinner during Firestore fetch
- **FR-011**: System MUST handle missing course fields gracefully (placeholders, defaults)
- **FR-012**: System MUST log errors when courses fail to load

### Non-Functional Requirements

- **NFR-001**: Course directory MUST load within 2 seconds (P95)
- **NFR-002**: Course cards MUST be responsive (mobile, tablet, desktop)
- **NFR-003**: Credit type colors MUST meet WCAG AA contrast requirements
- **NFR-004**: Course images MUST lazy-load (not all loaded at once)

### Key Entities

- **Course**: Educational course with metadata and resources
  - Attributes:
    - id (Firestore doc ID)
    - name (course title)
    - description (HTML-formatted text)
    - creditType (worldHistoryCredit, uSHistoryCredit, geographyCredit, governmentCredit, lACredit, electiveCredit, mandatoryCredit)
    - image (thumbnail URL, fallback to default)
    - curriculum (Google Doc URL)
    - warmups (Google Doc URL)
    - extra (Google Doc URL)
    - youtube (YouTube playlist URL)
    - extrayoutube (additional playlist URL)
    - extrayoutube1 (additional playlist URL)
    - featured (boolean, for homepage display)

- **CreditType**: Category for course classification
  - Values: worldHistoryCredit, uSHistoryCredit, geographyCredit, governmentCredit, lACredit, electiveCredit, mandatoryCredit
  - Colors:
    - worldHistoryCredit: Blue (rgb(137, 186, 239))
    - uSHistoryCredit: Red (rgb(254, 106, 106))
    - geographyCredit: Green (rgb(36, 215, 36))
    - governmentCredit: Purple (rgb(251, 70, 251))
    - lACredit: Orange

### UI/UX Requirements

- **UX-001**: Credit tag buttons MUST have border color matching credit type
- **UX-002**: Selected credit tags MUST fill with background color
- **UX-003**: Credit badges on course cards MUST use filled background
- **UX-004**: Course cards MUST have hover effect (shadow, slight scale)
- **UX-005**: "Make a Copy" links MUST be clearly labeled and distinguish from "View" links
- **UX-006**: YouTube embed MUST use responsive aspect ratio (16:9)

## Technical Architecture

### Components

**Pages** (`src/pages/`)
- `CoursesDirectoryPage.js` - Full course catalog with filtering
  - Fetches: All courses from Redux store
  - Filters: By selected credit types
  - Renders: CoursesList component with filtered courses

- `CourseDetailPage.js` - Individual course details
  - Params: courseId from URL (/courses/:courseId)
  - Fetches: Single course from Redux by ID
  - Renders: CourseDetail component

- `HomePage.js` - Homepage with featured course and lesson planner
  - Fetches: Featured course from Redux
  - Renders: FeaturedCourseDisplay, SimpleLessonPlanner

**Feature Components** (`src/features/courses/`)
- `CoursesList.js` - Displays list of course cards
  - Props: courses (array)
  - Renders: Grid of CourseCard components

- `CourseCard.js` - Individual course card UI
  - Props: course (object)
  - Displays: Title, description excerpt, image, credit badge
  - OnClick: Navigate to course detail page

- `CourseDetail.js` - Detailed course information
  - Props: course (object)
  - Displays: Full description, all resource links, YouTube embeds

- `FeaturedCourseDisplay.js` - Highlights featured course
  - Props: course (object)
  - Larger card UI with prominent placement

- `creditType/Tags.js` - Credit type filtering UI
  - State: selectedCreditTypes (array)
  - Renders: Buttons for each credit type
  - Emits: Filter changes to parent component

- `creditType/Credit.js` - Credit badge component
  - Props: creditType (string)
  - Renders: Styled badge with appropriate color

- `creditType/getClassCredit.js` - Utility for credit type styling
  - Returns: CSS class name for credit type

**Redux** (`src/features/courses/coursesSlice.js`)
- State:
  ```javascript
  {
    coursesArray: Course[],
    isLoading: boolean,
    errMsg: string
  }
  ```
- Selectors:
  - `selectAllCourses` - All courses
  - `selectCourseById(id)` - Single course
  - `selectFeaturedCourse` - Featured course (featured=true or random)
  - `selectRandomCourse` - Random course
  - Credit-specific selectors:
    - `selectGovernmentCourses`
    - `selectWorldHistoryCourses`
    - `selectUSHistoryCourses`
    - `selectGeographyCourses`
    - `selectLanguageArtsCourses`
- Async Thunks:
  - `fetchCourses` - Loads all courses from Firestore

**Utilities** (`src/utils/`)
- `makeCopyOfLinks.js` - Converts Google Doc URLs to "Make a Copy" links
  - Input: Google Docs URL
  - Output: URL that prompts "Make a Copy" dialog

- `mapImageURL.js` - Maps course images from Firebase Storage
  - Handles: Default placeholder if image missing

### Data Flow

```
1. App initialization: Dispatch fetchCourses() thunk
   ↓
2. Redux: Fetch courses collection from Firestore
   ↓
3. Redux: Store courses in coursesArray
   ↓
4. Component: Select courses from Redux store
   ↓
5. Component (CoursesDirectoryPage): Apply credit type filters
   ↓
6. Component (CoursesList): Render filtered courses as cards
   ↓
7. User clicks credit tag
   ↓
8. Component (Tags): Update selectedCreditTypes state
   ↓
9. Component (CoursesDirectoryPage): Re-filter courses
   ↓
10. Component (CoursesList): Re-render with new filtered list
```

### Constitution Compliance

- ✅ **Resource Attribution**: Courses credited to creators (not implemented yet, but structure supports)
- ✅ **Teacher Empowerment**: Easy discovery and evaluation of resources before use
- ✅ **Code Organization**: Proper separation (pages, features, components, utils)

## Implementation Notes

**Current Status**: Feature is fully implemented and deployed to production.

**Known Issues**:
- No pagination yet - all courses load at once (acceptable for <100 courses, may need pagination at scale)
- Course creator attribution not displayed (courses don't have creator field in Firestore)

**Future Enhancements**:
- Pagination or infinite scroll for large course catalogs
- Search by keyword (course title, description)
- Sort options (alphabetical, newest, most used)
- Course creator profiles and attribution
- Course ratings/reviews from teachers
- Bookmark/favorite courses functionality
- Recently viewed courses
- Recommended courses based on lesson plan history
