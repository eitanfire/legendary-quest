import React, { useState } from "react";
import { Button } from "reactstrap";

const Stage1LearningObjectives = ({
  bigIdea,
  essentialQuestions,
  learningObjectives,
  setLearningObjectives,
  onNext,
  onPrevious,
  canProceed,
}) => {
  const [selectedLevel, setSelectedLevel] = useState("Analyze");
  const [objectiveText, setObjectiveText] = useState("");

  const bloomsLevels = [
    {
      level: "Remember",
      color: "#E8F5E9",
      textColor: "#2E7D32",
      verbs: ["Identify", "List", "Define", "Recall", "Name", "Recognize"],
      description: "Retrieve relevant knowledge from memory",
    },
    {
      level: "Understand",
      color: "#E3F2FD",
      textColor: "#1565C0",
      verbs: ["Explain", "Summarize", "Describe", "Interpret", "Compare", "Classify"],
      description: "Construct meaning from information",
    },
    {
      level: "Apply",
      color: "#FFF3E0",
      textColor: "#E65100",
      verbs: ["Use", "Execute", "Implement", "Demonstrate", "Solve", "Calculate"],
      description: "Use information in new situations",
    },
    {
      level: "Analyze",
      color: "#F3E5F5",
      textColor: "#6A1B9A",
      verbs: ["Analyze", "Compare", "Contrast", "Examine", "Differentiate", "Investigate"],
      description: "Break material into parts and understand relationships",
    },
    {
      level: "Evaluate",
      color: "#FCE4EC",
      textColor: "#C2185B",
      verbs: ["Evaluate", "Assess", "Critique", "Judge", "Justify", "Defend"],
      description: "Make judgments based on criteria",
    },
    {
      level: "Create",
      color: "#E0F2F1",
      textColor: "#00695C",
      verbs: ["Create", "Design", "Develop", "Construct", "Plan", "Produce"],
      description: "Put elements together to form something new",
    },
  ];

  const currentLevel = bloomsLevels.find((l) => l.level === selectedLevel);

  const addObjective = () => {
    if (objectiveText.trim()) {
      const newObjective = {
        id: Date.now(),
        level: selectedLevel,
        text: objectiveText.trim(),
      };
      setLearningObjectives([...learningObjectives, newObjective]);
      setObjectiveText("");
    }
  };

  const removeObjective = (id) => {
    setLearningObjectives(learningObjectives.filter((obj) => obj.id !== id));
  };

  const generateSuggestion = () => {
    const verb = currentLevel.verbs[Math.floor(Math.random() * currentLevel.verbs.length)];
    const topic = bigIdea.substring(0, 50);
    return `${verb} how ${topic}...`;
  };

  return (
    <div>
      <div className="mb-4 p-4" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
        <h5 style={{ color: "#00B894", marginBottom: "1rem" }}>
          🎯 Learning Objectives
        </h5>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>
          Transform your big idea and essential questions into specific, measurable objectives.
          Use Bloom's Taxonomy to select the cognitive level students should achieve.
        </p>
        <p style={{ color: "#666", fontSize: "0.9rem", fontStyle: "italic", marginBottom: 0 }}>
          <strong>Format:</strong> "Students will be able to [verb] [object/concept]"
        </p>
      </div>

      {/* Bloom's Taxonomy Selector */}
      <div className="mb-4">
        <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Step 1: Select Cognitive Level (Bloom's Taxonomy)
        </h6>
        <div className="row g-2">
          {bloomsLevels.map((level) => (
            <div key={level.level} className="col-md-4">
              <div
                onClick={() => setSelectedLevel(level.level)}
                style={{
                  padding: "1rem",
                  borderRadius: "8px",
                  border: selectedLevel === level.level
                    ? `3px solid ${level.textColor}`
                    : "1px solid #ddd",
                  backgroundColor: selectedLevel === level.level
                    ? level.color
                    : "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    color: level.textColor,
                    marginBottom: "0.5rem",
                  }}
                >
                  {level.level}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  {level.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Verbs */}
      <div className="mb-4">
        <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Step 2: Choose an Action Verb
        </h6>
        <div
          className="p-3"
          style={{
            background: currentLevel.color,
            borderRadius: "8px",
            borderLeft: `4px solid ${currentLevel.textColor}`,
          }}
        >
          <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.75rem" }}>
            Suggested verbs for <strong>{selectedLevel}</strong>:
          </div>
          <div className="d-flex flex-wrap gap-2">
            {currentLevel.verbs.map((verb) => (
              <button
                key={verb}
                onClick={() => setObjectiveText(`${verb} `)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                  background: "white",
                  color: currentLevel.textColor,
                  fontWeight: "500",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                {verb}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Objective Input */}
      <div className="mb-4">
        <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Step 3: Write Your Objective
        </h6>
        <div className="mb-2">
          <div
            style={{
              display: "inline-block",
              padding: "0.3rem 0.6rem",
              background: "#e8f5f3",
              borderRadius: "4px",
              fontSize: "0.85rem",
              color: "#666",
              marginBottom: "0.5rem",
            }}
          >
            Students will be able to...
          </div>
        </div>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            value={objectiveText}
            onChange={(e) => setObjectiveText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addObjective()}
            placeholder={generateSuggestion()}
            style={{
              fontSize: "0.95rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
          <Button
            color="primary"
            onClick={addObjective}
            disabled={!objectiveText.trim()}
            style={{
              backgroundColor: "#00B894",
              border: "none",
              borderRadius: "8px",
              whiteSpace: "nowrap",
              padding: "0 1.5rem",
            }}
          >
            Add Objective
          </Button>
        </div>
      </div>

      {/* Added Objectives */}
      {learningObjectives.length > 0 && (
        <div className="mb-4">
          <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
            Your Learning Objectives ({learningObjectives.length})
          </h6>
          <div className="d-flex flex-column gap-2">
            {learningObjectives.map((obj) => {
              const level = bloomsLevels.find((l) => l.level === obj.level);
              return (
                <div
                  key={obj.id}
                  className="p-3"
                  style={{
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${level.textColor}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: level.textColor,
                          fontWeight: "600",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {obj.level}
                      </div>
                      <div style={{ fontSize: "0.95rem" }}>
                        Students will be able to <strong>{obj.text}</strong>
                      </div>
                    </div>
                    <button
                      onClick={() => removeObjective(obj.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#999",
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
          Next: Assessment Design →
        </Button>
      </div>
    </div>
  );
};

export default Stage1LearningObjectives;
