import React, { useState, useEffect, useRef } from "react";
import { Container, Button, Input, FormGroup, Label, Collapse } from "reactstrap";
import { useSelector } from "react-redux";
import { run } from "../utils/generateAIWarmUps";
import { searchSchoolDistricts } from "../utils/ncesAPI";
import { getSessionId } from "../utils/sessionId";
import LessonPlanDisplay from "./LessonPlanDisplay";
import LessonPlanLoader from "./LessonPlanLoader";

const SimpleLessonPlanner = ({ onCourseClick, onCurriculumGenerated }) => {
  const [topic, setTopic] = useState("");
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [alignmentStandards, setAlignmentStandards] = useState([]);
  const [schoolDistrict, setSchoolDistrict] = useState("");
  const [classPeriodLength, setClassPeriodLength] = useState("");
  const [additionalCriteria, setAdditionalCriteria] = useState("");
  const [udlStrategies, setUdlStrategies] = useState([]);

  // Analytics consent (Phase 2)
  const [analyticsConsent, setAnalyticsConsent] = useState(
    localStorage.getItem('teachleague_analytics_consent') === 'true'
  );

  // UI state
  const [showGrades, setShowGrades] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [showStandards, setShowStandards] = useState(false);
  const [showPeriodLength, setShowPeriodLength] = useState(false);
  const [showUDL, setShowUDL] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);

  // District search state
  const [districtSearchResults, setDistrictSearchResults] = useState([]);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const districtSearchTimeoutRef = useRef(null);
  const districtDropdownRef = useRef(null);

  // Generation state
  const [lessonPlanResponse, setLessonPlanResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const coursesArray = useSelector((state) => state.courses.coursesArray);

  useEffect(() => {
    if (onCurriculumGenerated) {
      onCurriculumGenerated(!!lessonPlanResponse);
    }
  }, [lessonPlanResponse, onCurriculumGenerated]);

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
    setShowDistrictDropdown(false);
    setDistrictSearchResults([]);

    if (district.recommendedStandards && district.recommendedStandards.length > 0) {
      setAlignmentStandards((prev) => {
        const newStandards = district.recommendedStandards.filter(
          (standard) => !prev.includes(standard)
        );
        return [...prev, ...newStandards];
      });
    }
  };

  const handleGenerate = async () => {
    setLoading(true);

    const criteria = {
      grades: selectedGrades,
      standards: alignmentStandards,
      district: schoolDistrict,
      classPeriodLength: classPeriodLength,
      additional: additionalCriteria,
      udlStrategies: udlStrategies,
    };

    // Build metadata for logging (Phase 1 & 2)
    const metadata = {
      analyticsConsent,
      sessionId: getSessionId(),
    };

    try {
      const result = await run(topic, coursesArray, "lessonPlan", criteria, null, metadata);
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

  const handleReset = () => {
    setCompleted(false);
    setTopic("");
    setSelectedGrades([]);
    setAlignmentStandards([]);
    setSchoolDistrict("");
    setClassPeriodLength("");
    setAdditionalCriteria("");
    setUdlStrategies([]);
    setLessonPlanResponse("");
  };

  if (completed && lessonPlanResponse) {
    return (
      <Container style={{ maxWidth: "900px" }}>
        <div className="mb-4">
          <Button
            color="link"
            onClick={handleReset}
            style={{ padding: 0, textDecoration: "none" }}
          >
            ← Start New Lesson Plan
          </Button>
        </div>
        <LessonPlanDisplay
          response={lessonPlanResponse}
          courses={coursesArray}
          onCourseClick={onCourseClick}
        />
      </Container>
    );
  }

  if (loading) {
    return <LessonPlanLoader />;
  }

  return (
    <Container style={{ maxWidth: "900px" }}>
      <div className="mb-5">
        <h2 className="text-center mb-4" style={{ color: "#00B894", fontWeight: "600" }}>
          Lesson Plan Generator
        </h2>
      </div>

      {/* Main Topic Input */}
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
          <div className="mb-4 p-3" style={{ background: "#e8f5f3", borderRadius: "8px", borderLeft: "4px solid #00B894" }}>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#333" }}>
              <strong>Optional:</strong> Add additional criteria to customize your lesson plan
            </p>
          </div>

          <div className="mb-4">
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
                }}
              >
                <i className={`fa ${showGrades ? "fa-minus" : "fa-plus"} me-2`}></i>
                Grade Level
              </button>
            </div>

            <Collapse isOpen={showGrades}>
              <div className="mb-4 p-4" style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
                <div className="d-flex flex-wrap gap-2">
                  {["K-2", "3-5", "6-8", "9-12", "College/Adult"].map((grade) => (
                    <FormGroup check key={grade}>
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
                School District
              </button>
            </div>

            <Collapse isOpen={showDistrict}>
              <div className="mb-4 p-4" style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
                <div className="position-relative" ref={districtDropdownRef}>
                  <Input
                    type="text"
                    value={schoolDistrict}
                    onChange={(e) => handleDistrictSearch(e.target.value)}
                    placeholder="Search for your school district..."
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

          {/* Analytics Consent Checkbox */}
          <div className="mb-3 text-center" style={{ fontSize: "0.9rem" }}>
            <FormGroup check>
              <Label check style={{ cursor: "pointer", color: "#666" }}>
                <Input
                  type="checkbox"
                  checked={analyticsConsent}
                  onChange={(e) => {
                    const consent = e.target.checked;
                    setAnalyticsConsent(consent);
                    localStorage.setItem('teachleague_analytics_consent', consent);
                  }}
                  style={{ cursor: "pointer" }}
                />
                {' '}Help improve TeachLeague by sharing anonymized usage data
              </Label>
            </FormGroup>
          </div>

          {/* Generate Button */}
          <div className="text-center mt-4">
            <Button
              color="primary"
              onClick={handleGenerate}
              disabled={topic.trim().length < 10}
              size="lg"
              style={{
                backgroundColor: "#00B894",
                border: "none",
                padding: "1rem 3rem",
                fontSize: "1.1rem",
                fontWeight: "600",
                borderRadius: "8px",
              }}
            >
              Generate Lesson Plan
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default SimpleLessonPlanner;
