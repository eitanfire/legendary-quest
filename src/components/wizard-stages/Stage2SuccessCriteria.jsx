import React, { useState, useEffect } from "react";
import { Button, Spinner } from "reactstrap";

const Stage2SuccessCriteria = ({
  learningObjectives,
  assessmentType,
  successCriteria,
  setSuccessCriteria,
  onNext,
  onPrevious,
  canProceed,
}) => {
  const [loading, setLoading] = useState(false);
  const [generatedRubric, setGeneratedRubric] = useState("");

  useEffect(() => {
    if (!generatedRubric) {
      generateRubric();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateRubric = async () => {
    setLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      const rubric = `**Exceeds Expectations (4)**
- Demonstrates exceptional understanding of ${learningObjectives[0]?.text || "the concepts"}
- Provides detailed analysis with multiple supporting examples
- Makes insightful connections beyond the immediate topic

**Meets Expectations (3)**
- Clearly demonstrates understanding of key concepts
- Provides adequate supporting evidence
- Makes relevant connections to the topic

**Approaching Expectations (2)**
- Shows partial understanding of concepts
- Limited supporting evidence provided
- Connections to topic are basic

**Needs Improvement (1)**
- Demonstrates limited understanding
- Little or no supporting evidence
- Missing key elements of the ${assessmentType || "assessment"}`;

      setGeneratedRubric(rubric);
      if (!successCriteria) {
        setSuccessCriteria(rubric);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-4 p-4" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
        <h5 style={{ color: "#00B894", marginBottom: "1rem" }}>
          ✅ Define Success Criteria
        </h5>
        <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "0.5rem" }}>
          Create a rubric or checklist that defines what excellent work looks like.
          This helps students understand expectations and guides your grading.
        </p>
        <p style={{ color: "#666", fontSize: "0.9rem", fontStyle: "italic", marginBottom: 0 }}>
          Clear success criteria answer: "How will I know students achieved the learning objectives?"
        </p>
      </div>

      <div className="mb-4 p-3" style={{ background: "#e8f5f3", borderRadius: "8px", borderLeft: "4px solid #00B894" }}>
        <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>
          <strong>Assessment:</strong> {assessmentType}
        </div>
        <div style={{ fontSize: "0.85rem", color: "#666" }}>
          <strong>Objectives:</strong>
          <ul style={{ marginTop: "0.5rem", marginBottom: 0, paddingLeft: "1.5rem" }}>
            {learningObjectives.map((obj) => (
              <li key={obj.id}>Students will {obj.text}</li>
            ))}
          </ul>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-3" style={{ color: "#666" }}>Generating rubric...</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ fontWeight: "600", marginBottom: 0 }}>
                AI-Generated Rubric
              </h6>
              <Button
                size="sm"
                outline
                color="secondary"
                onClick={generateRubric}
                style={{ borderRadius: "6px" }}
              >
                🔄 Regenerate
              </Button>
            </div>

            <div className="mb-3">
              <textarea
                className="form-control"
                value={successCriteria}
                onChange={(e) => setSuccessCriteria(e.target.value)}
                rows="15"
                style={{
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontFamily: "monospace",
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
                Edit the rubric above to match your specific requirements
              </div>
            </div>
          </div>

          <div className="mb-4 p-4" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
            <h6 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "1rem" }}>
              💡 Tips for Strong Success Criteria
            </h6>
            <ul style={{ fontSize: "0.9rem", color: "#666", marginBottom: 0, paddingLeft: "1.5rem" }}>
              <li>Use specific, observable language ("Identifies 3 main causes" not "understands causes")</li>
              <li>Include both content knowledge and skills</li>
              <li>Describe what excellent work looks like, not just what's acceptable</li>
              <li>Make it transparent - students should be able to self-assess</li>
              <li>Connect directly to your learning objectives</li>
            </ul>
          </div>

          <div className="mb-4 p-3" style={{ background: "#fff3cd", borderRadius: "8px", borderLeft: "4px solid #ffc107" }}>
            <div style={{ fontSize: "0.9rem", color: "#856404" }}>
              <strong>Remember:</strong> Share this rubric with students BEFORE they complete the assessment.
              Transparency helps students understand expectations and improves their work.
            </div>
          </div>
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
          Next: Design Activities →
        </Button>
      </div>
    </div>
  );
};

export default Stage2SuccessCriteria;
