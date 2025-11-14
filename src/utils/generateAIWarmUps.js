import { getAIProviderManager } from './aiProviderFactory';
import { extractResourcesForCourses, selectRelevantResources, formatResourcesForPrompt } from './courseResourceExtractor';

/**
 * Calculate relevance score for a course based on user input
 */
function calculateRelevance(course, userInput) {
  const searchText = userInput.toLowerCase();
  const courseName = (course.name || '').toLowerCase();
  const courseIntro = (course.intro || '').toLowerCase();
  const courseDesc = typeof course.description === 'string' ? course.description.toLowerCase() : '';

  let score = 0;

  // Extract key terms from user input (remove common words)
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'how', 'what', 'which', 'who', 'when', 'where', 'why'];
  const keywords = searchText.split(/\s+/).filter(word =>
    word.length > 2 && !commonWords.includes(word)
  );

  // Score based on keyword matches in course name (highest priority)
  keywords.forEach(keyword => {
    if (courseName.includes(keyword)) {
      score += 10; // High score for name matches
    }
  });

  // Score based on keyword matches in intro/description
  keywords.forEach(keyword => {
    if (courseIntro.includes(keyword)) {
      score += 5; // Medium score for intro matches
    }
    if (courseDesc.includes(keyword)) {
      score += 3; // Lower score for description matches
    }
  });

  // Bonus for courses with YouTube playlists
  if (course.youtube || course.extrayoutube || course.extrayoutube1) {
    score += 2;
  }

  return score;
}

