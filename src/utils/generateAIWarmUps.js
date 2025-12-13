import { getAIProviderManager } from './aiProviderFactory';
import {
  extractResourcesForCourses,
  selectRelevantResources,
  formatResourcesForPrompt,
  selectWarmUpFromResources,
  formatWarmupsForPrompt
} from './courseResourceExtractor';
import { extractKeywords, calculateWeightedRelevance } from './keywordExtractor';

/**
 * Calculate relevance score for a course based on user input
 * Uses advanced keyword extraction with proper noun detection and phrase matching
 */
function calculateRelevance(course, userInput, keywords) {
  const courseName = (course.name || '').toLowerCase();
  const courseIntro = (course.intro || '').toLowerCase();
  const courseDesc = typeof course.description === 'string' ? course.description.toLowerCase() : '';

  let score = 0;

  // Use weighted keyword matching for course name (highest priority)
  score += calculateWeightedRelevance(keywords, courseName) * 2; // 2x multiplier for name matches

  // Use weighted keyword matching for intro
  score += calculateWeightedRelevance(keywords, courseIntro);

  // Use weighted keyword matching for description
  score += calculateWeightedRelevance(keywords, courseDesc) * 0.5; // 0.5x multiplier (lower priority)

  // Bonus for courses with YouTube playlists
  if (course.youtube || course.extrayoutube || course.extrayoutube1) {
    score += 2;
  }

  return score;
}

