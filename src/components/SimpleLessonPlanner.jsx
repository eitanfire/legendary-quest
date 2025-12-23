import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Button,
  Input,
} from "reactstrap";
import { useSelector } from "react-redux";
import { run } from "../utils/generateAIWarmUps";
import { searchSchoolDistricts } from "../utils/ncesAPI";
import { getSessionId } from "../utils/sessionId";
import LessonPlanDisplay from "./LessonPlanDisplay";
import LessonPlanLoader from "./LessonPlanLoader";
import GoogleDriveSearch from "./GoogleDriveSearch";

const SimpleLessonPlanner = ({ onCourseClick, onCurriculumGenerated }) => {
  const [generationType, setGenerationType] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [alignmentStandards, setAlignmentStandards] = useState([]);
  const [schoolDistrict, setSchoolDistrict] = useState("");
  const [classPeriodLength, setClassPeriodLength] = useState("");
  const [additionalCriteria, setAdditionalCriteria] = useState("");
  const [udlStrategies, setUdlStrategies] = useState([]);
  const [driveFiles, setDriveFiles] = useState([]);

  const allExamples = [
    "Students will analyze the causes of World War I and evaluate which factors were most significant",
    "Students will understand the water cycle and explain how it affects weather patterns",
    "Students will examine the Bill of Rights and its impact on American democracy",
    "Students will investigate ecosystems and food chains in their local environment",
    "Students will explore the causes and effects of the Civil Rights Movement",
  ];

  const [examplePrompts, setExamplePrompts] = useState([]);
  const [showExamples, setShowExamples] = useState(false);

  const [analyticsConsent, setAnalyticsConsent] = useState(
    localStorage.getItem("teachleague_analytics_consent") === "true"
  );

  const [showGrades, setShowGrades] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const [showStandards, setShowStandards] = useState(false);
  const [showPeriodLength, setShowPeriodLength] = useState(false);
  const [showUDL, setShowUDL] = useState(false);
  const [showAdditional, setShowAdditional] = useState(false);

  const [districtSearchResults, setDistrictSearchResults] = useState([]);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const districtSearchTimeoutRef = useRef(null);
  const districtDropdownRef = useRef(null);

  const [lessonPlanResponse, setLessonPlanResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const coursesArray = useSelector((state) => state.courses.coursesArray);

  useEffect(() => {
    if (onCurriculumGenerated) {
      onCurriculumGenerated(!!lessonPlanResponse);
    }
  }, [lessonPlanResponse, onCurriculumGenerated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(event.target)
      ) {
        setShowDistrictDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const criteria = {
        grades: selectedGrades,
        standards: alignmentStandards,
        district: schoolDistrict,
        classPeriodLength,
        additional: additionalCriteria,
        udlStrategies,
        driveFiles,
      };

      const metadata = {
        analyticsConsent,
        sessionId: getSessionId(),
      };

      const type = generationType || "lessonPlan";
      const result = await run(
        topic,
        coursesArray,
        type,
        criteria,
        null,
        metadata
      );

      if (result) {
        setLessonPlanResponse(result.content);
        setCompleted(true);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = () => {
    if (!showExamples) {
      // Get 3 random examples from allExamples
      const shuffled = [...allExamples].sort(() => 0.5 - Math.random());
      setExamplePrompts(shuffled.slice(0, 3));
      setShowExamples(true);
    }
  };

  const handleExampleClick = (example) => {
    setTopic(example);
    setShowExamples(false);
  };

  const handleReset = () => {
    setCompleted(false);
    setGenerationType("");
    setTopic("");
    setSelectedGrades([]);
    setAlignmentStandards([]);
    setSchoolDistrict("");
    setClassPeriodLength("");
    setAdditionalCriteria("");
    setUdlStrategies([]);
    setDriveFiles([]);
    setLessonPlanResponse("");
    setShowExamples(false);
  };

  if (completed && lessonPlanResponse) {
    return (
      <Container style={{ maxWidth: "900px" }}>
        <Button color="link" onClick={handleReset}>
          ← Start New Lesson Plan
        </Button>
        <LessonPlanDisplay
          response={lessonPlanResponse}
          courses={coursesArray}
          onCourseClick={onCourseClick}
        />
      </Container>
    );
  }

  if (loading) return <LessonPlanLoader />;

  return (
    <Container style={{ maxWidth: "900px" }}>
      <div className="mb-5">
        <h2
          className="text-center mb-4"
          style={{ color: "#00B894", fontWeight: "600" }}
        >
          What do you want your students to know?
        </h2>
      </div>
      <Input
        type="textarea"
        rows="4"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onFocus={handleInputFocus}
        // placeholder="What do you want students to learn?"
      />

      {showExamples && examplePrompts.length > 0 && (
        <div className="mt-3 mb-3">
          <div className="d-flex flex-wrap gap-2 mt-4">
            {examplePrompts.map((example, index) => (
              <Button
                key={index}
                color="light"
                outline
                onClick={() => handleExampleClick(example)}
                className="text-secondary"
                style={{
                  textAlign: "left",
                  whiteSpace: "normal",
                  padding: "0.75rem 1rem",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  flex: "1 1 calc(33.333% - 0.5rem)",
                  minWidth: "200px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 184, 148, 0.1)";
                  e.currentTarget.style.borderColor = "#00B894";
                  e.currentTarget.style.color = "#00B894";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#dee2e6";
                  e.currentTarget.style.color = "#6c757d";
                }}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      )}

      {topic.trim().length > 10 && (
        <>
          <div className="my-4">
            <Button
              outline
              color="success"
              onClick={() => setGenerationType("warmup")}
              active={generationType === "warmup"}
            >
              Warm-up
            </Button>{" "}
            <Button
              outline
              color="success"
              onClick={() => setGenerationType("lessonPlan")}
              active={generationType === "lessonPlan"}
            >
              Lesson Plan
            </Button>
          </div>

          {generationType && (
            <>
              <GoogleDriveSearch
                lessonTopic={topic}
                onFilesSelected={setDriveFiles}
              />

              <div className="text-center mt-4">
                <Button
                  color="primary"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={topic.trim().length < 10}
                >
                  {generationType === "warmup"
                    ? "Generate Warm-up"
                    : "Generate Lesson Plan"}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default SimpleLessonPlanner;
