import React, { useState } from "react";
import { run } from "../utils/generateAIWarmUps";

const GenerateWarmUp = () => {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await run(userInput);
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

  const handle1stButtonClick = async () => {
    setUserInput("Use primary sources to understand the Revolutionary War");
    setLoading(true);
    try {
      const response = await run(
        "Use primary sources to understand the Revolutionary War"
      );
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

    const handle2ndButtonClick = async () => {
      setUserInput("How do different economic and government systems affect how countries respond to challenges?");
      setLoading(true);
      try {
        const response = await run(
          "How do different economic and government systems affect how countries respond to challenges?"
        );
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

     const handle3rdButtonClick = async () => {
       setUserInput(
         "Compare and contrast the causes and effects of WWI and WWII based on political, economic, and technological factors."
       );
       setLoading(true);
       try {
         const response = await run("Compare and contrast WWI and WWII");
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
    <>
      <button
        className="ai-prompt-boilerplate"
        onClick={handle1stButtonClick}
        disabled={loading}
      >
        Use primary sources to understand the Revolutionary War
      </button>
      <button
        className="ai-prompt-boilerplate"
        onClick={handle2ndButtonClick}
        disabled={loading}
      >
        How do different economic and government systems affect how countries
        respond to challenges?
      </button>
      <button
        className="ai-prompt-boilerplate"
        onClick={handle3rdButtonClick}
        disabled={loading}
      >
        Compare and contrast the causes and effects of WWI and WWII based on political, economic, and technological factors.
      </button>
      <div className="ai-input-field">
        What topic and skills will you be exploring in today's lesson?
        <form onSubmit={handleSubmit}>
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your input here"
            rows="4"
            cols="50"
          />
          <br />
          <button className="ai-submit-btn" type="submit" disabled={loading}>
            {loading ? "Generating..." : "Submit"}
          </button>
        </form>
        {aiResponse && (
          <div>
            <h3>Warm-Up Question:</h3>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default GenerateWarmUp;
