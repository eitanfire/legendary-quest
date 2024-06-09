import React, { useState } from "react";
import { run } from "../utils/generateAIWarmUps";

const GenerateWarmUp = () => {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    console.log("User Input Changed:", e.target.value); // Debugging
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted"); // Debugging
    setLoading(true);
    try {
      console.log("Calling run with userInput:", userInput); // Debugging
      const response = await run(userInput);
      // console.log("API Response:", response); // Debugging

      if (response !== undefined) {
        setAiResponse(response);
      } else {
        setAiResponse("No response from AI. Please try again.");
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      setAiResponse("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your input here"
          rows="4"
          cols="50"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Submit"}
        </button>
      </form>
      {aiResponse && (
        <div>
          <h3>AI Response:</h3>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default GenerateWarmUp;
