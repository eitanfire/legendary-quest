import React from "react";
import { Button, Input } from "reactstrap";

const InitialPrompt = ({ topic, setTopic, onQuickGenerate, onUseWizard }) => {
  return (
    <div>
      <div className="mb-4 p-4" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
        <h5 style={{ color: "#00B894", marginBottom: "1rem", fontSize: "1.2rem" }}>
          Let's create your lesson plan
        </h5>
        <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: 0 }}>
          Start by telling us what you want your students to be able to do and know.
        </p>
      </div>

      <div className="mb-4">
        <label
          htmlFor="topic-input"
          style={{
            display: "block",
            fontWeight: "600",
            marginBottom: "0.75rem",
            color: "#333",
            fontSize: "1rem",
          }}
        >
          What do you want students to be able to do and know?
        </label>
        <Input
          id="topic-input"
          type="textarea"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Example: Students will be able to analyze the causes of World War I and evaluate which factors were most significant..."
          rows="4"
          style={{
            fontSize: "0.95rem",
            borderRadius: "8px",
            border: "2px solid #ddd",
            padding: "1rem",
          }}
        />
      </div>

      {topic.trim().length > 10 && (
        <>
          <div className="mb-4 p-4" style={{ background: "#fff3cd", borderRadius: "8px", border: "1px solid #ffc107" }}>
            <p style={{ color: "#856404", fontSize: "0.9rem", marginBottom: 0 }}>
              <strong>Choose your approach:</strong>
            </p>
          </div>

          <div className="row g-3 mb-4">
            {/* Quick Generate Option */}
            <div className="col-md-6">
              <div
                className="p-4 h-100"
                style={{
                  background: "white",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#00B894";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 184, 148, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h6 style={{ color: "#00B894", fontWeight: "600", marginBottom: "0.75rem" }}>
                  ⚡ Quick Generate
                </h6>
                <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1rem" }}>
                  Generate a lesson plan right away using your topic. Fast and simple.
                </p>
                <ul style={{ color: "#666", fontSize: "0.85rem", paddingLeft: "1.25rem", marginBottom: "1rem" }}>
                  <li>Get results in seconds</li>
                  <li>Basic customization options</li>
                  <li>Perfect for quick planning</li>
                </ul>
                <Button
                  color="primary"
                  onClick={onQuickGenerate}
                  disabled={topic.trim().length < 10}
                  block
                  style={{
                    backgroundColor: "#00B894",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  Quick Generate
                </Button>
              </div>
            </div>

            {/* Backward Design Wizard Option */}
            <div className="col-md-6">
              <div
                className="p-4 h-100"
                style={{
                  background: "white",
                  border: "2px solid #00B894",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 184, 148, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <h6 style={{ color: "#00B894", fontWeight: "600", marginBottom: 0, marginRight: "0.5rem" }}>
                    🎯 Backward Design Wizard
                  </h6>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      backgroundColor: "#00B894",
                      color: "white",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "12px",
                      fontWeight: "600",
                    }}
                  >
                    RECOMMENDED
                  </span>
                </div>
                <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1rem" }}>
                  Use research-based instructional design to create pedagogically sound lesson plans.
                </p>
                <ul style={{ color: "#666", fontSize: "0.85rem", paddingLeft: "1.25rem", marginBottom: "1rem" }}>
                  <li>6-step guided process</li>
                  <li>Universal Design for Learning</li>
                  <li>Aligned objectives & assessments</li>
                  <li>Professional-quality output</li>
                </ul>
                <Button
                  color="primary"
                  onClick={onUseWizard}
                  disabled={topic.trim().length < 10}
                  block
                  style={{
                    backgroundColor: "#00B894",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  Use Backward Design
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-3">
            <p style={{ color: "#999", fontSize: "0.85rem", fontStyle: "italic" }}>
              New to Backward Design?{" "}
              <a
                href="https://cft.vanderbilt.edu/guides-sub-pages/understanding-by-design/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00B894" }}
              >
                Learn more
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default InitialPrompt;
