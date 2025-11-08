import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash-exp";
const API_KEY = process.env.REACT_APP_GEMINI_KEY;

export async function run(userInput, courses = [], generationType = 'lessonPlan', criteria = {}) {
  console.log('AI Generator called with:', { userInput, courseCount: courses?.length, generationType, criteria });

  if (!API_KEY) {
    throw new Error("API key is missing. Check your .env file.");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.5,
    topK: 64,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];

  // Create course list for the prompt - only include courses with name and description
  const validCourses = courses?.filter(c => c?.name && (c?.intro || c?.description)) || [];
  const courseList = validCourses.length > 0
    ? validCourses.slice(0, 10).map(course => {
        const desc = course.intro || course.description;
        const shortDesc = typeof desc === 'string' ? desc.substring(0, 100) : desc;
        return `- **${course.name}**: ${shortDesc}`;
      }).join('\n')
    : '';

  const coursesSection = courseList
    ? `\n\nAvailable TeachLeague Courses:\n${courseList}\n\nYou may reference these courses by name where highly relevant.`
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

  if (criteria.additional && criteria.additional.trim()) {
    criteriaSection += `\n\nAdditional Requirements: ${criteria.additional}`;
  }

  let prompt;

  if (generationType === 'warmUp') {
    prompt = `Create a warm-up writing prompt based on the following topic and skills.

Topic and Skills: ${userInput}${coursesSection}${criteriaSection}

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

Topic and Skills: ${userInput}${coursesSection}${criteriaSection}

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
  - Only include links that are genuinely relevant and useful
  - Make link text descriptive (e.g., "explore the Khan Academy module on fractions" rather than "click here")

- If any TeachLeague courses are HIGHLY relevant to specific activities or sections, mention them inline using exact course names
- At the end, if there are generally relevant TeachLeague courses, list them under a "Related Courses" section

Format your response as a well-structured lesson plan with clear section headers using markdown (## for main sections, ### for subsections).

Lesson Plan:`;
  }

  const parts = [{ text: prompt }];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    console.log("API raw result:", result);

    if (result && result.response && result.response.text) {
      return result.response.text();
    } else {
      console.error("API response is missing expected fields.");
      return "No response from AI. Please try again.";
    }
  } catch (error) {
    console.error("Error in AI generation:", error);
    throw error;
  }
}
