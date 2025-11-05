import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.0-flash-exp";
const API_KEY = process.env.REACT_APP_GEMINI_KEY;

export async function run(userInput) {
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

  // Create a clear prompt that combines instructions with user input
  const prompt = `Create a warm-up writing prompt based on the following topic and skills.

Topic and Skills: ${userInput}

Instructions:
- Create an engaging warm-up question that activates students' background knowledge
- The question should relate to both the topic and the skills they'll use in today's lesson
- Students should be able to respond with at least five sentences OR a sketchnote (a symbolic picture answer)
- Don't label this as "prompt" or include any meta-text
- Just provide the warm-up question itself

Warm-up question:`;

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
