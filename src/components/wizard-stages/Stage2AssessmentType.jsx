import React from "react";
import { Button, FormGroup, Label, Input } from "reactstrap";

const Stage2AssessmentType = ({
  learningObjectives,
  assessmentType,
  setAssessmentType,
  assessmentStakes,
  setAssessmentStakes,
  onNext,
  onPrevious,
  canProceed,
}) => {
  const assessmentTypes = [
    {
      category: "Written Assessments",
      types: [
        {
          name: "Essay or Written Response",
          description: "Students demonstrate understanding through extended writing",
          bestFor: ["Evaluate", "Analyze", "Create"],
        },
        {
          name: "Document-Based Question (DBQ)",
          description: "Students analyze primary/secondary sources to answer a question",
          bestFor: ["Analyze", "Evaluate"],
        },
        {
          name: "Research Paper",
          description: "In-depth investigation and synthesis of sources",
          bestFor: ["Create", "Evaluate", "Analyze"],
        },
      ],
    },
    {
      category: "Performance Assessments",
      types: [
        {
          name: "Presentation or Speech",
          description: "Students present findings or arguments to an audience",
          bestFor: ["Create", "Evaluate", "Apply"],
        },
        {
          name: "Debate or Socratic Seminar",
          description: "Students engage in structured discussion or argument",
          bestFor: ["Evaluate", "Analyze"],
        },
        {
          name: "Project or Portfolio",
          description: "Students create a product demonstrating learning over time",
          bestFor: ["Create", "Apply"],
        },
      ],
    },
    {
      category: "Traditional Assessments",
      types: [
        {
          name: "Multiple Choice/Short Answer Test",
          description: "Students recall and apply knowledge in structured format",
          bestFor: ["Remember", "Understand", "Apply"],
        },
        {
          name: "Quiz",
          description: "Brief check for understanding of specific concepts",
          bestFor: ["Remember", "Understand"],
        },
      ],
    },
  ];

  const getRecommendedTypes = () => {
    if (learningObjectives.length === 0) return [];

    const levels = learningObjectives.map((obj) => obj.level);
    const recommended = [];

    assessmentTypes.forEach((category) => {
      category.types.forEach((type) => {
        const matches = type.bestFor.filter((level) => levels.includes(level)).length;
        if (matches > 0) {
          recommended.push({ ...type, matchScore: matches });
        }
      });
    });

    return recommended.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  };

  const recommendedTypes = getRecommendedTypes();

  return (
    <div>
      <div className="mb-4 p-4" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
        <h5 style={{ color: "#00B894", marginBottom: "1rem" }}>
          📋 Choose Assessment Type
        </h5>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>
          Select how students will demonstrate they've achieved your learning objectives.
          The assessment should directly measure what you want students to know and be able to do.
        </p>
      </div>

      {/* Stakes Selection */}
      <div className="mb-4">
        <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Assessment Stakes
        </h6>
        <div className="row g-3">
          <div className="col-md-6">
            <label
              style={{
                padding: "1rem",
                borderRadius: "8px",
                border: assessmentStakes === "formative"
                  ? "3px solid #00B894"
                  : "1px solid #ddd",
                backgroundColor: assessmentStakes === "formative"
                  ? "rgba(0, 184, 148, 0.05)"
                  : "white",
                cursor: "pointer",
                display: "block",
                transition: "all 0.2s",
              }}
            >
              <div className="d-flex align-items-start gap-3">
                <input
                  type="radio"
                  name="stakes"
                  value="formative"
                  checked={assessmentStakes === "formative"}
                  onChange={(e) => setAssessmentStakes(e.target.value)}
                  style={{ marginTop: "0.25rem" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    Formative (Low-Stakes)
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>
                    For practice and feedback. Helps students prepare for summative assessments.
                    Minimal impact on grade.
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div className="col-md-6">
            <label
              style={{
                padding: "1rem",
                borderRadius: "8px",
                border: assessmentStakes === "summative"
                  ? "3px solid #00B894"
                  : "1px solid #ddd",
                backgroundColor: assessmentStakes === "summative"
                  ? "rgba(0, 184, 148, 0.05)"
                  : "white",
                cursor: "pointer",
                display: "block",
                transition: "all 0.2s",
              }}
            >
              <div className="d-flex align-items-start gap-3">
                <input
                  type="radio"
                  name="stakes"
                  value="summative"
                  checked={assessmentStakes === "summative"}
                  onChange={(e) => setAssessmentStakes(e.target.value)}
                  style={{ marginTop: "0.25rem" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                    Summative (High-Stakes)
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>
                    Evaluates final learning. Significant impact on grade.
                    Used for accountability and reporting.
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Recommended Assessments */}
      {recommendedTypes.length > 0 && (
        <div className="mb-4">
          <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
            ⭐ Recommended Based on Your Objectives
          </h6>
          <div className="row g-3">
            {recommendedTypes.map((type, index) => (
              <div key={index} className="col-md-4">
                <label
                  style={{
                    padding: "1rem",
                    borderRadius: "8px",
                    border: assessmentType === type.name
                      ? "3px solid #00B894"
                      : "1px solid #ddd",
                    backgroundColor: assessmentType === type.name
                      ? "rgba(0, 184, 148, 0.05)"
                      : "white",
                    cursor: "pointer",
                    display: "block",
                    height: "100%",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="radio"
                    name="assessmentType"
                    value={type.name}
                    checked={assessmentType === type.name}
                    onChange={(e) => setAssessmentType(e.target.value)}
                    style={{ display: "none" }}
                  />
                  <div style={{ fontWeight: "600", marginBottom: "0.5rem", color: "#00B894" }}>
                    {type.name}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>
                    {type.description}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#999" }}>
                    Best for: {type.bestFor.join(", ")}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Assessment Types */}
      <div className="mb-4">
        <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          All Assessment Types
        </h6>
        {assessmentTypes.map((category, catIndex) => (
          <div key={catIndex} className="mb-4">
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#666",
                marginBottom: "0.75rem",
              }}
            >
              {category.category}
            </div>
            <div className="row g-2">
              {category.types.map((type, typeIndex) => (
                <div key={typeIndex} className="col-md-6">
                  <label
                    style={{
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: assessmentType === type.name
                        ? "2px solid #00B894"
                        : "1px solid #ddd",
                      backgroundColor: assessmentType === type.name
                        ? "rgba(0, 184, 148, 0.05)"
                        : "white",
                      cursor: "pointer",
                      display: "block",
                      transition: "all 0.2s",
                    }}
                  >
                    <div className="d-flex align-items-start gap-2">
                      <input
                        type="radio"
                        name="assessmentType"
                        value={type.name}
                        checked={assessmentType === type.name}
                        onChange={(e) => setAssessmentType(e.target.value)}
                        style={{ marginTop: "0.25rem" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "500", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                          {type.name}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#666" }}>
                          {type.description}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

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
          Next: Success Criteria →
        </Button>
      </div>
    </div>
  );
};

export default Stage2AssessmentType;
