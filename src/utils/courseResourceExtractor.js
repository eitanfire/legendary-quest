/**
 * Course Resource Extractor
 *
 * Fetches extracted links from Google Docs and YouTube videos from playlists
 * using the Google Apps Script endpoint
 */

const EXTRACTOR_URL = process.env.REACT_APP_RESOURCE_EXTRACTOR_URL;

/**
 * Extract all resources for a course
 */
export async function extractCourseResources(course) {
  if (!EXTRACTOR_URL) {
    console.warn('Resource extractor URL not configured');
    return null;
  }

  try {
    console.log(`📥 Extracting resources for course: ${course.name}`);
    console.log('  - YouTube:', course.youtube ? 'Yes' : 'No');
    console.log('  - Warmups:', course.warmups ? 'Yes' : 'No');
    console.log('  - Curriculum:', course.curriculum ? 'Yes' : 'No');

    const courseData = encodeURIComponent(JSON.stringify({
      id: course.id,
      name: course.name,
      description: course.description,
      warmups: course.warmups,
      extra: course.extra,
      curriculum: course.curriculum,
      youtube: course.youtube,
      extrayoutube: course.extrayoutube,
      extrayoutube1: course.extrayoutube1
    }));

    const url = `${EXTRACTOR_URL}?type=course&courseData=${courseData}`;
    console.log('  - Calling Google Apps Script...');

    const response = await fetch(url);
    const data = await response.json();

    console.log('  - Response received:', data.success ? 'Success' : 'Failed');

    if (!data.success) {
      console.error('Resource extraction failed:', data.error);
      return null;
    }

    const counts = {
      descriptionLinks: data.resources.description.links?.length || 0,
      warmupsLinks: data.resources.warmups.links?.length || 0,
      extraLinks: data.resources.extra.links?.length || 0,
      curriculumLinks: data.resources.curriculum.links?.length || 0,
      youtubeVideos: data.resources.youtube.videos?.length || 0
    };

    console.log(`✓ Extracted resources for ${course.name}:`, counts);

    // Debug: show actual data structure if nothing was extracted
    const totalExtracted = Object.values(counts).reduce((a, b) => a + b, 0);
    if (totalExtracted === 0) {
      console.warn(`  ⚠️ No resources extracted for ${course.name}. Response:`, data.resources);
    }

    return data.resources;
  } catch (error) {
    console.error('Error extracting course resources:', error);
    return null;
  }
}

/**
 * Extract resources for multiple courses and filter by relevance
 */
export async function extractResourcesForCourses(courses, lessonTopic) {
  if (!courses || courses.length === 0) {
    return [];
  }

  console.log(`Extracting resources for ${courses.length} courses...`);

  // Extract resources for each course
  const extractionPromises = courses.map(course =>
    extractCourseResources(course)
      .then(resources => ({
        course,
        resources
      }))
      .catch(error => {
        console.error(`Failed to extract resources for ${course.name}:`, error);
        return { course, resources: null };
      })
  );

  const results = await Promise.all(extractionPromises);

  // Filter out failed extractions
  const successfulExtractions = results.filter(r => r.resources !== null);

  console.log(`Successfully extracted resources from ${successfulExtractions.length}/${courses.length} courses`);

  return successfulExtractions;
}

/**
 * Select most relevant resources based on lesson topic
 * Uses simple keyword matching - can be enhanced with AI later
 */
export function selectRelevantResources(extractedResources, lessonTopic, maxItems = 10) {
  const topicLower = lessonTopic.toLowerCase();
  const topicKeywords = topicLower
    .split(/\s+/)
    .filter(word => word.length > 3); // Filter out short words

  const allResources = [];

  extractedResources.forEach(({ course, resources }) => {
    // Add links from Google Docs
    ['description', 'warmups', 'extra', 'curriculum'].forEach(docType => {
      if (resources[docType]?.links) {
        resources[docType].links.forEach(link => {
          const relevanceScore = calculateLinkRelevance(link, topicKeywords);
          if (relevanceScore > 0) {
            allResources.push({
              type: 'link',
              source: `${course.name} - ${docType}`,
              courseName: course.name,
              docType,
              ...link,
              relevanceScore
            });
          }
        });
      }
    });

    // Add YouTube videos
    ['youtube', 'extrayoutube', 'extrayoutube1'].forEach(playlistType => {
      if (resources[playlistType]?.videos) {
        resources[playlistType].videos.forEach(video => {
          const relevanceScore = calculateVideoRelevance(video, topicKeywords);
          if (relevanceScore > 0) {
            allResources.push({
              type: 'video',
              source: `${course.name} - YouTube`,
              courseName: course.name,
              playlistType,
              ...video,
              relevanceScore
            });
          }
        });
      }
    });
  });

  // Sort by relevance and return top items
  const sortedResources = allResources
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxItems);

  console.log(`Selected ${sortedResources.length} most relevant resources out of ${allResources.length} total`);

  return sortedResources;
}

/**
 * Calculate relevance score for a link
 */
function calculateLinkRelevance(link, topicKeywords) {
  let score = 0;
  const textLower = link.text?.toLowerCase() || '';
  const urlLower = link.url?.toLowerCase() || '';

  topicKeywords.forEach(keyword => {
    if (textLower.includes(keyword)) score += 10;
    if (urlLower.includes(keyword)) score += 5;
  });

  // Bonus for certain link types
  if (link.type === 'google_doc') score += 2;
  if (link.type === 'youtube') score += 3;

  return score;
}

