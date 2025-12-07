import React, { useState, useEffect } from "react";
import { Button, Spinner } from "reactstrap";
import { getAIProviderManager } from "../../utils/aiProviderFactory";

const Stage1EssentialQuestions = ({
  bigIdea,
  essentialQuestions,
  setEssentialQuestions,
  onNext,
  onPrevious,
  canProceed,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [customQuestion, setCustomQuestion] = useState("");

  useEffect(() => {
    // Auto-generate questions when component mounts if none exist
    if (suggestedQuestions.length === 0) {
      generateQuestions();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateQuestions = async () => {
    if (!bigIdea || !bigIdea.trim()) {
      return;
    }

    setLoading(true);
    try {
      const prompt = `Generate 4 essential questions based on the following big idea for a lesson plan.

Big Idea: ${bigIdea}

Essential questions should:
- Be open-ended with no single right answer
- Promote inquiry and deeper thinking
- Raise more questions and encourage debate
- Be transferable across lessons and contexts
- Connect to students' lives and current events
- Start with words like "How," "Why," "What if," "To what extent," etc.

Examples of strong essential questions:
- "How do power and authority influence society?"
- "What is worth fighting for?"
- "To what extent does technology improve our lives?"
- "Why do patterns repeat in history?"

Please generate exactly 4 essential questions that align with this big idea. Return ONLY the questions, one per line, without numbers or additional explanation.`;

      const aiManager = getAIProviderManager();
      const result = await aiManager.generate(prompt);

      // Parse the response into individual questions
      const questions = result.content
        .split('\n')
        .map(q => q.trim())
        .filter(q => q.length > 0)
        .map(q => q.replace(/^[\d\-*.]+\s*/, '')) // Remove numbering/bullets
        .filter(q => q.length > 10) // Filter out very short lines
        .slice(0, 4); // Take only first 4

      if (questions.length > 0) {
        setSuggestedQuestions(questions);
      } else {
        // Fallback if parsing fails
        setSuggestedQuestions([
          `How does "${bigIdea.substring(0, 40)}..." apply to different contexts?`,
          `What evidence would challenge or support this big idea?`,
          `Why might different groups interpret this idea differently?`,
          `How can understanding this idea help us today?`,
        ]);
      }
    } catch (error) {
      console.error("Error generating essential questions:", error);
      // Provide fallback questions on error
      setSuggestedQuestions([
        `How does "${bigIdea.substring(0, 40)}..." apply to different contexts?`,
        `What evidence would challenge or support this big idea?`,
        `Why might different groups interpret this idea differently?`,
        `How can understanding this idea help us today?`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (question) => {
    if (essentialQuestions.includes(question)) {
      setEssentialQuestions(essentialQuestions.filter((q) => q !== question));
    } else {
      setEssentialQuestions([...essentialQuestions, question]);
    }
  };

  const addCustomQuestion = () => {
    if (customQuestion.trim() && !essentialQuestions.includes(customQuestion)) {
      setEssentialQuestions([...essentialQuestions, customQuestion]);
      setCustomQuestion("");
    }
  };

  return (
    <div>
      <div className="mb-4 p-4" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
        <h5 style={{ color: "#00B894", marginBottom: "1rem" }}>
          ❓ Essential Questions
        </h5>
        <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
          Essential questions are open-ended, thought-provoking questions that don't have a single right answer.
          They should:
        </p>
        <ul style={{ color: "#666", fontSize: "0.9rem" }}>
          <li>Promote inquiry and deeper thinking</li>
          <li>Raise more questions and encourage debate</li>
          <li>Recur across lessons (not just this one)</li>
          <li>Connect to students' lives and current events</li>
        </ul>
      </div>

      <div className="mb-4 p-3" style={{ background: "#e8f5f3", borderRadius: "8px", borderLeft: "4px solid #00B894" }}>
        <p style={{ margin: 0, fontSize: "0.9rem", fontStyle: "italic", color: "#333" }}>
          <strong>Your Big Idea:</strong> {bigIdea}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-3" style={{ color: "#666" }}>Generating essential questions...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ fontWeight: "600", marginBottom: 0 }}>
                AI-Generated Questions
              </h6>
              <Button
                size="sm"
                outline
                color="secondary"
                onClick={generateQuestions}
                style={{ borderRadius: "6px" }}
              >
                🔄 Regenerate
              </Button>
            </div>

            <div className="d-flex flex-column gap-2">
              {suggestedQuestions.map((question, index) => (
                <label
                  key={index}
                  style={{
                    padding: "1rem",
                    border: essentialQuestions.includes(question)
                      ? "2px solid #00B894"
                      : "1px solid #ddd",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: essentialQuestions.includes(question)
                      ? "rgba(0, 184, 148, 0.05)"
                      : "white",
                    transition: "all 0.2s",
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    <input
                      type="checkbox"
                      checked={essentialQuestions.includes(question)}
                      onChange={() => toggleQuestion(question)}
                      style={{
                        marginTop: "0.25rem",
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ flex: 1, fontSize: "0.95rem" }}>
                      {question}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
              Add Your Own Question
            </h6>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomQuestion()}
                placeholder="Type your own essential question..."
                style={{
                  fontSize: "0.95rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <Button
                color="primary"
                onClick={addCustomQuestion}
                disabled={!customQuestion.trim()}
                style={{
                  backgroundColor: "#00B894",
                  border: "none",
                  borderRadius: "8px",
                  whiteSpace: "nowrap",
                }}
              >
                Add
              </Button>
            </div>
          </div>

          {essentialQuestions.length > 0 && (
            <div className="mb-4 p-3" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
              <h6 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "1rem" }}>
                Selected Questions ({essentialQuestions.length})
              </h6>
              <div className="d-flex flex-column gap-2">
                {essentialQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-start gap-2"
                    style={{
                      padding: "0.5rem",
                      background: "white",
                      borderRadius: "6px",
                    }}
                  >
                    <span style={{ color: "#00B894", fontWeight: "600" }}>
                      {index + 1}.
                    </span>
                    <span style={{ flex: 1, fontSize: "0.9rem" }}>{question}</span>
                    <button
                      onClick={() => toggleQuestion(question)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#999",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="d-flex justify-content-between gap-2">
        <Button
          color="secondary"
          outline
          onClick={onPrevious}
          style={{ padding: "0.75rem 2rem", borderRadius: "8px" }}
        >
          ← Previous
        </Button>
        <Button
          color="primary"
          onClick={onNext}
          disabled={!canProceed}
          style={{
            backgroundColor: canProceed ? "#00B894" : "#ccc",
            border: "none",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: "600",
            borderRadius: "8px",
          }}
        >
          Next: Learning Objectives →
        </Button>
      </div>
    </div>
  );
};

export default Stage1EssentialQuestions;
