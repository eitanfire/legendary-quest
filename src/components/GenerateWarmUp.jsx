import React, { useState, useEffect } from "react";
import { Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { useSelector } from "react-redux";
import { run } from "../utils/generateAIWarmUps";

const GenerateWarmUp = ({ onCourseClick, onCurriculumGenerated }) => {
  const [userInput, setUserInput] = useState("");
  const [warmUpResponse, setWarmUpResponse] = useState("");
  const [lessonPlanResponse, setLessonPlanResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [generateWarmUp, setGenerateWarmUp] = useState(true);
  const [generateLessonPlan, setGenerateLessonPlan] = useState(true);

  // New criteria fields
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [showPoliticalPerspective, setShowPoliticalPerspective] = useState(false);
  const [politicalLeaning, setPoliticalLeaning] = useState('centrist');
  const [alignmentStandards, setAlignmentStandards] = useState([]);
  const [schoolDistrict, setSchoolDistrict] = useState('');
  const [classPeriodLength, setClassPeriodLength] = useState('');
  const [customPeriodLength, setCustomPeriodLength] = useState('');
  const [additionalCriteria, setAdditionalCriteria] = useState('');

  const coursesArray = useSelector((state) => state.courses.coursesArray);

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

    try {
      // Generate warm-up if checked
      if (generateWarmUp) {
        const warmUpResult = await run(userInput, coursesArray, 'warmUp', criteria);
        if (warmUpResult !== undefined) {
          setWarmUpResponse(warmUpResult);
        }
      }

      // Generate lesson plan if checked
      if (generateLessonPlan) {
        const lessonPlanResult = await run(userInput, coursesArray, 'lessonPlan', criteria);
        if (lessonPlanResult !== undefined) {
          setLessonPlanResponse(lessonPlanResult);
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

  const handle1stButtonClick = async () => {
    const exampleText = "Analyze primary sources to understand the Revolutionary War";
    setUserInput(exampleText);
    setLoading(true);
    setWarmUpResponse("");
    setLessonPlanResponse("");
    const criteria = {
      grades: selectedGrades,
      politicalLeaning,
      standards: alignmentStandards,
      district: schoolDistrict,
      classPeriodLength: classPeriodLength === 'custom' ? customPeriodLength : classPeriodLength,
      additional: additionalCriteria
    };
    try {
      if (generateWarmUp) {
        const warmUpResult = await run(exampleText, coursesArray, 'warmUp', criteria);
        if (warmUpResult !== undefined) setWarmUpResponse(warmUpResult);
      }
      if (generateLessonPlan) {
        const lessonPlanResult = await run(exampleText, coursesArray, 'lessonPlan', criteria);
        if (lessonPlanResult !== undefined) setLessonPlanResponse(lessonPlanResult);
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMsg = "Sorry, something went wrong. Please try again.";
      if (generateWarmUp) setWarmUpResponse(errorMsg);
      if (generateLessonPlan) setLessonPlanResponse(errorMsg);
    } finally {
      setLoading(false);
    }
  };

    const handle2ndButtonClick = async () => {
      const exampleText = "Examine how do different economic and government systems affect how countries respond to challenges?";
      setUserInput(exampleText);
      setLoading(true);
      setWarmUpResponse("");
      setLessonPlanResponse("");
      const criteria = {
        grades: selectedGrades,
        politicalLeaning,
        standards: alignmentStandards,
        district: schoolDistrict,
        classPeriodLength: classPeriodLength === 'custom' ? customPeriodLength : classPeriodLength,
        additional: additionalCriteria
      };
      try {
        if (generateWarmUp) {
          const warmUpResult = await run(exampleText, coursesArray, 'warmUp', criteria);
          if (warmUpResult !== undefined) setWarmUpResponse(warmUpResult);
        }
        if (generateLessonPlan) {
          const lessonPlanResult = await run(exampleText, coursesArray, 'lessonPlan', criteria);
          if (lessonPlanResult !== undefined) setLessonPlanResponse(lessonPlanResult);
        }
      } catch (error) {
        console.error("Error generating AI response:", error);
        const errorMsg = "Sorry, something went wrong. Please try again.";
        if (generateWarmUp) setWarmUpResponse(errorMsg);
        if (generateLessonPlan) setLessonPlanResponse(errorMsg);
      } finally {
        setLoading(false);
      }
    };

     const handle3rdButtonClick = async () => {
       const exampleText = "Compare and contrast the causes and effects of WWI and WWII based on political, economic, and technological factors.";
       setUserInput(exampleText);
       setLoading(true);
       setWarmUpResponse("");
       setLessonPlanResponse("");
       const criteria = {
         grades: selectedGrades,
         politicalLeaning,
         standards: alignmentStandards,
         district: schoolDistrict,
         classPeriodLength: classPeriodLength === 'custom' ? customPeriodLength : classPeriodLength,
         additional: additionalCriteria
       };
       try {
         if (generateWarmUp) {
           const warmUpResult = await run(exampleText, coursesArray, 'warmUp', criteria);
           if (warmUpResult !== undefined) setWarmUpResponse(warmUpResult);
         }
         if (generateLessonPlan) {
           const lessonPlanResult = await run(exampleText, coursesArray, 'lessonPlan', criteria);
           if (lessonPlanResult !== undefined) setLessonPlanResponse(lessonPlanResult);
         }
       } catch (error) {
         console.error("Error generating AI response:", error);
         const errorMsg = "Sorry, something went wrong. Please try again.";
         if (generateWarmUp) setWarmUpResponse(errorMsg);
         if (generateLessonPlan) setLessonPlanResponse(errorMsg);
       } finally {
         setLoading(false);
       }
     };

  return (
    <Container>
      <Row>
        <div className="ai-input-field">
          {/* Topic Input - Moved to Top */}
          <div className="mb-4">
            <h5 className="text-md-center mb-3">
              What topic and skills will you be exploring in today's lesson?
            </h5>
            <textarea
              className="ai-textarea"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type your input here"
              rows="3"
            />
          </div>
          <Col className="">
            <button
              className="ai-prompt-boilerplate btn btn-outline-info btn-lg"
              onClick={handle1stButtonClick}
              disabled={loading}
            >
              Analyze primary sources to understand the Revolutionary War
            </button>
            <button
              className="ai-prompt-boilerplate btn btn-outline-info btn-lg"
              onClick={handle2ndButtonClick}
              disabled={loading}
            >
              Examine how different economic and government systems affect how
              countries respond to challenges?
            </button>
            <button
              className="ai-prompt-boilerplate btn btn-outline-info btn-lg"
              onClick={handle3rdButtonClick}
              disabled={loading}
            >
              Compare and contrast the causes and effects of WWI and WWII based
              on political, economic, and technological factors.
            </button>
          </Col>
          {/* Student Grade Level */}
          <div className="mb-4 p-3 bg-light border rounded">
            <h5 className="mb-3">Student Grade Level</h5>
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
                <FormGroup check inline key={grade} className="me-3">
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={selectedGrades.includes(grade)}
                      onChange={() => handleGradeToggle(grade)}
                      className="me-1"
                    />
                    {grade}
                  </Label>
                </FormGroup>
              ))}
            </div>
          </div>

          {/* Political Perspective - Toggle Section */}
          <div className="mb-4 p-3 bg-light border rounded">
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
          </div>

          {/* Alignment Standards */}
          <div className="mb-4 p-3 bg-light border rounded">
            <h5 className="mb-3">Alignment Standards</h5>
            <small className="text-muted d-block mb-2">
              Select which educational standards to align with:
            </small>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {[
                { value: "CCSS", label: "Common Core State Standards (CCSS)" },
                {
                  value: "TEKS",
                  label: "Texas Essential Knowledge and Skills (TEKS)",
                },
                { value: "Colorado", label: "Colorado Academic Standards" },
                {
                  value: "NGSS",
                  label: "Next Generation Science Standards (NGSS)",
                },
              ].map((standard) => (
                <FormGroup check key={standard.value} className="mb-2">
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={alignmentStandards.includes(standard.value)}
                      onChange={() => handleStandardToggle(standard.value)}
                      className="me-2"
                    />
                    {standard.label}
                  </Label>
                </FormGroup>
              ))}
            </div>
            <FormGroup>
              <Label for="otherStandards" className="fw-bold">
                Other Standards:
              </Label>
              <Input
                type="text"
                id="otherStandards"
                placeholder="Any Standards Worldwide (e.g., IB, Cambridge, Australian Curriculum)"
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
              />
            </FormGroup>
          </div>

          {/* School District */}
          <div className="mb-4 p-3 bg-light border rounded">
            <h5 className="mb-3">School District (Optional)</h5>
            <small className="text-muted d-block mb-2">
              Enter your school district name or leave blank for general
              curriculum
            </small>
            <Input
              type="text"
              value={schoolDistrict}
              onChange={(e) => setSchoolDistrict(e.target.value)}
              placeholder="e.g., Austin Independent School District"
              className="mb-2"
            />
            <small className="text-muted">
              Future: We'll integrate with NCES database for district-specific
              standards and requirements
            </small>
          </div>

          {/* Class Period Length */}
          <div className="mb-4 p-3 bg-light border rounded">
            <h5 className="mb-3">Class Period Length</h5>
            <small className="text-muted d-block mb-2">
              Select the duration of your class period to help tailor activity timing
            </small>
            <Input
              type="select"
              value={classPeriodLength}
              onChange={(e) => setClassPeriodLength(e.target.value)}
              className="mb-2"
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
            {classPeriodLength === 'custom' && (
              <div className="mt-3">
                <Label for="customDuration">Enter custom duration (in minutes):</Label>
                <Input
                  type="number"
                  id="customDuration"
                  value={customPeriodLength}
                  onChange={(e) => setCustomPeriodLength(e.target.value)}
                  placeholder="e.g., 80"
                  min="1"
                  max="240"
                />
              </div>
            )}
          </div>

          {/* Additional Criteria */}
          <div className="mb-4 p-3 bg-light border rounded">
            <h5 className="mb-3">Additional Criteria</h5>
            <small className="text-muted d-block mb-2">
              Any other specific requirements, accommodations, or preferences?
            </small>
            <Input
              type="textarea"
              value={additionalCriteria}
              onChange={(e) => setAdditionalCriteria(e.target.value)}
              placeholder="e.g., Include visual aids for ELL students, focus on hands-on activities, etc."
              rows="3"
            />
          </div>

          {/* Generation Type Toggles */}
          <div className="mb-4 p-3 bg-light border rounded">
            <h5 className="mb-3">What would you like to generate?</h5>
            <FormGroup check className="mb-2">
              <Label check className="d-flex align-items-center">
                <Input
                  type="checkbox"
                  checked={generateWarmUp}
                  onChange={handleWarmUpToggle}
                  className="me-2"
                />
                <span style={{ fontSize: "1.1rem" }}>
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
                <span style={{ fontSize: "1.1rem" }}>Generate Lesson Plan</span>
              </Label>
            </FormGroup>
            <FormGroup check className="mb-2">
              <Label
                check
                className="d-flex align-items-center"
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              >
                <Input type="checkbox" disabled className="me-2" />
                <span style={{ fontSize: "1.1rem" }}>
                  Generate Unit Plan{" "}
                  <span className="badge bg-secondary ms-2">
                    Coming Soon - Premium
                  </span>
                </span>
              </Label>
            </FormGroup>
            <div className="mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
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

          <form onSubmit={handleSubmit}>
            <button
              className="ai-submit-btn button-85"
              type="submit"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Lesson Materials"}
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
  // Look for common separators that indicate recommendations section
  const separators = [
    /\n\n(?:For deeper learning|To explore|Related courses?|Recommended|Suggestion)/i,
    /\n\n(?:Students could|You might also|Consider)/i,
  ];

  for (const separator of separators) {
    const match = response.match(separator);
    if (match) {
      return {
        warmUp: response.substring(0, match.index).trim(),
        recommendations: response.substring(match.index).trim(),
      };
    }
  }

  // If no clear separator, check if response mentions courses in a separate paragraph
  const paragraphs = response.split('\n\n');
  if (paragraphs.length > 1) {
    const lastParagraph = paragraphs[paragraphs.length - 1];
    // If last paragraph mentions exploring/checking/courses, treat it as recommendations
    if (/(?:explore|check out|course|TeachLeague)/i.test(lastParagraph)) {
      return {
        warmUp: paragraphs.slice(0, -1).join('\n\n').trim(),
        recommendations: lastParagraph.trim(),
      };
    }
  }

  // No recommendations found, entire response is the warm-up
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

  return (
    <div className="lesson-plan-output mt-4">
      {/* Main Lesson Plan */}
      <div className="lesson-plan-section p-4 mb-3 bg-white border rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h3 className="mb-0">
            <span className="me-2">📝</span>
            Lesson Plan
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
const parseLessonPlanResponse = (response) => {
  // Look for "Related Courses" section
  const relatedCoursesMatch = response.match(/##?\s*Related Courses?[\s\S]*$/i);

  if (relatedCoursesMatch) {
    return {
      lessonPlan: response.substring(0, relatedCoursesMatch.index).trim(),
      recommendations: relatedCoursesMatch[0].replace(/##?\s*Related Courses?/i, '').trim(),
    };
  }

  // No recommendations found, entire response is the lesson plan
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