/**
 * Calculate relevance score for a video
 */
function calculateVideoRelevance(video, topicKeywords) {
  let score = 0;
  const titleLower = video.title?.toLowerCase() || '';
  const descLower = video.description?.toLowerCase() || '';

  topicKeywords.forEach(keyword => {
    if (titleLower.includes(keyword)) score += 15;
    if (descLower.includes(keyword)) score += 5;
  });

  return score;
}

/**
 * Format resources for AI prompt
 */
export function formatResourcesForPrompt(resources) {
  if (!resources || resources.length === 0) {
    return '';
  }

  let formatted = '\n\n## RELEVANT RESOURCES FROM TEACHLEAGUE COURSES\n\n';
  formatted += 'The following resources were extracted from our course library and are relevant to this lesson:\n\n';

  // Group by course
  const byCourse = {};
  resources.forEach(resource => {
    if (!byCourse[resource.courseName]) {
      byCourse[resource.courseName] = {
        links: [],
        videos: []
      };
    }
    if (resource.type === 'link') {
      byCourse[resource.courseName].links.push(resource);
    } else if (resource.type === 'video') {
      byCourse[resource.courseName].videos.push(resource);
    }
  });

  // Format by course
  Object.entries(byCourse).forEach(([courseName, { links, videos }]) => {
    formatted += `### From "${courseName}" Course:\n\n`;

    if (links.length > 0) {
      formatted += '**Relevant Links:**\n';
      links.forEach(link => {
        formatted += `- [${link.text}](${link.url}) (from ${link.docType})\n`;
      });
      formatted += '\n';
    }

    if (videos.length > 0) {
      formatted += '**Relevant Videos:**\n';
      videos.forEach(video => {
        formatted += `- [${video.title}](${video.url})\n`;
        if (video.description && video.description.length > 0 && video.description.length < 150) {
          formatted += `  ${video.description}\n`;
        }
      });
      formatted += '\n';
    }
  });

  formatted += '\n**IMPORTANT**: Please incorporate these specific resources into the lesson plan where relevant. ';
  formatted += 'Mention specific videos or links that would enhance the lesson, rather than just linking to entire playlists or documents.\n';

  return formatted;
}

/**
 * Select a warm-up question from extracted warmup docs
 * Looks for actual warm-up questions in the extracted links
 */
export function selectWarmUpFromResources(extractedResources, lessonTopic) {
  if (!extractedResources || extractedResources.length === 0) {
    return null;
  }

  // Collect all warmup links
  const warmupLinks = [];
  extractedResources.forEach(({ course, resources }) => {
    if (resources.warmups?.links && resources.warmups.links.length > 0) {
      resources.warmups.links.forEach(link => {
        warmupLinks.push({
          ...link,
          courseName: course.name,
          docUrl: resources.warmups.url
        });
      });
    }
  });

  if (warmupLinks.length === 0) {
    return null;
  }

  // Calculate relevance scores for warmup links
  const topicKeywords = lessonTopic.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3);

  const scoredWarmups = warmupLinks.map(link => {
    let score = 0;
    const textLower = (link.text || '').toLowerCase();
    const urlLower = (link.url || '').toLowerCase();

    topicKeywords.forEach(keyword => {
      if (textLower.includes(keyword)) score += 10;
      if (urlLower.includes(keyword)) score += 3;
    });

    return { ...link, relevanceScore: score };
  });

  // Sort by relevance and pick top warmups
  const relevantWarmups = scoredWarmups
    .filter(w => w.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3); // Get top 3 most relevant

  if (relevantWarmups.length === 0) {
    // If no relevant warmups found, return a random one
    const randomIndex = Math.floor(Math.random() * warmupLinks.length);
    return {
      warmups: [warmupLinks[randomIndex]],
      source: 'random'
    };
  }

  return {
    warmups: relevantWarmups,
    source: 'relevant'
  };
}

/**
 * Format selected warmups for AI prompt
 */
export function formatWarmupsForPrompt(selectedWarmups) {
  if (!selectedWarmups || !selectedWarmups.warmups || selectedWarmups.warmups.length === 0) {
    return '';
  }

  let formatted = '\n\n## SUGGESTED WARM-UP QUESTIONS FROM TEACHLEAGUE COURSES\n\n';
  formatted += 'The following warm-up questions have been used successfully in related courses:\n\n';

  selectedWarmups.warmups.forEach((warmup, index) => {
    formatted += `${index + 1}. **${warmup.text}**\n`;
    formatted += `   - From: "${warmup.courseName}" course\n`;
    if (warmup.url && !warmup.url.startsWith('#')) {
      formatted += `   - Link: ${warmup.url}\n`;
    }
    formatted += '\n';
  });

  formatted += '\n**INSTRUCTIONS**: ';
  if (selectedWarmups.source === 'relevant') {
    formatted += 'These warm-up questions are relevant to the lesson topic. Choose the most appropriate one and adapt it if needed to fit the specific lesson goals. ';
  } else {
    formatted += 'Consider whether any of these warm-up questions could be adapted for this lesson, or create a new one inspired by these examples. ';
  }
  formatted += 'Feel free to modify the question to better align with the grade level, class period length, and other specified criteria.\n';

  return formatted;
}

export default {
  extractCourseResources,
  extractResourcesForCourses,
  selectRelevantResources,
  formatResourcesForPrompt,
  selectWarmUpFromResources,
  formatWarmupsForPrompt
};