export async function run(userInput, courses = [], generationType = 'lessonPlan', criteria = {}, preferredProvider = null) {
  console.log('AI Generator called with:', { userInput, courseCount: courses?.length, generationType, criteria, preferredProvider });

  // Create course list for the prompt - only include courses with name and description
  const validCourses = courses?.filter(c => c?.name && (c?.intro || c?.description)) || [];

  // Rank courses by relevance to user input
  const rankedCourses = validCourses.map(course => ({
    ...course,
    relevanceScore: calculateRelevance(course, userInput)
  }))
  .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Split into highly relevant (score > 5) and somewhat relevant
  const highlyRelevant = rankedCourses.filter(c => c.relevanceScore > 5).slice(0, 5);
  const somewhatRelevant = rankedCourses.filter(c => c.relevanceScore > 0 && c.relevanceScore <= 5).slice(0, 5);

  console.log('Course relevance scores:', rankedCourses.slice(0, 10).map(c => ({ name: c.name, score: c.relevanceScore })));

  // Extract resources from top relevant courses
  const topCourses = rankedCourses.slice(0, 5); // Extract from top 5 most relevant courses
  let extractedResourcesSection = '';

  try {
    console.log('Extracting detailed resources from top courses...');
    const extractedData = await extractResourcesForCourses(topCourses, userInput);

    if (extractedData && extractedData.length > 0) {
      const relevantResources = selectRelevantResources(extractedData, userInput, 15);
      if (relevantResources.length > 0) {
        extractedResourcesSection = formatResourcesForPrompt(relevantResources);
        console.log(`✓ Found ${relevantResources.length} relevant resources from course docs and videos`);
      }
    }
  } catch (error) {
    console.error('Error extracting course resources:', error);
    // Continue without extracted resources
  }

  // Build course list with relevance indicators
  let courseList = '';

  if (highlyRelevant.length > 0) {
    courseList += '**HIGHLY RELEVANT Courses (prioritize these):**\n';
    courseList += highlyRelevant.map(course => {
      const desc = course.intro || course.description;
      const shortDesc = typeof desc === 'string' ? desc.substring(0, 150) : desc;
      let entry = `- **${course.name}**: ${shortDesc}`;

      const playlists = [];
      if (course.youtube) playlists.push(course.youtube);
      if (course.extrayoutube) playlists.push(course.extrayoutube);
      if (course.extrayoutube1) playlists.push(course.extrayoutube1);

      if (playlists.length > 0) {
        entry += `\n  YouTube Playlists: ${playlists.join(', ')}`;
      }

      return entry;
    }).join('\n');
  }

  if (somewhatRelevant.length > 0) {
    if (highlyRelevant.length > 0) courseList += '\n\n';
    courseList += '**Other Potentially Relevant Courses:**\n';
    courseList += somewhatRelevant.map(course => {
      const desc = course.intro || course.description;
      const shortDesc = typeof desc === 'string' ? desc.substring(0, 100) : desc;
      let entry = `- **${course.name}**: ${shortDesc}`;

      const playlists = [];
      if (course.youtube) playlists.push(course.youtube);
      if (course.extrayoutube) playlists.push(course.extrayoutube);
      if (course.extrayoutube1) playlists.push(course.extrayoutube1);

      if (playlists.length > 0) {
        entry += `\n  YouTube Playlists: ${playlists.join(', ')}`;
      }

      return entry;
    }).join('\n');
  }

  const coursesSection = courseList
    ? `\n\nAvailable TeachLeague Courses with Video Resources:\n${courseList}\n\n**IMPORTANT**: Prioritize the HIGHLY RELEVANT courses listed above. Only include YouTube playlists from courses that are truly relevant to the lesson topic.`
    : '';

  console.log('Courses section length:', coursesSection.length);

  // Build criteria section for the prompt
  let criteriaSection = '';

  if (criteria.grades && criteria.grades.length > 0) {
    criteriaSection += `\n\nTarget Grade Levels: ${criteria.grades.join(', ')}`;
  }

  if (criteria.politicalLeaning && criteria.politicalLeaning !== 'centrist') {
    criteriaSection += `\n\nPolitical Perspective: ${criteria.politicalLeaning} (This content has been self-rated and community-reviewed for political balance)`;
  }

  if (criteria.standards && criteria.standards.length > 0) {
    criteriaSection += `\n\nAlignment Standards: Please align with ${criteria.standards.join(', ')} standards where applicable`;
  }

  if (criteria.district && criteria.district.trim()) {
    criteriaSection += `\n\nSchool District: ${criteria.district} - Consider district-specific requirements if known`;
  }

  if (criteria.classPeriodLength && criteria.classPeriodLength.trim()) {
    const duration = criteria.classPeriodLength === 'custom'
      ? 'a custom duration'
      : `${criteria.classPeriodLength} minutes`;
    criteriaSection += `\n\nClass Period Length: ${duration} - Please adjust activity timings accordingly`;
  }

  if (criteria.additional && criteria.additional.trim()) {
    criteriaSection += `\n\nAdditional Requirements: ${criteria.additional}`;
  }

  let prompt;

  if (generationType === 'warmUp') {
    prompt = `Create a warm-up writing prompt based on the following topic and skills.

Topic and Skills: ${userInput}${extractedResourcesSection}${coursesSection}${criteriaSection}

Instructions:
- Create an engaging warm-up question that activates students' background knowledge
- The question should relate to both the topic and the skills they'll use in today's lesson
- Students should be able to respond with at least five sentences OR a sketchnote (a symbolic picture answer)
- Format your response in TWO parts:
  1. First: The warm-up question itself (just the question, no labels)
  2. Then: If any TeachLeague courses are relevant, add a blank line and mention them starting with "For deeper learning..." or "To explore this further..." or "Consider checking out..."
- Use exact course names when mentioning them
- Keep the warm-up question separate from course suggestions

Warm-up question:`;
  } else if (generationType === 'lessonPlan') {
    prompt = `Create a comprehensive lesson plan based on the following topic and skills.

Topic and Skills: ${userInput}${extractedResourcesSection}${coursesSection}${criteriaSection}

Instructions:
- Create a detailed lesson plan outline with the following sections:
  1. **Learning Objectives**: Clear, measurable objectives (2-4 objectives)
  2. **Materials Needed**: List of materials and resources
  3. **Introduction/Hook** (5-10 minutes): Engaging opening to capture student interest
  4. **Direct Instruction** (15-20 minutes): Main teaching content
  5. **Guided Practice** (15-20 minutes): Activities where students practice with support
  6. **Independent Practice/Assessment**: How students will demonstrate understanding
  7. **Closure** (5 minutes): Wrap-up and review
  8. **Differentiation**: Strategies for diverse learners

- Throughout the lesson plan, include relevant educational resource links where appropriate:
  - Use markdown link format: [Link Text](URL)
  - Include links to educational sites like Khan Academy, PBS LearningMedia, National Geographic Education, Smithsonian Learning Lab, or other reputable educational resources
  - **IMPORTANT**: When TeachLeague courses with YouTube playlists are relevant, include the YouTube playlist links in the appropriate lesson sections (e.g., "Watch videos from [YouTube Playlist](playlist_url)" or "Students can explore [course name YouTube playlist](url)")
  - Only include links that are genuinely relevant and useful
  - Make link text descriptive (e.g., "explore the Khan Academy module on fractions" rather than "click here")

- **Video Integration**:
  - If TeachLeague courses have YouTube playlists relevant to the lesson topic, reference them in appropriate sections (Introduction, Direct Instruction, or Independent Practice)
  - Format video references as: "View videos from the [Course Name YouTube Playlist](playlist_url)"
  - Suggest specific ways to use the videos (whole class viewing, flipped classroom, supplementary learning, etc.)

- If any TeachLeague courses are HIGHLY relevant to specific activities or sections, mention them inline using exact course names
- At the end, if there are generally relevant TeachLeague courses, list them under a "Related Courses" section with their YouTube playlist links

Format your response as a well-structured lesson plan with clear section headers using markdown (## for main sections, ### for subsections).

Lesson Plan:`;
  }

  try {
    const aiManager = getAIProviderManager();
    const result = await aiManager.generate(prompt, preferredProvider);

    console.log("AI generation result:", {
      provider: result.provider,
      providerName: result.providerName,
      usedFallback: result.usedFallback,
      contentLength: result.content?.length
    });

    // Return both the content and metadata about which provider was used
    return {
      content: result.content,
      metadata: {
        provider: result.provider,
        providerName: result.providerName,
        usedFallback: result.usedFallback,
        fallbackReason: result.fallbackReason
      }
    };
  } catch (error) {
    console.error("Error in AI generation:", error);
    throw error;
  }
}
