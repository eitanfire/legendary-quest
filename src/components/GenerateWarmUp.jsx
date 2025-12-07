import React, { useState, useEffect, useRef } from "react";
import { Container, Row, FormGroup, Label, Input, Collapse } from "reactstrap";
import { useSelector } from "react-redux";
import { run } from "../utils/generateAIWarmUps";
import { inspectCourseData } from "../utils/inspectFirestoreData";
import { searchSchoolDistricts } from "../utils/ncesAPI";
import { getSessionId } from "../utils/sessionId";

const GenerateWarmUp = ({ onCourseClick, onCurriculumGenerated }) => {
  const [userInput, setUserInput] = useState("");
  const [warmUpResponse, setWarmUpResponse] = useState("");
  const [lessonPlanResponse, setLessonPlanResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [generateWarmUp, setGenerateWarmUp] = useState(true);
  const [generateLessonPlan, setGenerateLessonPlan] = useState(true);

  // Analytics consent (Phase 2)
  const [analyticsConsent, setAnalyticsConsent] = useState(
    localStorage.getItem('teachleague_analytics_consent') === 'true'
  );

  // AI Provider will use default from .env with automatic fallback

  // New criteria fields
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [showPoliticalPerspective, setShowPoliticalPerspective] = useState(false);
  const [politicalLeaning, setPoliticalLeaning] = useState('centrist');
  const [alignmentStandards, setAlignmentStandards] = useState([]);
  const [schoolDistrict, setSchoolDistrict] = useState('');
  const [selectedDistrictData, setSelectedDistrictData] = useState(null);
  const [districtSearchResults, setDistrictSearchResults] = useState([]);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [classPeriodLength, setClassPeriodLength] = useState('');
  const [customPeriodLength, setCustomPeriodLength] = useState('');
  const [additionalCriteria, setAdditionalCriteria] = useState('');

  // Collapsible section states
  const [showGrades, setShowGrades] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [showStandards, setShowStandards] = useState(false);
  const [showPeriodLength, setShowPeriodLength] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);
  const [showGenOptions, setShowGenOptions] = useState(false);

  const districtSearchTimeoutRef = useRef(null);
  const districtDropdownRef = useRef(null);

  const coursesArray = useSelector((state) => state.courses.coursesArray);

  // Inspect Firestore data when courses load (run once)
  useEffect(() => {
    if (coursesArray && coursesArray.length > 0) {
      console.log('🔍 Inspecting Firestore course data...');
      inspectCourseData(coursesArray);
    }
  }, [coursesArray.length]); // Only run when courses are first loaded


  // Notify parent when curriculum is generated or cleared
  useEffect(() => {
    if (onCurriculumGenerated) {
      const hasContent = warmUpResponse || lessonPlanResponse;
      onCurriculumGenerated(!!hasContent);
    }
  }, [warmUpResponse, lessonPlanResponse, onCurriculumGenerated]);


  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleWarmUpToggle = () => {
    setGenerateWarmUp(!generateWarmUp);
  };

  const handleLessonPlanToggle = () => {
    setGenerateLessonPlan(!generateLessonPlan);
  };

  const handleGradeToggle = (grade) => {
    setSelectedGrades(prev =>
      prev.includes(grade)
        ? prev.filter(g => g !== grade)
        : [...prev, grade]
    );
  };

  const handleStandardToggle = (standard) => {
    setAlignmentStandards(prev =>
      prev.includes(standard)
        ? prev.filter(s => s !== standard)
        : [...prev, standard]
    );
  };

  // Handle school district search with debouncing
  const handleDistrictSearch = async (value) => {
    setSchoolDistrict(value);

    // Clear previous timeout
    if (districtSearchTimeoutRef.current) {
      clearTimeout(districtSearchTimeoutRef.current);
    }

    // If search term is too short, hide dropdown
    if (value.trim().length < 2) {
      setShowDistrictDropdown(false);
      setDistrictSearchResults([]);
      return;
    }

    // Set loading state
    setLoadingDistricts(true);
    setShowDistrictDropdown(true);

    // Debounce the API call (wait 300ms after user stops typing)
    districtSearchTimeoutRef.current = setTimeout(async () => {
      const results = await searchSchoolDistricts(value, 10);
      setDistrictSearchResults(results);
      setLoadingDistricts(false);
    }, 300);
  };

  // Handle district selection from dropdown
  const handleDistrictSelect = (district) => {
    setSchoolDistrict(district.name);
    setSelectedDistrictData(district);
    setShowDistrictDropdown(false);
    setDistrictSearchResults([]);

    // Auto-suggest standards based on district's state
    if (district.recommendedStandards && district.recommendedStandards.length > 0) {
      // Add recommended standards that aren't already selected
      setAlignmentStandards(prev => {
        const newStandards = district.recommendedStandards.filter(
          standard => !prev.includes(standard)
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submit - Courses available:', coursesArray?.length);

    // Clear previous responses
    setWarmUpResponse("");
    setLessonPlanResponse("");

    // Build criteria object
    const criteria = {
      grades: selectedGrades,
      politicalLeaning: showPoliticalPerspective ? politicalLeaning : null,
      standards: alignmentStandards,
      district: schoolDistrict,
      classPeriodLength: classPeriodLength === 'custom' ? customPeriodLength : classPeriodLength,
      additional: additionalCriteria
    };

    // Build metadata for logging (Phase 1 & 2)
    const metadata = {
      analyticsConsent,
      sessionId: getSessionId(),
    };

    try {
      // Generate warm-up if checked
      if (generateWarmUp) {
        const warmUpResult = await run(userInput, coursesArray, 'warmUp', criteria, null, metadata);
        if (warmUpResult !== undefined) {
          setWarmUpResponse(warmUpResult.content);
        }
      }

      // Generate lesson plan if checked
      if (generateLessonPlan) {
        const lessonPlanResult = await run(userInput, coursesArray, 'lessonPlan', criteria, null, metadata);
        if (lessonPlanResult !== undefined) {
          setLessonPlanResponse(lessonPlanResult.content);
        }
      }

      if (!generateWarmUp && !generateLessonPlan) {
        setWarmUpResponse("Please select at least one option to generate.");
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      console.error("Error details:", error.message, error.stack);
      const errorMsg = `Error: ${error.message || 'Something went wrong'}. Please try again.`;
      if (generateWarmUp) setWarmUpResponse(errorMsg);
      if (generateLessonPlan) setLessonPlanResponse(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handle1stButtonClick = () => {
    const exampleText = "Analyze primary sources to understand the Revolutionary War";
    setUserInput(exampleText);
  };

    const handle2ndButtonClick = () => {
      const exampleText = "How do different economic and government systems affect how countries respond to challenges?";
      setUserInput(exampleText);
    };

     const handle3rdButtonClick = () => {
       const exampleText = "Examine factors that motivated the military and economic expansion from the American Revolution through Reconstruction.";
       setUserInput(exampleText);
     };

  return (
    <Container
      className="curriculum-generator-container"
      style={{ maxWidth: "900px" }}
    >
      <Row>
        <div className="ai-input-field-modern">
          {/* Main Prompt Textarea - Large and Centered */}
          <div className="mb-4">
            <textarea
              className="prompt-textarea-modern"
              value={userInput}
              onChange={handleInputChange}
              placeholder="What topic and skills will you be exploring in today's lesson?"
              rows="4"
              style={{
                width: "100%",
                padding: "1rem",
                fontSize: "1.1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                resize: "vertical",
                fontFamily: "inherit",
                transition: "border-color 0.2s, box-shadow 0.2s",
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
          </div>

          {/* Example Prompt Chips */}
          <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
            <button
              className="example-chip"
              onClick={handle1stButtonClick}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                border: "1px solid #ddd",
                borderRadius: "20px",
                background: "white",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#00B894";
                e.target.style.color = "#00B894";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#ddd";
                e.target.style.color = "inherit";
              }}
            >
              Analyze primary sources to understand the Revolutionary War{" "}
            </button>
            <button
              className="example-chip"
              onClick={handle2ndButtonClick}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                border: "1px solid #ddd",
                borderRadius: "20px",
                background: "white",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#00B894";
                e.target.style.color = "#00B894";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#ddd";
                e.target.style.color = "inherit";
              }}
            >
              How do different economic and government systems affect how
              countries respond to challenges?
            </button>
            <button
              className="example-chip"
              onClick={handle3rdButtonClick}
              disabled={loading}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                border: "1px solid #ddd",
                borderRadius: "20px",
                background: "white",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#00B894";
                e.target.style.color = "#00B894";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#ddd";
                e.target.style.color = "inherit";
              }}
            >
              Examine factors that motivated the military and economic expansion
              from the American Revolution through Reconstruction.
            </button>
          </div>

          {/* Grade Level Section */}
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
              <i
                className={`fa ${showGrades ? "fa-minus" : "fa-plus"} me-2`}
              ></i>
              Grade level
            </button>
          </div>

          {/* Student Grade Level - Collapsible */}
          <Collapse isOpen={showGrades}>
            <div
              className="mb-4 p-4"
              style={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h6
                className="mb-3"
                style={{ color: "#00B894", fontWeight: "600" }}
              >
                Student Grade Level
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {[
                  "K",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                  "College",
                ].map((grade) => (
                  <FormGroup check inline key={grade} className="me-2">
                    <Label
                      check
                      style={{
                        padding: "0.4rem 0.8rem",
                        border: selectedGrades.includes(grade)
                          ? "2px solid #00B894"
                          : "1px solid #ddd",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: selectedGrades.includes(grade)
                          ? "rgba(0, 184, 148, 0.1)"
                          : "white",
                        fontWeight: selectedGrades.includes(grade)
                          ? "600"
                          : "normal",
                        color: selectedGrades.includes(grade)
                          ? "#00B894"
                          : "inherit",
                        transition: "all 0.2s",
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

          {/* Political Perspective - Toggle Section - COMMENTED OUT FOR POSSIBLE LATER USE */}
          {/* <div className="mb-4 p-3 bg-light border rounded">
            <FormGroup check className="mb-2">
              <Label check className="d-flex align-items-center">
                <Input
                  type="checkbox"
                  checked={showPoliticalPerspective}
                  onChange={() =>
                    setShowPoliticalPerspective(!showPoliticalPerspective)
                  }
                  className="me-2"
                />
                <h5 className="mb-0">Include Political Perspective Rating</h5>
              </Label>
            </FormGroup>

            {showPoliticalPerspective && (
              <div className="mt-3">
                <small className="text-muted d-block mb-2">
                  How would you rate the political perspective of this content?
                  (Self-rated by curriculum creators and reviewed by community)
                </small>
                <FormGroup>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold">Progressive</span>
                    <span className="fw-bold">Centrist</span>
                    <span className="fw-bold">Conservative</span>
                  </div>
                  <Input
                    type="range"
                    min="1"
                    max="5"
                    value={
                      politicalLeaning === "progressive"
                        ? 1
                        : politicalLeaning === "moderate-progressive"
                        ? 2
                        : politicalLeaning === "centrist"
                        ? 3
                        : politicalLeaning === "moderate-conservative"
                        ? 4
                        : 5
                    }
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setPoliticalLeaning(
                        val === 1
                          ? "progressive"
                          : val === 2
                          ? "moderate-progressive"
                          : val === 3
                          ? "centrist"
                          : val === 4
                          ? "moderate-conservative"
                          : "conservative"
                      );
                    }}
                    className="form-range"
                  />
                  <div className="text-center mt-2">
                    <span className="badge bg-info">
                      {politicalLeaning === "progressive"
                        ? "Progressive"
                        : politicalLeaning === "moderate-progressive"
                        ? "Moderate Progressive"
                        : politicalLeaning === "centrist"
                        ? "Centrist"
                        : politicalLeaning === "moderate-conservative"
                        ? "Moderate Conservative"
                        : "Conservative"}
                    </span>
                  </div>
                </FormGroup>
              </div>
            )}
          </div> */}

          {/* School District Section */}
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
                transition: "color 0.2s",
              }}
            >
              <i
                className={`fa ${showDistrict ? "fa-minus" : "fa-plus"} me-2`}
              ></i>
              School district
            </button>
          </div>

          {/* School District - Collapsible */}
          <Collapse isOpen={showDistrict}>
            <div
              className="mb-4 p-4"
              style={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h6
                className="mb-3"
                style={{ color: "#00B894", fontWeight: "600" }}
              >
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
                    if (
                      schoolDistrict.trim().length >= 2 &&
                      districtSearchResults.length > 0
                    ) {
                      setShowDistrictDropdown(true);
                    }
                  }}
                  placeholder="e.g., Austin, Denver, New York"
                  className="mb-2"
                  autoComplete="off"
                  style={{
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Searching districts...
                      </div>
                    ) : districtSearchResults.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {districtSearchResults.map((district, index) => (
                          <li
                            key={`${district.geoid}-${index}`}
                            className="p-2 border-bottom cursor-pointer"
                            style={{
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f8f9fa")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "white")
                            }
                            onClick={() => handleDistrictSelect(district)}
                          >
                            <div className="fw-bold">{district.name}</div>
                            <small className="text-muted">
                              {district.state}
                            </small>
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
                Powered by NCES (National Center for Education Statistics)
                database
              </small>
            </div>
          </Collapse>

          {/* Alignment Standards Section */}
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
                transition: "color 0.2s",
              }}
            >
              <i
                className={`fa ${showStandards ? "fa-minus" : "fa-plus"} me-2`}
              ></i>
              Standards
            </button>
          </div>

          {/* Alignment Standards - Collapsible */}
          <Collapse isOpen={showStandards}>
            <div
              className="mb-4 p-4"
              style={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h6
                className="mb-3"
                style={{ color: "#00B894", fontWeight: "600" }}
              >
                Alignment Standards
              </h6>

              {/* Nationwide Standards Section */}
              <div className="mb-4">
                <h6
                  className="mb-2"
                  style={{ fontSize: "0.9rem", fontWeight: "600" }}
                >
                  Nationwide Standards
                </h6>
                <small className="text-muted d-block mb-2">
                  Available to all districts across the United States
                </small>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    {
                      value: "CCSS",
                      label: "Common Core State Standards (CCSS)",
                    },
                    {
                      value: "NGSS",
                      label: "Next Generation Science Standards (NGSS)",
                    },
                  ].map((standard) => (
                    <FormGroup check key={standard.value} className="mb-2">
                      <Label
                        check
                        style={{
                          padding: "0.4rem 0.8rem",
                          border: alignmentStandards.includes(standard.value)
                            ? "2px solid #00B894"
                            : "1px solid #ddd",
                          borderRadius: "6px",
                          cursor: "pointer",
                          backgroundColor: alignmentStandards.includes(
                            standard.value
                          )
                            ? "rgba(0, 184, 148, 0.1)"
                            : "white",
                          fontWeight: alignmentStandards.includes(
                            standard.value
                          )
                            ? "600"
                            : "normal",
                          color: alignmentStandards.includes(standard.value)
                            ? "#00B894"
                            : "inherit",
                          transition: "all 0.2s",
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

              {/* State-Specific Standards Section */}
              {selectedDistrictData && (
                <div className="mb-4 p-3 bg-white border rounded">
                  <h6 className="mb-2 text-success">
                    <span className="me-2">✓</span>
                    {selectedDistrictData.state} State Standards
                  </h6>
                  <small className="text-muted d-block mb-2">
                    Standards specific to {selectedDistrictData.state}
                  </small>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedDistrictData.stateStandards &&
                      selectedDistrictData.stateStandards.map((standard) => (
                        <FormGroup check key={standard.value} className="mb-2">
                          <Label check className="fw-bold">
                            <Input
                              type="checkbox"
                              checked={alignmentStandards.includes(
                                standard.value
                              )}
                              onChange={() =>
                                handleStandardToggle(standard.value)
                              }
                              className="me-2"
                            />
                            {standard.label}
                            <span
                              className="badge bg-success ms-2"
                              style={{ fontSize: "0.7rem" }}
                            >
                              Recommended
                            </span>
                          </Label>
                        </FormGroup>
                      ))}
                  </div>
                </div>
              )}

              {/* Other Standards */}
              <div>
                <h6
                  className="mb-2"
                  style={{ fontSize: "0.9rem", fontWeight: "600" }}
                >
                  Other Standards
                </h6>
                <small className="text-muted d-block mb-2">
                  International or alternative standards (e.g., IB, Cambridge,
                  Australian Curriculum)
                </small>
                <Input
                  type="text"
                  id="otherStandards"
                  placeholder="Enter custom standards..."
                  value={
                    alignmentStandards
                      .find((s) => s.startsWith("Other:"))
                      ?.substring(6) || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setAlignmentStandards((prev) => {
                      // Remove any existing "Other:" entries
                      const filtered = prev.filter(
                        (s) => !s.startsWith("Other:")
                      );
                      // Add new value if not empty
                      return value.trim()
                        ? [...filtered, `Other:${value}`]
                        : filtered;
                    });
                  }}
                  style={{
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>
          </Collapse>

          {/* Class Period Length Section */}
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
                transition: "color 0.2s",
              }}
            >
              <i
                className={`fa ${showPeriodLength ? "fa-minus" : "fa-plus"} me-2`}
              ></i>
              Class period length
            </button>
          </div>

          {/* Class Period Length - Collapsible */}
          <Collapse isOpen={showPeriodLength}>
            <div
              className="mb-4 p-4"
              style={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h6
                className="mb-3"
                style={{ color: "#00B894", fontWeight: "600" }}
              >
                Class Period Length
              </h6>
              <small className="text-muted d-block mb-2">
                Select the duration of your class period to help tailor activity
                timing
              </small>
              <Input
                type="select"
                value={classPeriodLength}
                onChange={(e) => setClassPeriodLength(e.target.value)}
                className="mb-2"
                style={{
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="">Select duration...</option>
                <option value="30">30 minutes</option>
                <option value="40">40 minutes</option>
                <option value="45">45 minutes</option>
                <option value="50">50 minutes</option>
                <option value="55">55 minutes</option>
                <option value="60">60 minutes</option>
                <option value="75">75 minutes</option>
                <option value="90">90 minutes (block schedule)</option>
                <option value="custom">Custom duration</option>
              </Input>
              {classPeriodLength === "custom" && (
                <div className="mt-3">
                  <Label for="customDuration">
                    Enter custom duration (in minutes):
                  </Label>
                  <Input
                    type="number"
                    id="customDuration"
                    value={customPeriodLength}
                    onChange={(e) => setCustomPeriodLength(e.target.value)}
                    placeholder="e.g., 80"
                    min="1"
                    max="240"
                    style={{
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}
            </div>
          </Collapse>

          {/* Additional Criteria Section */}
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
                transition: "color 0.2s",
              }}
            >
              <i
                className={`fa ${showAdditional ? "fa-minus" : "fa-plus"} me-2`}
              ></i>
              Additional criteria
            </button>
          </div>

          {/* Additional Criteria - Collapsible */}
          <Collapse isOpen={showAdditional}>
            <div
              className="mb-4 p-4"
              style={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h6
                className="mb-3"
                style={{ color: "#00B894", fontWeight: "600" }}
              >
                Additional Criteria
              </h6>
              <small className="text-muted d-block mb-2">
                Any other specific requirements, accommodations, or preferences?
              </small>
              <Input
                type="textarea"
                value={additionalCriteria}
                onChange={(e) => setAdditionalCriteria(e.target.value)}
                placeholder="e.g., Include visual aids for ELL students, focus on hands-on activities, etc."
                rows="3"
                style={{
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          </Collapse>

          {/* Generation Options Section */}
          <div className="mb-3">
            <button
              onClick={() => setShowGenOptions(!showGenOptions)}
              className="toggle-section-btn"
              style={{
                padding: "0.6rem 1rem",
                fontSize: "0.9rem",
                border: "none",
                background: "transparent",
                color: showGenOptions ? "#00B894" : "#666",
                cursor: "pointer",
                fontWeight: showGenOptions ? "600" : "normal",
                transition: "color 0.2s",
              }}
            >
              <i
                className={`fa ${showGenOptions ? "fa-minus" : "fa-plus"} me-2`}
              ></i>
              Generation options
            </button>
          </div>

          {/* Generation Type Toggles - Collapsible */}
          <Collapse isOpen={showGenOptions}>
            <div
              className="mb-4 p-4"
              style={{
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h6
                className="mb-3"
                style={{ color: "#00B894", fontWeight: "600" }}
              >
                What would you like to generate?
              </h6>
              <FormGroup check className="mb-2">
                <Label check className="d-flex align-items-center">
                  <Input
                    type="checkbox"
                    checked={generateWarmUp}
                    onChange={handleWarmUpToggle}
                    className="me-2"
                  />
                  <span style={{ fontSize: "1rem" }}>
                    Generate Warm-Up Question
                  </span>
                </Label>
              </FormGroup>
              <FormGroup check className="mb-2">
                <Label check className="d-flex align-items-center">
                  <Input
                    type="checkbox"
                    checked={generateLessonPlan}
                    onChange={handleLessonPlanToggle}
                    className="me-2"
                  />
                  <span style={{ fontSize: "1rem" }}>Generate Lesson Plan</span>
                </Label>
              </FormGroup>
              <FormGroup check className="mb-2">
                <Label
                  check
                  className="d-flex align-items-center"
                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                >
                  <Input type="checkbox" disabled className="me-2" />
                  <span style={{ fontSize: "1rem" }}>
                    Generate Unit Plan{" "}
                    <span className="badge bg-secondary ms-2">
                      Coming Soon - Premium
                    </span>
                  </span>
                </Label>
              </FormGroup>
              <div className="mt-2 text-muted" style={{ fontSize: "0.85rem" }}>
                {generateWarmUp &&
                  generateLessonPlan &&
                  "Will generate: Warm-Up Question + Full Lesson Plan"}
                {generateWarmUp &&
                  !generateLessonPlan &&
                  "Will generate: Warm-Up Question only"}
                {!generateWarmUp &&
                  generateLessonPlan &&
                  "Will generate: Full Lesson Plan only"}
                {!generateWarmUp &&
                  !generateLessonPlan &&
                  "Please select at least one option"}
              </div>
            </div>
          </Collapse>

          {/* Submit Button */}
          <form onSubmit={handleSubmit} className="mb-4">
            {/* Analytics Consent */}
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

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "white",
                backgroundColor: "#00B894",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(0, 184, 148, 0.3)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#00a082";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(0, 184, 148, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#00B894";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(0, 184, 148, 0.3)";
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fa fa-sparkles me-2"></i>
                  Generate
                </>
              )}
            </button>
          </form>

          {warmUpResponse && (
            <WarmUpDisplay
              response={warmUpResponse}
              courses={coursesArray}
              onCourseClick={onCourseClick}
            />
          )}
          {lessonPlanResponse && (
            <LessonPlanDisplay
              response={lessonPlanResponse}
              courses={coursesArray}
              onCourseClick={onCourseClick}
            />
          )}
        </div>
      </Row>
    </Container>
  );
};

// Main Warm-Up Display Component with Copy Button
const WarmUpDisplay = ({ response, courses, onCourseClick }) => {
  const [copied, setCopied] = React.useState(false);

  // Split response into main warm-up and recommendations
  const { warmUp, recommendations } = parseWarmUpResponse(response);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(warmUp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="warm-up-output mt-4">
      {/* Main Warm-Up Question */}
      <div className="warm-up-question-section p-4 mb-3 bg-white border rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h3 className="mb-0">
            <span className="me-2">💡</span>
            Warm-Up Question
          </h3>
          <button
            onClick={handleCopy}
            className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-primary'}`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <span className="me-1">✓</span>
                Copied!
              </>
            ) : (
              <>
                <span className="me-1">📋</span>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="warm-up-text" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
          {warmUp}
        </div>
      </div>

      {/* Course Recommendations Section (if any) */}
      {recommendations && (
        <div className="course-recommendations-section p-4 bg-light border border-info rounded">
          <h4 className="mb-3">
            <span className="me-2">📚</span>
            Recommended Courses for Deeper Learning
          </h4>
          <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            <CourseLinksParser
              text={recommendations}
              courses={courses}
              onCourseClick={onCourseClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Parse response to separate warm-up from recommendations
const parseWarmUpResponse = (response) => {
  // COMMENTED OUT - Don't extract course recommendations from warm-ups
  // const separators = [
  //   /\n\n(?:For deeper learning|To explore|Related courses?|Recommended|Suggestion)/i,
  //   /\n\n(?:Students could|You might also|Consider)/i,
  // ];
  //
  // for (const separator of separators) {
  //   const match = response.match(separator);
  //   if (match) {
  //     return {
  //       warmUp: response.substring(0, match.index).trim(),
  //       recommendations: response.substring(match.index).trim(),
  //     };
  //   }
  // }
  //
  // // If no clear separator, check if response mentions courses in a separate paragraph
  // const paragraphs = response.split('\n\n');
  // if (paragraphs.length > 1) {
  //   const lastParagraph = paragraphs[paragraphs.length - 1];
  //   // If last paragraph mentions exploring/checking/courses, treat it as recommendations
  //   if (/(?:explore|check out|course|TeachLeague)/i.test(lastParagraph)) {
  //     return {
  //       warmUp: paragraphs.slice(0, -1).join('\n\n').trim(),
  //       recommendations: lastParagraph.trim(),
  //     };
  //   }
  // }

  // Return entire response as warm-up (no separate recommendations section)
  return {
    warmUp: response,
    recommendations: null,
  };
};

// Component to make course names clickable
const CourseLinksParser = ({ text, courses, onCourseClick }) => {
  if (!text || !courses || courses.length === 0) {
    return <p>{text}</p>;
  }

  // Create a regex pattern from course names
  const courseNames = courses.map(c => c.name);
  const pattern = courseNames.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

  // Debug: Log if any courses are found in the text
  const matches = text.match(regex);
  if (matches && matches.length > 0) {
    console.log('CourseLinksParser found courses:', matches);
  } else {
    console.log('CourseLinksParser - No course matches found in text:', text.substring(0, 100));
    console.log('Available course names:', courseNames.slice(0, 5));
  }

  // Split the text by course names and create clickable links
  const parts = [];
  let lastIndex = 0;
  let match;

  const regexCopy = new RegExp(regex.source, regex.flags);
  while ((match = regexCopy.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Find the actual course object (case-insensitive match)
    const matchedCourseName = match[0];
    const course = courses.find(
      c => c.name.toLowerCase() === matchedCourseName.toLowerCase()
    );

    // Add clickable course name
    if (course && onCourseClick) {
      parts.push(
        <button
          key={`course-${match.index}`}
          onClick={() => onCourseClick(course)}
          className="btn btn-link p-0 text-primary fw-bold"
          style={{
            textDecoration: 'underline',
            verticalAlign: 'baseline',
            fontSize: 'inherit',
            border: 'none',
            background: 'none'
          }}
        >
          {matchedCourseName}
        </button>
      );
    } else {
      parts.push(matchedCourseName);
    }

    lastIndex = regexCopy.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <p className="mb-0">{parts}</p>;
};

// Lesson Plan Display Component with Markdown Rendering and Link Handling
const LessonPlanDisplay = ({ response, courses, onCourseClick }) => {
  const [copied, setCopied] = React.useState(false);

  // Split response into main lesson plan and course recommendations
  const { lessonPlan, recommendations } = parseLessonPlanResponse(response);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lessonPlan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePrint = () => {
    // Collect warm-up content if it exists
    const warmupElement = document.querySelector('.warm-up-output');
    const warmupHTML = warmupElement ? warmupElement.innerHTML : '';

    // Collect lesson plan content
    const lessonPlanElement = document.querySelector('.lesson-plan-output');
    const lessonPlanHTML = lessonPlanElement ? lessonPlanElement.innerHTML : '';

    // Create a new window with clean print content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lesson Plan</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #000;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 1cm;
            }
            h2, h3, h4 {
              color: #000;
              margin-top: 1em;
              margin-bottom: 0.5em;
            }
            a {
              color: #0066cc;
              text-decoration: underline;
            }
            button, .no-print {
              display: none !important;
            }
            .warm-up-output, .lesson-plan-output {
              margin-bottom: 2em;
            }
            @media print {
              body { margin: 1cm; }
              button, .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${warmupHTML}
          ${lessonPlanHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="lesson-plan-output mt-4">
      {/* Main Lesson Plan */}
      <div className="lesson-plan-section p-4 mb-3 bg-white border rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h3 className="mb-0">
            <span className="me-2">📝</span>
            Lesson Plan
          </h3>
          <div className="no-print">
            <button
              onClick={handlePrint}
              className="btn btn-sm btn-outline-secondary me-2"
              title="Print lesson plan"
            >
              <span className="me-1">🖨️</span>
              Print
            </button>
            <button
              onClick={handleCopy}
              className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-primary'}`}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <span className="me-1">✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <span className="me-1">📋</span>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
        <div className="lesson-plan-content" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          <MarkdownWithLinks
            text={lessonPlan}
            courses={courses}
            onCourseClick={onCourseClick}
          />
        </div>
      </div>

      {/* Course Recommendations Section (if any) */}
      {recommendations && (
        <div className="course-recommendations-section p-4 bg-light border border-info rounded">
          <h4 className="mb-3">
            <span className="me-2">📚</span>
            Related Courses for Extended Learning
          </h4>
          <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            <CourseLinksParser
              text={recommendations}
              courses={courses}
              onCourseClick={onCourseClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Parse lesson plan response to separate main content from recommendations
// COMMENTED OUT - Don't extract course recommendations from lesson plans
const parseLessonPlanResponse = (response) => {
  // DISABLED: Related Courses section extraction
  // const relatedCoursesMatch = response.match(/##?\s*Related Courses?[\s\S]*$/i);
  //
  // if (relatedCoursesMatch) {
  //   return {
  //     lessonPlan: response.substring(0, relatedCoursesMatch.index).trim(),
  //     recommendations: relatedCoursesMatch[0].replace(/##?\s*Related Courses?/i, '').trim(),
  //   };
  // }

  // Return entire response as lesson plan (no separate recommendations section)
  return {
    lessonPlan: response,
    recommendations: null,
  };
};

// Component to render markdown with clickable links and course names
const MarkdownWithLinks = ({ text, courses, onCourseClick }) => {
  if (!text) return null;

  // Parse markdown and convert to JSX
  const lines = text.split('\n');
  const elements = [];
  let inList = false;
  let listItems = [];

  const processLine = (line, index) => {
    // Handle markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const courseNames = courses?.map(c => c.name) || [];
    const coursePattern = courseNames.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const courseRegex = new RegExp(`\\b(${coursePattern})\\b`, 'gi');

    let parts = [];
    let lastIndex = 0;
    let match;

    // First, handle markdown links
    const tempParts = [];
    while ((match = linkRegex.exec(line)) !== null) {
      // Add text before link
      if (match.index > lastIndex) {
        tempParts.push({ type: 'text', content: line.substring(lastIndex, match.index) });
      }
      // Add link
      tempParts.push({ type: 'link', text: match[1], url: match[2] });
      lastIndex = linkRegex.lastIndex;
    }
    // Add remaining text
    if (lastIndex < line.length) {
      tempParts.push({ type: 'text', content: line.substring(lastIndex) });
    }

    // Now process each part for course names
    let partKey = 0;
    for (const part of tempParts) {
      if (part.type === 'link') {
        parts.push(
          <a
            key={`link-${index}-${partKey++}`}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary fw-bold"
            style={{ textDecoration: 'underline' }}
          >
            {part.text}
          </a>
        );
      } else {
        // Process text for course names
        const textParts = [];
        let textLastIndex = 0;
        const courseRegexCopy = new RegExp(courseRegex.source, courseRegex.flags);
        let courseMatch;

        while ((courseMatch = courseRegexCopy.exec(part.content)) !== null) {
          if (courseMatch.index > textLastIndex) {
            textParts.push(part.content.substring(textLastIndex, courseMatch.index));
          }

          const matchedCourseName = courseMatch[0];
          const course = courses.find(
            c => c.name.toLowerCase() === matchedCourseName.toLowerCase()
          );

          if (course && onCourseClick) {
            textParts.push(
              <button
                key={`course-${index}-${partKey++}`}
                onClick={() => onCourseClick(course)}
                className="btn btn-link p-0 text-primary fw-bold"
                style={{
                  textDecoration: 'underline',
                  verticalAlign: 'baseline',
                  fontSize: 'inherit',
                  border: 'none',
                  background: 'none'
                }}
              >
                {matchedCourseName}
              </button>
            );
          } else {
            textParts.push(matchedCourseName);
          }

          textLastIndex = courseRegexCopy.lastIndex;
        }

        if (textLastIndex < part.content.length) {
          textParts.push(part.content.substring(textLastIndex));
        }

        parts.push(...textParts);
      }
    }

    return parts.length > 0 ? parts : line;
  };

  lines.forEach((line, index) => {
    // Handle headers
    if (line.startsWith('### ')) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} className="mb-3">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h5 key={index} className="mt-3 mb-2 fw-bold">{processLine(line.substring(4), index)}</h5>);
    } else if (line.startsWith('## ')) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} className="mb-3">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h4 key={index} className="mt-4 mb-3 fw-bold text-primary">{processLine(line.substring(3), index)}</h4>);
    } else if (line.startsWith('# ')) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} className="mb-3">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h3 key={index} className="mt-4 mb-3 fw-bold">{processLine(line.substring(2), index)}</h3>);
    }
    // Handle bullet points
    else if (line.match(/^[\s]*[-*]\s/)) {
      const content = line.replace(/^[\s]*[-*]\s/, '');
      listItems.push(<li key={index}>{processLine(content, index)}</li>);
      inList = true;
    }
    // Handle numbered lists
    else if (line.match(/^[\s]*\d+\.\s/)) {
      const content = line.replace(/^[\s]*\d+\.\s/, '');
      listItems.push(<li key={index}>{processLine(content, index)}</li>);
      inList = true;
    }
    // Handle bold text
    else if (line.match(/\*\*.*\*\*/)) {
      if (inList) {
        elements.push(<ul key={`list-${index}`} className="mb-3">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const processedParts = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{processLine(part.slice(2, -2), index)}</strong>;
        }
        return processLine(part, `${index}-${i}`);
      });
      elements.push(<p key={index} className="mb-2">{processedParts}</p>);
    }
    // Handle empty lines
    else if (line.trim() === '') {
      if (inList) {
        elements.push(<ul key={`list-${index}`} className="mb-3">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<div key={index} style={{ height: '0.5rem' }} />);
    }
    // Regular text
    else {
      if (inList) {
        elements.push(<ul key={`list-${index}`} className="mb-3">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<p key={index} className="mb-2">{processLine(line, index)}</p>);
    }
  });

  // Add any remaining list items
  if (inList && listItems.length > 0) {
    elements.push(<ul key="final-list" className="mb-3">{listItems}</ul>);
  }

  return <div>{elements}</div>;
};

export default GenerateWarmUp;
