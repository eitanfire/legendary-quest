import React from "react";
import { Button } from "reactstrap";

const Stage1BigIdea = ({ bigIdea, setBigIdea, onNext, canProceed }) => {
  const examples = [
    "Democracy requires informed citizens who can analyze multiple perspectives",
    "Understanding the past helps us make better decisions about the future",
    "Change happens when ordinary people take collective action",
  ];

  return (
    <div>
      <div className="mb-4 p-4" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
        <h5 style={{ color: "#00B894", marginBottom: "1rem" }}>
          💡 What's the Big Idea?
        </h5>
        <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "1rem" }}>
          If you ran into a student 5 years from now, what's the ONE core idea you'd hope they still remember from this lesson?
        </p>
        <p style={{ color: "#666", fontSize: "0.85rem", fontStyle: "italic" }}>
          This isn't a topic (like "The Revolutionary War") — it's a transferable understanding
          that connects to other contexts and issues.
        </p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="bigIdea"
          style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}
        >
          Your Big Idea
        </label>
        <textarea
          id="bigIdea"
          className="form-control"
          value={bigIdea}
          onChange={(e) => setBigIdea(e.target.value)}
          placeholder="Example: Different groups define 'freedom' in different ways based on their experiences and values"
          rows="4"
          style={{
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#00B894";
            e.target.style.boxShadow = "0 0 0 3px rgba(0, 184, 148, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ddd";
            e.target.style.boxShadow = "none";
          }}
        />
        <div className="mt-2" style={{ fontSize: "0.85rem", color: "#666" }}>
          {bigIdea.trim().length} / 10 characters minimum
        </div>
      </div>

      <div className="mb-4">
        <h6 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "1rem" }}>
          Need inspiration? Try one of these examples:
        </h6>
        <div className="d-flex flex-column gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              className="btn btn-outline-secondary text-start"
              onClick={() => setBigIdea(example)}
              style={{
                padding: "0.75rem 1rem",
                fontSize: "0.9rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "white",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#00B894";
                e.target.style.backgroundColor = "rgba(0, 184, 148, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#ddd";
                e.target.style.backgroundColor = "white";
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
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
          Next: Essential Questions →
        </Button>
      </div>
    </div>
  );
};

export default Stage1BigIdea;
