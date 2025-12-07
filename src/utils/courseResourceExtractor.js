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
    } else {
      // Debug: show sample curriculum links if they exist
      if (data.resources.curriculum?.links && data.resources.curriculum.links.length > 0) {
        console.log(`  📄 Sample curriculum links for ${course.name}:`);
        data.resources.curriculum.links.slice(0, 3).forEach((link, i) => {
          console.log(`    ${i + 1}. Text: "${link.text}", URL: "${link.url}"`);
        });
      }
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

  const allLinks = [];
  const allVideos = [];

  extractedResources.forEach(({ course, resources }) => {
    // Add links from Google Docs
    ['description', 'warmups', 'extra', 'curriculum'].forEach(docType => {
      // First, add the Google Doc URL itself if it exists
      if (resources[docType]?.url && course[docType]) {
        const docName = docType.charAt(0).toUpperCase() + docType.slice(1);
        const docTitle = `${course.name} ${docName} Document`;
        const relevanceScore = calculateLinkRelevance(
          { text: docTitle, url: course[docType], type: 'google_doc' },
          topicKeywords
        );

        allLinks.push({
          type: 'link',
          source: `${course.name} - ${docType}`,
          courseName: course.name,
          docType,
          text: docTitle,
          url: course[docType],
          relevanceScore: relevanceScore + 10 // Bonus for the main document
        });
      }

      // Then add links extracted FROM inside the Google Doc
      if (resources[docType]?.links) {
        resources[docType].links.forEach(link => {
          const relevanceScore = calculateLinkRelevance(link, topicKeywords);
          if (relevanceScore > 0) {
            allLinks.push({
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
            allVideos.push({
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

  // Sort each type by relevance
  const sortedLinks = allLinks.sort((a, b) => b.relevanceScore - a.relevanceScore);
  const sortedVideos = allVideos.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Ensure we get a balanced mix: at least 40% should be document links
  const minLinks = Math.ceil(maxItems * 0.4); // At least 40% documents
  const minVideos = Math.floor(maxItems * 0.3); // At least 30% videos

  let selectedLinks = sortedLinks.slice(0, Math.max(minLinks, Math.floor(maxItems / 2)));
  let selectedVideos = sortedVideos.slice(0, Math.max(minVideos, Math.floor(maxItems / 2)));

  // Combine and trim to maxItems
  const combined = [...selectedLinks, ...selectedVideos]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxItems);

  console.log(`Selected ${combined.length} resources: ${selectedLinks.length} docs, ${selectedVideos.length} videos (out of ${allLinks.length} total docs, ${allVideos.length} total videos)`);

  return combined;
}

/**
 * Calculate relevance score for a link
 */
function calculateLinkRelevance(link, topicKeywords) {
  let score = 0;
  const textLower = link.text?.toLowerCase() || '';
  const urlLower = link.url?.toLowerCase() || '';

  topicKeywords.forEach(keyword => {
    // Exact keyword match in title (highest priority)
    if (textLower.includes(keyword)) score += 15;

    // Partial keyword match in title
    const partialKeyword = keyword.substring(0, Math.min(keyword.length - 1, 5));
    if (partialKeyword.length >= 4 && textLower.includes(partialKeyword) && !textLower.includes(keyword)) {
      score += 8;
    }

    // Keyword in URL
    if (urlLower.includes(keyword)) score += 5;
  });

  // Bonus for curriculum documents (most useful for lesson planning)
  if (link.docType === 'curriculum') score += 12; // High priority for curriculum docs
  if (link.docType === 'warmups') score += 8;
  if (link.docType === 'extra') score += 6;

  // Bonus for certain link types
  if (link.type === 'google_doc') score += 8; // Prioritize Google Docs
  if (link.type === 'youtube') score += 4;

  // Base score to ensure we always have some resources
  score += 5; // Higher base to compete with videos

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
    // Exact keyword match in title (highest priority)
    if (titleLower.includes(keyword)) score += 20;

    // Partial keyword match in title
    const partialKeyword = keyword.substring(0, Math.min(keyword.length - 1, 5));
    if (partialKeyword.length >= 4 && titleLower.includes(partialKeyword) && !titleLower.includes(keyword)) {
      score += 10;
    }

    // Keyword in description
    if (descLower.includes(keyword)) score += 7;
  });

  // Base score for all videos
  score += 2;

  return score;
}

/**
 * Format resources for AI prompt
 */
export function formatResourcesForPrompt(resources) {
  if (!resources || resources.length === 0) {
    return '';
  }

  let formatted = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  formatted += '## 📚 SPECIFIC RESOURCES TO USE IN THIS LESSON\n';
  formatted += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
  formatted += '**INSTRUCTIONS**: Use these EXACT resources throughout your lesson plan. Copy the titles and URLs exactly as shown.\n\n';

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
    formatted += `### 📖 From "${courseName}" Course\n\n`;

    if (links.length > 0) {
      formatted += '**📄 Curriculum Documents & Links:**\n';
      links.forEach((link, idx) => {
        console.log(`📎 Including curriculum link - Text: "${link.text}", URL: "${link.url}", Type: ${link.type}`);
        formatted += `${idx + 1}. [${link.text}](${link.url})\n`;
      });
      formatted += '\n';
    }

    if (videos.length > 0) {
      formatted += '**🎥 Video Resources:**\n';
      videos.forEach((video, idx) => {
        formatted += `${idx + 1}. [${video.title}](${video.url})\n`;
        if (video.description && video.description.length > 0 && video.description.length < 150) {
          formatted += `   _${video.description}_\n`;
        }
      });
      formatted += '\n';
    }
  });

  formatted += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  formatted += '**⚠️ CRITICAL INSTRUCTIONS**:\n';
  formatted += '1. INTEGRATE these specific resources throughout your lesson plan\n';
  formatted += '2. BUILD your lesson activities AROUND these resources\n';
  formatted += '3. Use the EXACT titles and URLs shown above when referencing them\n';
  formatted += '4. Only mention resources you ARE using - do NOT explain which resources you are NOT using\n';
  formatted += '5. The lesson plan should be ready for teachers and students - no meta-commentary\n';
  formatted += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

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
      console.log(`  📝 ${course.name}: Found ${resources.warmups.links.length} warmup links`);
      resources.warmups.links.forEach(link => {
        warmupLinks.push({
          ...link,
          courseName: course.name,
          docUrl: resources.warmups.url
        });
      });
    }
  });

  console.log(`Total warmup links collected: ${warmupLinks.length}`);
  if (warmupLinks.length > 0) {
    console.log('First warmup link example:', warmupLinks[0]);
  }

  if (warmupLinks.length === 0) {
    return null;
  }

  // Calculate relevance scores for warmup links
  const topicKeywords = lessonTopic.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3);

  console.log(`  🔍 Searching for warmups matching keywords:`, topicKeywords);

  const scoredWarmups = warmupLinks.map(link => {
    let score = 0;
    const textLower = (link.text || '').toLowerCase();
    const urlLower = (link.url || '').toLowerCase();

    // Exact keyword matches (high score)
    topicKeywords.forEach(keyword => {
      if (textLower.includes(keyword)) score += 10;
      if (urlLower.includes(keyword)) score += 3;
    });

    // Partial keyword matches (medium score)
    // Check if any part of the keyword matches
    topicKeywords.forEach(keyword => {
      if (keyword.length >= 4) {
        const keywordPart = keyword.substring(0, Math.max(4, keyword.length - 1));
        if (textLower.includes(keywordPart) && !textLower.includes(keyword)) {
          score += 3;
        }
      }
    });

    // Related word matching (lower score)
    // Give small scores for common educational terms
    const educationalTerms = ['writing', 'reading', 'analysis', 'discussion', 'thinking', 'creative', 'critical'];
    educationalTerms.forEach(term => {
      if (textLower.includes(term) && topicKeywords.some(k => k.includes(term.substring(0, 4)))) {
        score += 2;
      }
    });

    // Base score for all warmups (ensures we always have options)
    score += 1;

    return { ...link, relevanceScore: score };
  });

  // Sort by relevance
  const sortedWarmups = scoredWarmups.sort((a, b) => b.relevanceScore - a.relevanceScore);

  console.log(`  📊 Top scored warmups:`, sortedWarmups.slice(0, 5).map(w => ({
    text: w.text.substring(0, 50) + '...',
    score: w.relevanceScore
  })));

  // Return top 3 warmups (even if they only have base score)
  // This means we'll almost always use existing warmups instead of creating new ones
  const topWarmups = sortedWarmups.slice(0, 3);

  // Only consider it "relevant" if the top score is above base score
  const hasRelevantMatches = topWarmups[0].relevanceScore > 1;

  return {
    warmups: topWarmups,
    source: hasRelevantMatches ? 'relevant' : 'suggested'
  };
}

/**
 * Format selected warmups for AI prompt
 */
export function formatWarmupsForPrompt(selectedWarmups) {
  if (!selectedWarmups || !selectedWarmups.warmups || selectedWarmups.warmups.length === 0) {
    return '';
  }

  let formatted = '\n\n## SUGGESTED WARM-UP QUESTIONS FROM COURSE LIBRARY\n\n';
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
    formatted += 'These warm-up questions are highly relevant to the lesson topic. Choose the most appropriate one and adapt it if needed to fit the specific lesson goals. ';
  } else if (selectedWarmups.source === 'suggested') {
    formatted += 'These warm-up questions have been used successfully in our courses. Please choose one and adapt it to fit this lesson topic and goals. Only create a completely new warm-up if none of these can be reasonably adapted. ';
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
