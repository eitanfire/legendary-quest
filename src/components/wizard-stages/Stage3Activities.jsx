import React, { useState, useRef, useEffect } from "react";
import { Button, FormGroup, Label, Input, Collapse } from "reactstrap";
import { run } from "../../utils/generateAIWarmUps";
import { searchSchoolDistricts } from "../../utils/ncesAPI";

const Stage3Activities = ({
  bigIdea,
  essentialQuestions,
  learningObjectives,
  assessmentType,
  successCriteria,
  selectedGrades,
  setSelectedGrades,
  alignmentStandards,
  setAlignmentStandards,
  schoolDistrict,
  setSchoolDistrict,
  classPeriodLength,
  setClassPeriodLength,
  additionalCriteria,
  setAdditionalCriteria,
  udlStrategies,
  setUdlStrategies,
  coursesArray,
  loading,
  setLoading,
  lessonPlanResponse,
  setLessonPlanResponse,
  setCompleted,
  onPrevious,
}) => {
  const [showGrades, setShowGrades] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [showStandards, setShowStandards] = useState(false);
  const [showPeriodLength, setShowPeriodLength] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [showUDL, setShowUDL] = useState(false);

  const [selectedDistrictData, setSelectedDistrictData] = useState(null);
  const [districtSearchResults, setDistrictSearchResults] = useState([]);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const districtSearchTimeoutRef = useRef(null);
  const districtDropdownRef = useRef(null);

  const handleGradeToggle = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const handleStandardToggle = (standard) => {
    setAlignmentStandards((prev) =>
      prev.includes(standard) ? prev.filter((s) => s !== standard) : [...prev, standard]
    );
  };

  const handleUDLToggle = (strategy) => {
    setUdlStrategies((prev) =>
      prev.includes(strategy) ? prev.filter((s) => s !== strategy) : [...prev, strategy]
    );
  };

  // Handle school district search with debouncing
  const handleDistrictSearch = async (value) => {
    setSchoolDistrict(value);

    if (districtSearchTimeoutRef.current) {
      clearTimeout(districtSearchTimeoutRef.current);
    }

    if (value.trim().length < 2) {
      setShowDistrictDropdown(false);
      setDistrictSearchResults([]);
      return;
    }

    setLoadingDistricts(true);
    setShowDistrictDropdown(true);

    districtSearchTimeoutRef.current = setTimeout(async () => {
      const results = await searchSchoolDistricts(value, 10);
      setDistrictSearchResults(results);
      setLoadingDistricts(false);
    }, 300);
  };

  const handleDistrictSelect = (district) => {
    setSchoolDistrict(district.name);
    setSelectedDistrictData(district);
    setShowDistrictDropdown(false);
    setDistrictSearchResults([]);

    // Auto-suggest standards based on district's state
    if (district.recommendedStandards && district.recommendedStandards.length > 0) {
      setAlignmentStandards((prev) => {
        const newStandards = district.recommendedStandards.filter(
          (standard) => !prev.includes(standard)
        );
        return [...prev, ...newStandards];
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
        setShowDistrictDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGenerate = async () => {
    setLoading(true);

    // Build UDL strategies section if any are selected
    let udlSection = '';
    if (udlStrategies.length > 0) {
      const udlLabels = {
        // Engagement
        'udl-real-world': 'Real-world connections and relevance',
        'udl-choice-autonomy': 'Student choice and autonomy',
        'udl-low-stakes': 'Low-stakes practice opportunities',
        'udl-community': 'Community building activities',
        'udl-feedback': 'Individualized feedback',
        'udl-group-individual': 'Varied group and individual work options',
        // Representation
        'udl-captions-transcripts': 'Captions and transcripts for media',
        'udl-audio-descriptions': 'Audio descriptions for visual content',
        'udl-alt-text': 'Alternative text for images and graphics',
        'udl-clear-vocabulary': 'Clear, accessible vocabulary',
        'udl-visual-aids': 'Visual aids and graphics',
        'udl-highlight-concepts': 'Highlighted key concepts',
        // Action/Expression
        'udl-varied-assessments': 'Varied assessment methods',
        'udl-assignment-options': 'Multiple assignment options',
        'udl-flexible-deadlines': 'Flexible deadlines when appropriate',
        'udl-communication-platforms': 'Multiple communication channels',
        'udl-project-management': 'Project management support',
        'udl-submission-formats': 'Varied submission formats (written, video, audio, etc.)',
      };

      const selectedLabels = udlStrategies.map(s => udlLabels[s]).filter(Boolean);

      udlSection = `
UNIVERSAL DESIGN FOR LEARNING (UDL) REQUIREMENTS:
The lesson must incorporate the following UDL strategies to ensure accessibility and engagement for all learners:
${selectedLabels.map(label => `- ${label}`).join('\n')}

These should be naturally integrated throughout the lesson, not just mentioned as an afterthought.
`;
    }

    // Build comprehensive prompt from backward design data
    const backwardDesignPrompt = `
BACKWARD DESIGN LESSON PLAN

BIG IDEA:
${bigIdea}

ESSENTIAL QUESTIONS:
${essentialQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

LEARNING OBJECTIVES:
${learningObjectives.map((obj) => `- Students will ${obj.text} (${obj.level})`).join('\n')}

ASSESSMENT:
Type: ${assessmentType}
Success Criteria:
${successCriteria}
${udlSection}
INSTRUCTIONS FOR AI:
Generate a comprehensive, backward-designed lesson plan that:
1. HOOKS students with a warm-up that connects to the big idea and essential questions
2. SCAFFOLDS activities that build toward the learning objectives
3. ALIGNS all activities to prepare students for the ${assessmentType}
4. EMBEDS opportunities for students to practice the skills they'll need for assessment
5. FOLLOWS the WHERETO framework:
   - Where: Show students where they're headed (the objectives)
   - Hook: Engage their interest from the start
   - Equip: Provide experiences to build understanding
   - Rethink: Include reflection/revision opportunities
   - Express: Let students express understanding
   - Tailor: Differentiate for diverse learners
   - Organize: Progress from guided to independent work

The lesson should feel coherent - everything should connect back to the big idea and prepare students for the assessment.
`;

    // Build criteria object
    const criteria = {
      grades: selectedGrades,
      standards: alignmentStandards,
      district: schoolDistrict,
      classPeriodLength: classPeriodLength,
      additional: additionalCriteria,
      backwardDesign: backwardDesignPrompt,
    };

    try {
      const result = await run(
        backwardDesignPrompt,
        coursesArray,
        "lessonPlan",
        criteria,
        null
      );

      if (result !== undefined) {
        setLessonPlanResponse(result.content);
        setCompleted(true);
      }
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      alert(`Error: ${error.message || "Something went wrong"}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 p-4" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
        <h5 style={{ color: "#00B894", marginBottom: "1rem" }}>
          🎨 Generate Learning Activities
        </h5>
        <p style={{ color: "#666", fontSize: "0.95rem" }}>
          Now that you've defined your objectives and assessment, let's generate
          activities that scaffold student learning toward those goals.
        </p>
      </div>

      {/* Summary of Backward Design */}
      <div className="mb-4 p-4" style={{ background: "white", border: "2px solid #00B894", borderRadius: "8px" }}>
        <h6 style={{ color: "#00B894", fontWeight: "600", marginBottom: "1rem" }}>
          📊 Your Backward Design Summary
        </h6>

        <div className="mb-3">
          <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600", marginBottom: "0.5rem" }}>
            Big Idea:
          </div>
          <div style={{ fontSize: "0.9rem", fontStyle: "italic" }}>{bigIdea}</div>
        </div>

        <div className="mb-3">
          <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600", marginBottom: "0.5rem" }}>
            Essential Questions ({essentialQuestions.length}):
          </div>
          <ul style={{ marginBottom: 0, fontSize: "0.9rem", paddingLeft: "1.5rem" }}>
            {essentialQuestions.slice(0, 2).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
            {essentialQuestions.length > 2 && (
              <li style={{ color: "#999" }}>+{essentialQuestions.length - 2} more...</li>
            )}
          </ul>
        </div>

        <div className="mb-3">
          <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600", marginBottom: "0.5rem" }}>
            Learning Objectives ({learningObjectives.length}):
          </div>
          <ul style={{ marginBottom: 0, fontSize: "0.9rem", paddingLeft: "1.5rem" }}>
            {learningObjectives.slice(0, 2).map((obj) => (
              <li key={obj.id}>
                <span style={{ color: "#00B894", fontWeight: "600" }}>{obj.level}:</span> {obj.text}
              </li>
            ))}
            {learningObjectives.length > 2 && (
              <li style={{ color: "#999" }}>+{learningObjectives.length - 2} more...</li>
            )}
          </ul>
        </div>

        <div>
          <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: "600", marginBottom: "0.5rem" }}>
            Assessment:
          </div>
          <div style={{ fontSize: "0.9rem" }}>{assessmentType}</div>
        </div>
      </div>

      {/* Optional Criteria Sections */}
      <div className="mb-4">
        <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Optional: Add Lesson Specifications
        </h6>

        {/* Grade Level */}
        <div className="mb-3">
          <button
            onClick={() => setShowGrades(!showGrades)}
            className="toggle-section-btn"
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.9rem",
              border: "none",
              background: "transparent",
              color: showGrades ? "#00B894" : "#666",
              cursor: "pointer",
              fontWeight: showGrades ? "600" : "normal",
              transition: "color 0.2s",
            }}
          >
            <i className={`fa ${showGrades ? "fa-minus" : "fa-plus"} me-2`}></i>
            Grade level
          </button>
        </div>

        <Collapse isOpen={showGrades}>
          <div className="mb-4 p-4" style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
            <div className="d-flex flex-wrap gap-2">
              {["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "College"].map((grade) => (
                <FormGroup check inline key={grade}>
                  <Label
                    check
                    style={{
                      padding: "0.4rem 0.8rem",
                      border: selectedGrades.includes(grade) ? "2px solid #00B894" : "1px solid #ddd",
                      borderRadius: "6px",
                      cursor: "pointer",
                      backgroundColor: selectedGrades.includes(grade) ? "rgba(0, 184, 148, 0.1)" : "white",
                      fontWeight: selectedGrades.includes(grade) ? "600" : "normal",
                      color: selectedGrades.includes(grade) ? "#00B894" : "inherit",
                    }}
                  >
                    <Input
                      type="checkbox"
                      checked={selectedGrades.includes(grade)}
                      onChange={() => handleGradeToggle(grade)}
                      style={{ display: "none" }}
                    />
                    {grade}
                  </Label>
                </FormGroup>
              ))}
            </div>
          </div>
        </Collapse>

        {/* School District */}
        <div className="mb-3">
          <button
            onClick={() => setShowDistrict(!showDistrict)}
            className="toggle-section-btn"
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.9rem",
              border: "none",
              background: "transparent",
              color: showDistrict ? "#00B894" : "#666",
              cursor: "pointer",
              fontWeight: showDistrict ? "600" : "normal",
            }}
          >
            <i className={`fa ${showDistrict ? "fa-minus" : "fa-plus"} me-2`}></i>
            School district
          </button>
        </div>

        <Collapse isOpen={showDistrict}>
          <div className="mb-4 p-4" style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
            <h6 className="mb-3" style={{ color: "#00B894", fontWeight: "600" }}>
              School District
            </h6>
            <small className="text-muted d-block mb-2">
              Start typing to search for your school district
            </small>
            <div className="position-relative" ref={districtDropdownRef}>
              <Input
                type="text"
                value={schoolDistrict}
                onChange={(e) => handleDistrictSearch(e.target.value)}
                onFocus={() => {
                  if (schoolDistrict.trim().length >= 2 && districtSearchResults.length > 0) {
                    setShowDistrictDropdown(true);
                  }
                }}
                placeholder="e.g., Austin, Denver, New York"
                className="mb-2"
                autoComplete="off"
                style={{ borderRadius: "6px", border: "1px solid #ddd" }}
              />
              {showDistrictDropdown && (
                <div
                  className="position-absolute w-100 bg-white border rounded shadow-sm"
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    zIndex: 1000,
                    top: "100%",
                    marginTop: "-0.5rem",
                  }}
                >
                  {loadingDistricts ? (
                    <div className="p-3 text-center text-muted">
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Searching districts...
                    </div>
                  ) : districtSearchResults.length > 0 ? (
                    <ul className="list-unstyled mb-0">
                      {districtSearchResults.map((district, index) => (
                        <li
                          key={`${district.geoid}-${index}`}
                          className="p-2 border-bottom cursor-pointer"
                          style={{ cursor: "pointer", transition: "background-color 0.2s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                          onClick={() => handleDistrictSelect(district)}
                        >
                          <div className="fw-bold">{district.name}</div>
                          <small className="text-muted">{district.state}</small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 text-center text-muted">
                      No districts found. Try a different search term.
                    </div>
                  )}
                </div>
              )}
            </div>
            <small className="text-muted">
              Powered by NCES (National Center for Education Statistics) database
            </small>
          </div>
        </Collapse>

        {/* Standards */}
        <div className="mb-3">
          <button
            onClick={() => setShowStandards(!showStandards)}
            className="toggle-section-btn"
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.9rem",
              border: "none",
              background: "transparent",
              color: showStandards ? "#00B894" : "#666",
              cursor: "pointer",
              fontWeight: showStandards ? "600" : "normal",
            }}
          >
            <i className={`fa ${showStandards ? "fa-minus" : "fa-plus"} me-2`}></i>
            Standards
          </button>
        </div>

        <Collapse isOpen={showStandards}>
          <div className="mb-4 p-4" style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
            <div className="d-flex flex-wrap gap-2">
              {[
                { value: "CCSS", label: "Common Core State Standards (CCSS)" },
                { value: "NGSS", label: "Next Generation Science Standards (NGSS)" },
              ].map((standard) => (
                <FormGroup check key={standard.value}>
                  <Label
                    check
                    style={{
                      padding: "0.4rem 0.8rem",
                      border: alignmentStandards.includes(standard.value) ? "2px solid #00B894" : "1px solid #ddd",
                      borderRadius: "6px",
                      cursor: "pointer",
                      backgroundColor: alignmentStandards.includes(standard.value) ? "rgba(0, 184, 148, 0.1)" : "white",
                      fontWeight: alignmentStandards.includes(standard.value) ? "600" : "normal",
                      color: alignmentStandards.includes(standard.value) ? "#00B894" : "inherit",
                    }}
                  >
                    <Input
                      type="checkbox"
                      checked={alignmentStandards.includes(standard.value)}
                      onChange={() => handleStandardToggle(standard.value)}
                      style={{ display: "none" }}
                    />
                    {standard.label}
                  </Label>
                </FormGroup>
              ))}
            </div>
          </div>
        </Collapse>

        {/* Universal Design for Learning (UDL) */}
        <div className="mb-3">
          <button
            onClick={() => setShowUDL(!showUDL)}
            className="toggle-section-btn"
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.9rem",
              border: "none",
              background: "transparent",
              color: showUDL ? "#00B894" : "#666",
              cursor: "pointer",
              fontWeight: showUDL ? "600" : "normal",
            }}
          >
            <i className={`fa ${showUDL ? "fa-minus" : "fa-plus"} me-2`}></i>
            Universal Design for Learning (UDL)
          </button>
        </div>

        <Collapse isOpen={showUDL}>
          <div className="mb-4 p-4" style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
            <p className="mb-3 text-muted" style={{ fontSize: "0.9rem" }}>
              Select strategies to ensure your lesson is accessible and engaging for all learners.
            </p>

            {/* Multiple Means of Engagement */}
            <div className="mb-4">
              <h6 className="mb-2" style={{ color: "#00B894", fontWeight: "600", fontSize: "0.95rem" }}>
                Multiple Means of Engagement
              </h6>
              <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                How students are motivated to learn
              </p>
              <div className="d-flex flex-wrap gap-2">
                {[
                  { value: "udl-real-world", label: "Real-world connections" },
                  { value: "udl-choice-autonomy", label: "Student choice & autonomy" },
                  { value: "udl-low-stakes", label: "Low-stakes practice" },
                  { value: "udl-community", label: "Community building" },
                  { value: "udl-feedback", label: "Individualized feedback" },
                  { value: "udl-group-individual", label: "Varied group/individual work" },
                ].map((strategy) => (
                  <FormGroup check key={strategy.value}>
                    <Label
                      check
                      style={{
                        padding: "0.4rem 0.8rem",
                        border: udlStrategies.includes(strategy.value) ? "2px solid #00B894" : "1px solid #ddd",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: udlStrategies.includes(strategy.value) ? "rgba(0, 184, 148, 0.1)" : "white",
                        fontWeight: udlStrategies.includes(strategy.value) ? "600" : "normal",
                        color: udlStrategies.includes(strategy.value) ? "#00B894" : "inherit",
                        fontSize: "0.85rem",
                      }}
                    >
                      <Input
                        type="checkbox"
                        checked={udlStrategies.includes(strategy.value)}
                        onChange={() => handleUDLToggle(strategy.value)}
                        style={{ display: "none" }}
                      />
                      {strategy.label}
                    </Label>
                  </FormGroup>
                ))}
              </div>
            </div>

            {/* Multiple Means of Representation */}
            <div className="mb-4">
              <h6 className="mb-2" style={{ color: "#00B894", fontWeight: "600", fontSize: "0.95rem" }}>
                Multiple Means of Representation
              </h6>
              <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                How content is received by students
              </p>
              <div className="d-flex flex-wrap gap-2">
                {[
                  { value: "udl-captions-transcripts", label: "Captions & transcripts" },
                  { value: "udl-audio-descriptions", label: "Audio descriptions" },
                  { value: "udl-alt-text", label: "Alternative text for images" },
                  { value: "udl-clear-vocabulary", label: "Clear vocabulary" },
                  { value: "udl-visual-aids", label: "Visual aids & graphics" },
                  { value: "udl-highlight-concepts", label: "Highlighted key concepts" },
                ].map((strategy) => (
                  <FormGroup check key={strategy.value}>
                    <Label
                      check
                      style={{
                        padding: "0.4rem 0.8rem",
                        border: udlStrategies.includes(strategy.value) ? "2px solid #00B894" : "1px solid #ddd",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: udlStrategies.includes(strategy.value) ? "rgba(0, 184, 148, 0.1)" : "white",
                        fontWeight: udlStrategies.includes(strategy.value) ? "600" : "normal",
                        color: udlStrategies.includes(strategy.value) ? "#00B894" : "inherit",
                        fontSize: "0.85rem",
                      }}
                    >
                      <Input
                        type="checkbox"
                        checked={udlStrategies.includes(strategy.value)}
                        onChange={() => handleUDLToggle(strategy.value)}
                        style={{ display: "none" }}
                      />
                      {strategy.label}
                    </Label>
                  </FormGroup>
                ))}
              </div>
            </div>

            {/* Multiple Means of Action/Expression */}
            <div className="mb-3">
              <h6 className="mb-2" style={{ color: "#00B894", fontWeight: "600", fontSize: "0.95rem" }}>
                Multiple Means of Action & Expression
              </h6>
              <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                How students show their knowledge
              </p>
              <div className="d-flex flex-wrap gap-2">
                {[
                  { value: "udl-varied-assessments", label: "Varied assessment methods" },
                  { value: "udl-assignment-options", label: "Multiple assignment options" },
                  { value: "udl-flexible-deadlines", label: "Flexible deadlines" },
                  { value: "udl-communication-platforms", label: "Multiple communication channels" },
                  { value: "udl-project-management", label: "Project management support" },
                  { value: "udl-submission-formats", label: "Varied submission formats" },
                ].map((strategy) => (
                  <FormGroup check key={strategy.value}>
                    <Label
                      check
                      style={{
                        padding: "0.4rem 0.8rem",
                        border: udlStrategies.includes(strategy.value) ? "2px solid #00B894" : "1px solid #ddd",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: udlStrategies.includes(strategy.value) ? "rgba(0, 184, 148, 0.1)" : "white",
                        fontWeight: udlStrategies.includes(strategy.value) ? "600" : "normal",
                        color: udlStrategies.includes(strategy.value) ? "#00B894" : "inherit",
                        fontSize: "0.85rem",
                      }}
                    >
                      <Input
                        type="checkbox"
                        checked={udlStrategies.includes(strategy.value)}
                        onChange={() => handleUDLToggle(strategy.value)}
                        style={{ display: "none" }}
                      />
                      {strategy.label}
                    </Label>
                  </FormGroup>
                ))}
              </div>
            </div>
          </div>
        </Collapse>

        {/* Class Period Length */}
        <div className="mb-3">
          <button
            onClick={() => setShowPeriodLength(!showPeriodLength)}
            className="toggle-section-btn"
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.9rem",
              border: "none",
              background: "transparent",
              color: showPeriodLength ? "#00B894" : "#666",
              cursor: "pointer",
              fontWeight: showPeriodLength ? "600" : "normal",
            }}
          >
            <i className={`fa ${showPeriodLength ? "fa-minus" : "fa-plus"} me-2`}></i>
            Class period
          </button>
        </div>

        <Collapse isOpen={showPeriodLength}>
          <div className="mb-4 p-4" style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
            <Input
              type="select"
              value={classPeriodLength}
              onChange={(e) => setClassPeriodLength(e.target.value)}
              style={{ borderRadius: "6px", border: "1px solid #ddd" }}
            >
              <option value="">Select duration...</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="50">50 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes (block schedule)</option>
            </Input>
          </div>
        </Collapse>

        {/* Additional Criteria */}
        <div className="mb-3">
          <button
            onClick={() => setShowAdditional(!showAdditional)}
            className="toggle-section-btn"
            style={{
              padding: "0.6rem 1rem",
              fontSize: "0.9rem",
              border: "none",
              background: "transparent",
              color: showAdditional ? "#00B894" : "#666",
              cursor: "pointer",
              fontWeight: showAdditional ? "600" : "normal",
            }}
          >
            <i className={`fa ${showAdditional ? "fa-minus" : "fa-plus"} me-2`}></i>
            Additional criteria
          </button>
        </div>

        <Collapse isOpen={showAdditional}>
          <div className="mb-4 p-4" style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
            <Input
              type="textarea"
              value={additionalCriteria}
              onChange={(e) => setAdditionalCriteria(e.target.value)}
              placeholder="e.g., Include accommodations for ELL students, focus on hands-on activities..."
              rows="3"
              style={{ borderRadius: "6px", border: "1px solid #ddd" }}
            />
          </div>
        </Collapse>
      </div>

      {/* Generate Button */}
      <div className="d-flex justify-content-between gap-2">
        <Button
          color="secondary"
          outline
          onClick={onPrevious}
          disabled={loading}
          style={{ padding: "0.75rem 2rem", borderRadius: "8px" }}
        >
          ← Previous
        </Button>
        <Button
          color="primary"
          onClick={handleGenerate}
          disabled={loading}
          style={{
            backgroundColor: "#00B894",
            border: "none",
            padding: "0.75rem 2.5rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 184, 148, 0.3)",
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Generating...
            </>
          ) : (
            <>
              <i className="fa fa-sparkles me-2"></i>
              Generate Backward-Designed Lesson Plan
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Stage3Activities;
