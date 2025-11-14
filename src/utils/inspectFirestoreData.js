/**
 * Firestore Data Inspector
 *
 * This utility script helps you inspect what data is currently stored in Firestore
 * for your courses, specifically looking at Google Docs and YouTube links.
 *
 * To use this:
 * 1. Import this in a component that loads on startup (like App.js)
 * 2. Call inspectCourseData(courses) after courses are loaded
 * 3. Check the browser console for the output
 */

/**
 * Inspect a single course for its resource links
 */
export function inspectCourse(course) {
  console.log(`\n=== Course: ${course.name} (ID: ${course.id}) ===`);

  // Check Google Docs properties
  const googleDocsProps = ['description', 'warmups', 'extra', 'curriculum'];
  googleDocsProps.forEach(prop => {
    if (course[prop]) {
      const value = course[prop];
      const isUrl = typeof value === 'string' && value.includes('http');
      console.log(`${prop}:`, isUrl ? `[URL] ${value.substring(0, 50)}...` : `[TEXT] ${value.substring(0, 50)}...`);
    } else {
      console.log(`${prop}: [NOT SET]`);
    }
  });

  // Check YouTube properties
  const youtubeProps = ['youtube', 'extrayoutube', 'extrayoutube1'];
  youtubeProps.forEach(prop => {
    if (course[prop]) {
      console.log(`${prop}: [URL] ${course[prop]}`);
    } else {
      console.log(`${prop}: [NOT SET]`);
    }
  });

  // Check for any additional link-related properties
  const allProps = Object.keys(course);
  const linkProps = allProps.filter(key =>
    typeof course[key] === 'string' &&
    (course[key].includes('http') || course[key].includes('docs.google'))
  );

  if (linkProps.length > 0) {
    console.log('\nAll properties containing URLs:');
    linkProps.forEach(prop => {
      console.log(`  - ${prop}: ${course[prop]}`);
    });
  }

  // Check for arrays of links (in case links are stored as arrays)
  const arrayProps = allProps.filter(key => Array.isArray(course[key]));
  if (arrayProps.length > 0) {
    console.log('\nArray properties (might contain links):');
    arrayProps.forEach(prop => {
      console.log(`  - ${prop}:`, course[prop]);
    });
  }
}

/**
 * Inspect all courses
 */
export function inspectCourseData(courses) {
  console.log('========================================');
  console.log('FIRESTORE COURSE DATA INSPECTION');
  console.log('========================================');
  console.log(`Total courses: ${courses.length}`);

  // Summary statistics
  const stats = {
    withDescription: 0,
    withWarmups: 0,
    withExtra: 0,
    withCurriculum: 0,
    withYoutube: 0,
    withExtraYoutube: 0,
    withExtraYoutube1: 0
  };

  courses.forEach(course => {
    if (course.description) stats.withDescription++;
    if (course.warmups) stats.withWarmups++;
    if (course.extra) stats.withExtra++;
    if (course.curriculum) stats.withCurriculum++;
    if (course.youtube) stats.withYoutube++;
    if (course.extrayoutube) stats.withExtraYoutube++;
    if (course.extrayoutube1) stats.withExtraYoutube1++;
  });

  console.log('\n=== Summary Statistics ===');
  console.log('Courses with Google Docs:');
  console.log(`  - description: ${stats.withDescription}/${courses.length}`);
  console.log(`  - warmups: ${stats.withWarmups}/${courses.length}`);
  console.log(`  - extra: ${stats.withExtra}/${courses.length}`);
  console.log(`  - curriculum: ${stats.withCurriculum}/${courses.length}`);
  console.log('\nCourses with YouTube:');
  console.log(`  - youtube: ${stats.withYoutube}/${courses.length}`);
  console.log(`  - extrayoutube: ${stats.withExtraYoutube}/${courses.length}`);
  console.log(`  - extrayoutube1: ${stats.withExtraYoutube1}/${courses.length}`);

  // Detailed inspection of first 3 courses with data
  console.log('\n=== Detailed Inspection (First 3 Courses with Data) ===');
  const coursesWithData = courses.filter(c =>
    c.description || c.warmups || c.extra || c.curriculum || c.youtube
  );

  coursesWithData.slice(0, 3).forEach(course => {
    inspectCourse(course);
  });

  // Check if any courses have extracted links stored
  console.log('\n=== Checking for Pre-Extracted Links ===');
  const possibleLinkProps = ['links', 'extractedLinks', 'resources', 'resourceLinks',
    'warmupLinks', 'extraLinks', 'curriculumLinks', 'youtubeVideos', 'videos'];

  let foundExtractedLinks = false;
  courses.forEach(course => {
    possibleLinkProps.forEach(prop => {
      if (course[prop]) {
        console.log(`Found "${prop}" in course "${course.name}":`, course[prop]);
        foundExtractedLinks = true;
      }
    });
  });

  if (!foundExtractedLinks) {
    console.log('❌ No pre-extracted links found in Firestore');
    console.log('   Courses only contain URLs to Google Docs and YouTube playlists');
    console.log('   You will need to extract individual links from these resources');
  } else {
    console.log('✅ Found pre-extracted links in Firestore!');
  }

  console.log('\n========================================');
}

/**
 * Extract Google Doc ID from URL
 */
export function extractGoogleDocId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

/**
 * Extract YouTube Playlist ID from URL
 */
export function extractPlaylistId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/[?&]list=([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

export default inspectCourseData;
