import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-pro";
const API_KEY = process.env.REACT_APP_GEMINI_KEY;

export async function run(userInput) {
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

  const parts = [
    {
      text: userInput,
    },
    {
      text: "output: Don't label the prompt. \n\nA writing prompt that will activate students' background knowledge on the topic and the skills they will use for the day's lesson. Students should respond with at least five sentences or a sketchnote. (which is a picture that symbolically answers the question) but you don't need to reiterate this requirement.",
    },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    console.log("API raw result:", result); // Debugging: Log the entire result object

    if (result && result.response && result.response.text) {
      return result.response.text(); // Ensure you return the response text
    } else {
      console.error("API response is missing expected fields.");
      return "No response from AI. Please try again.";
    }
  } catch (error) {
    console.error("Error in AI generation:", error);
    throw error; // Ensure you propagate the error to handle it in the component
  }
}