export async function run(userInput, courses = [], generationType = 'lessonPlan', criteria = {}, preferredProvider = null, metadata = null) {
  console.log('AI Generator called with:', { userInput, courseCount: courses?.length, generationType, criteria, preferredProvider, metadata });

  // Extract and weight keywords from user input (ONCE, used throughout)
  const keywords = extractKeywords(userInput);
  console.log('Extracted keywords:', keywords.map(k => `${k.text} (${k.weight}x, ${k.type})`));

  // Create course list for the prompt - only include courses with name and description
  const validCourses = courses?.filter(c => c?.name && (c?.intro || c?.description)) || [];

  // Rank courses by relevance to user input using weighted keywords
  const rankedCourses = validCourses.map(course => ({
    ...course,
    relevanceScore: calculateRelevance(course, userInput, keywords)
  }))
  .sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Split into highly relevant (score > 10) and somewhat relevant (minimum threshold increased)
  const highlyRelevant = rankedCourses.filter(c => c.relevanceScore > 10).slice(0, 5);
  const somewhatRelevant = rankedCourses.filter(c => c.relevanceScore > 5 && c.relevanceScore <= 10).slice(0, 5);

  console.log('Course relevance scores:', rankedCourses.slice(0, 10).map(c => ({ name: c.name, score: c.relevanceScore })));

  // Extract resources from top relevant courses
  const topCourses = rankedCourses.slice(0, 5); // Extract from top 5 most relevant courses
  let extractedResourcesSection = '';
  let warmupQuestionsSection = '';
  let relevantResources = []; // Track for metadata

  try {
    console.log('Extracting detailed resources from top courses...');
    const extractedData = await extractResourcesForCourses(topCourses, userInput);

    if (extractedData && extractedData.length > 0) {
      // For lesson plans, extract general resources using weighted keywords (increased to 25 for more options)
      relevantResources = selectRelevantResources(extractedData, userInput, 25, keywords);
      if (relevantResources.length > 0) {
        extractedResourcesSection = formatResourcesForPrompt(relevantResources);
        console.log(`✓ Found ${relevantResources.length} relevant resources from course docs and videos`);
      }

      // For warm-ups, extract specific warm-up questions
      if (generationType === 'warmUp') {
        console.log('🔍 Looking for warm-up questions in extracted data...');
        console.log('Extracted data courses:', extractedData.map(d => d.course.name));

        // Debug: check what's in the warmups
        extractedData.forEach(({ course, resources }) => {
          const warmupCount = resources.warmups?.links?.length || 0;
          console.log(`  - ${course.name}: ${warmupCount} warmup links`);
          if (warmupCount > 0) {
            console.log(`    First warmup:`, resources.warmups.links[0]);
          }
        });

        const selectedWarmups = selectWarmUpFromResources(extractedData, userInput);
        console.log('Selected warmups result:', selectedWarmups);

        if (selectedWarmups) {
          warmupQuestionsSection = formatWarmupsForPrompt(selectedWarmups);
          console.log(`✓ Found ${selectedWarmups.warmups.length} ${selectedWarmups.source} warm-up questions`);
        } else {
          console.log('⚠️ No warm-up questions were selected');
        }
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
    ? `\n\nAvailable Courses with Video Resources:\n${courseList}\n\n**IMPORTANT**: Prioritize the HIGHLY RELEVANT courses listed above. Only include YouTube playlists from courses that are truly relevant to the lesson topic.`
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

Topic and Skills: ${userInput}${warmupQuestionsSection}${extractedResourcesSection}${coursesSection}${criteriaSection}

Instructions:
- Create an engaging warm-up question that activates students' background knowledge
- The question should relate to both the topic and the skills they'll use in today's lesson
- Make it open-ended to encourage thoughtful responses
${warmupQuestionsSection ? '- IMPORTANT: Review the suggested warm-up questions above and choose the most appropriate one for this lesson. You may adapt it to better fit the grade level and criteria, but try to use or modify an existing question rather than creating a completely new one.' : ''}
- Format your response as just the warm-up question itself
- Do NOT include instructions about how many sentences to write
- Do NOT mention "deeper learning" or course recommendations

Warm-up question:`;
  } else if (generationType === 'lessonPlan') {
    prompt = `Create a comprehensive backward design lesson plan that integrates the specific resources provided below.

Topic and Skills: ${userInput}${criteriaSection}${extractedResourcesSection}

**YOUR PRIMARY TASK**: Build this lesson plan AROUND the specific resources listed above, using backward design principles (start with objectives and assessment, then plan instruction).

Create a lesson plan with the following structure:

## OBJECTIVE
What should students be able to do by the end of this lesson? Write 1-2 clear, measurable objectives.

## KEY POINTS
What knowledge and skills are embedded in the objective? List 3-5 key points students must understand.

## MATERIALS
List all materials needed:
- Specific curriculum documents from "Relevant Links" above (use exact titles and URLs)
- Specific videos from "Relevant Videos" above (use exact titles and URLs)
- Any additional materials needed

## ASSESSMENT
Describe what students will do to show they have mastered (or made progress toward) the objective.
- Include an exemplary student response that illustrates the expected level of rigor
- Reference specific resources from above if they're part of the assessment

## 4. OPENING (5-10 minutes)
- How will you communicate what is about to happen and its importance?
- How will you connect to previous lessons?
- How will you engage students and capture their interest?
- **USE** a specific video or document from above to hook students: "Show [exact title](url)"

## 3. INTRODUCTION OF NEW MATERIAL (15-20 minutes)
- How will you explain/demonstrate all knowledge/skills required of the objective?
- Which potential misunderstandings do you anticipate and how will you address them?
- How will students interact with the material?
- How/when will you check for understanding?
- **INTEGRATE** AT LEAST 2-3 specific resources from above: "Students will watch [title](url)" or "Reference [document](url)"
- Make these resources central to instruction, not supplemental

## 2. GUIDED PRACTICE (15-20 minutes)
- How will students practice with your support?
- How will you ensure multiple practice opportunities, scaffolded from easy to hard?
- How/when will you monitor performance and address misunderstandings?
- **USE** specific documents and resources from above for practice activities
- Include AT LEAST 2 direct links: "Students will analyze [resource](url)"

## 1. INDEPENDENT PRACTICE (10-15 minutes)
- How will students independently practice to solidify their understanding?
- When and how would you intervene to support this practice?
- How will you provide opportunities for remediation and extension?
- Base this on resources provided above

## LESSON ASSESSMENT
How will students demonstrate mastery of the objective?
- Link to specific assessment documents if available from resources above

## 5. CLOSING (5 minutes)
- How will students summarize and state the significance of what they learned?
- Reference key resources used during the lesson

**CRITICAL REQUIREMENTS**:
- You MUST use AT LEAST 5-7 specific resource links from the "Relevant Links" and "Relevant Videos" sections above
- Each link must use the EXACT title and URL provided in markdown format: [exact title](exact-url)
- Integrate these throughout the lesson sections - NOT just listed in Materials
- Make the lesson plan BUILD ON these resources, not just mention them
- Only suggest external resources if the provided ones don't cover the topic
- **IMPORTANT**: Do NOT explain which resources you're NOT using or why certain resources don't fit
- Only mention resources that you ARE actively using in the lesson plan
- The lesson plan should be ready for teachers to use - no meta-commentary${coursesSection ? '\n\n**Additional Context** (for general reference only - prioritize the specific resources above):\n' + coursesSection : ''}

Format your response as a well-structured lesson plan with clear section headers using markdown (## for main sections).

Lesson Plan:`;
  }

  try {
    const aiManager = getAIProviderManager();

    // Enhance metadata with course information
    const enhancedMetadata = {
      ...metadata,
      criteria,
      coursesUsed: topCourses.slice(0, 5).map(c => c.name), // Top 5 course names
      resourceCount: relevantResources?.length || 0,
    };

    const result = await aiManager.generate(prompt, preferredProvider, enhancedMetadata);

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
