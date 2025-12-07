import React, { useState, useEffect } from "react";
import { Container, Button } from "reactstrap";
import { useSelector } from "react-redux";

// Import stages
import InitialPrompt from "./wizard-stages/InitialPrompt";
import Stage1BigIdea from "./wizard-stages/Stage1BigIdea";
import Stage1EssentialQuestions from "./wizard-stages/Stage1EssentialQuestions";
import Stage1LearningObjectives from "./wizard-stages/Stage1LearningObjectives";
import Stage2AssessmentType from "./wizard-stages/Stage2AssessmentType";
import Stage2SuccessCriteria from "./wizard-stages/Stage2SuccessCriteria";
import Stage3Activities from "./wizard-stages/Stage3Activities";
import LessonPlanDisplay from "./LessonPlanDisplay";
import { run } from "../utils/generateAIWarmUps";

const BackwardDesignWizard = ({ onCourseClick, onCurriculumGenerated }) => {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [mode, setMode] = useState(null); // 'quick' or 'wizard'

  // Initial topic/goal
  const [topic, setTopic] = useState("");

  // Stage 1: Learning Objectives
  const [bigIdea, setBigIdea] = useState("");
  const [essentialQuestions, setEssentialQuestions] = useState([]);
  const [learningObjectives, setLearningObjectives] = useState([]);

  // Stage 2: Assessment Design
  const [assessmentType, setAssessmentType] = useState("");
  const [assessmentStakes, setAssessmentStakes] = useState("summative");
  const [successCriteria, setSuccessCriteria] = useState("");

  // Stage 3: Existing criteria from original form
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [alignmentStandards, setAlignmentStandards] = useState([]);
  const [schoolDistrict, setSchoolDistrict] = useState("");
  const [classPeriodLength, setClassPeriodLength] = useState("");
  const [additionalCriteria, setAdditionalCriteria] = useState("");

  // UDL (Universal Design for Learning) selections
  const [udlStrategies, setUdlStrategies] = useState([]);

  // Generated content
  const [lessonPlanResponse, setLessonPlanResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const coursesArray = useSelector((state) => state.courses.coursesArray);

  // Notify parent when curriculum is generated
  useEffect(() => {
    if (onCurriculumGenerated) {
      onCurriculumGenerated(!!lessonPlanResponse);
    }
  }, [lessonPlanResponse, onCurriculumGenerated]);

  const steps = [
    { id: 0, stage: 0, title: "Topic", subtitle: "What do you want to teach?" },
    { id: 1, stage: 1, title: "Big Idea", subtitle: "What should students remember?" },
    { id: 2, stage: 1, title: "Essential Questions", subtitle: "Thought-provoking questions" },
    { id: 3, stage: 1, title: "Learning Objectives", subtitle: "What students will achieve" },
    { id: 4, stage: 2, title: "Assessment Type", subtitle: "How to measure learning" },
    { id: 5, stage: 2, title: "Success Criteria", subtitle: "Define excellent work" },
    { id: 6, stage: 3, title: "Learning Activities", subtitle: "Design the lesson" },
  ];

  const currentStepData = steps[currentStep];

  const goToNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuickGenerate = async () => {
    setMode('quick');
    setLoading(true);

    const criteria = {
      grades: selectedGrades,
      standards: alignmentStandards,
      district: schoolDistrict,
      classPeriodLength: classPeriodLength,
      additional: additionalCriteria,
    };

    try {
      const result = await run(topic, coursesArray, "lessonPlan", criteria, null);
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

  const handleUseWizard = () => {
    setMode('wizard');
    setBigIdea(topic); // Pre-fill big idea with the topic
    setCurrentStep(1); // Skip to step 1 (Big Idea)
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return topic.trim().length > 10;
      case 1:
        return bigIdea.trim().length > 10;
      case 2:
        return essentialQuestions.length > 0;
      case 3:
        return learningObjectives.length > 0;
      case 4:
        return assessmentType.trim().length > 0;
      case 5:
        return successCriteria.trim().length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    // Show loading screen during quick generate
    if (loading && mode === 'quick') {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 style={{ color: "#00B894" }}>Generating your lesson plan...</h5>
          <p style={{ color: "#666" }}>This may take a moment.</p>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <InitialPrompt
            topic={topic}
            setTopic={setTopic}
            onQuickGenerate={handleQuickGenerate}
            onUseWizard={handleUseWizard}
          />
        );
      case 1:
        return (
          <Stage1BigIdea
            bigIdea={bigIdea}
            setBigIdea={setBigIdea}
            onNext={goToNext}
            canProceed={canProceed()}
          />
        );
      case 2:
        return (
          <Stage1EssentialQuestions
            bigIdea={bigIdea}
            essentialQuestions={essentialQuestions}
            setEssentialQuestions={setEssentialQuestions}
            onNext={goToNext}
            onPrevious={goToPrevious}
            canProceed={canProceed()}
          />
        );
      case 3:
        return (
          <Stage1LearningObjectives
            bigIdea={bigIdea}
            essentialQuestions={essentialQuestions}
            learningObjectives={learningObjectives}
            setLearningObjectives={setLearningObjectives}
            onNext={goToNext}
            onPrevious={goToPrevious}
            canProceed={canProceed()}
          />
        );
      case 4:
        return (
          <Stage2AssessmentType
            learningObjectives={learningObjectives}
            assessmentType={assessmentType}
            setAssessmentType={setAssessmentType}
            assessmentStakes={assessmentStakes}
            setAssessmentStakes={setAssessmentStakes}
            onNext={goToNext}
            onPrevious={goToPrevious}
            canProceed={canProceed()}
          />
        );
      case 5:
        return (
          <Stage2SuccessCriteria
            learningObjectives={learningObjectives}
            assessmentType={assessmentType}
            successCriteria={successCriteria}
            setSuccessCriteria={setSuccessCriteria}
            onNext={goToNext}
            onPrevious={goToPrevious}
            canProceed={canProceed()}
          />
        );
      case 6:
        return (
          <Stage3Activities
            bigIdea={bigIdea}
            essentialQuestions={essentialQuestions}
            learningObjectives={learningObjectives}
            assessmentType={assessmentType}
            successCriteria={successCriteria}
            selectedGrades={selectedGrades}
            setSelectedGrades={setSelectedGrades}
            alignmentStandards={alignmentStandards}
            setAlignmentStandards={setAlignmentStandards}
            schoolDistrict={schoolDistrict}
            setSchoolDistrict={setSchoolDistrict}
            classPeriodLength={classPeriodLength}
            setClassPeriodLength={setClassPeriodLength}
            additionalCriteria={additionalCriteria}
            setAdditionalCriteria={setAdditionalCriteria}
            udlStrategies={udlStrategies}
            setUdlStrategies={setUdlStrategies}
            coursesArray={coursesArray}
            loading={loading}
            setLoading={setLoading}
            lessonPlanResponse={lessonPlanResponse}
            setLessonPlanResponse={setLessonPlanResponse}
            setCompleted={setCompleted}
            onPrevious={goToPrevious}
          />
        );
      default:
        return null;
    }
  };

  if (completed && lessonPlanResponse) {
    return (
      <Container style={{ maxWidth: "900px" }}>
        <div className="mb-4">
          <Button
            color="link"
            onClick={() => {
              setCompleted(false);
              setCurrentStep(0);
              setMode(null);
              setTopic("");
              setBigIdea("");
              setEssentialQuestions([]);
              setLearningObjectives([]);
              setAssessmentType("");
              setSuccessCriteria("");
              setLessonPlanResponse("");
            }}
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

  return (
    <Container style={{ maxWidth: "900px" }}>
      {/* Progress Indicator - Hide on step 0 */}
      <div className="mb-5">
        <h2 className="text-center mb-4" style={{ color: "#00B894", fontWeight: "600" }}>
          {currentStep === 0 ? "Lesson Plan Generator" : "Backward Design Lesson Planner"}
        </h2>

        {/* Step Progress Bar - Only show for wizard mode (step 1+) */}
        {currentStep > 0 && (
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              {steps.filter(s => s.id > 0).map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className="text-center"
                  style={{ flex: 1, position: "relative" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor:
                        step.id <= currentStep ? "#00B894" : "#e0e0e0",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      fontWeight: "600",
                      fontSize: "0.9rem",
                      cursor: step.id < currentStep ? "pointer" : "default",
                    }}
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  >
                    {step.id < currentStep ? "✓" : step.id}
                  </div>
                  <div
                    className="mt-2"
                    style={{
                      fontSize: "0.75rem",
                      color: step.id === currentStep ? "#00B894" : "#666",
                      fontWeight: step.id === currentStep ? "600" : "normal",
                    }}
                  >
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: "2px",
                      backgroundColor:
                        step.id < currentStep ? "#00B894" : "#e0e0e0",
                      marginBottom: "30px",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        )}

        {/* Current Stage Header - Only show for wizard mode */}
        {currentStep > 0 && (
          <div className="text-center mb-4">
            <div
              style={{
                display: "inline-block",
                padding: "0.4rem 1rem",
                backgroundColor: "rgba(0, 184, 148, 0.1)",
                borderRadius: "20px",
                fontSize: "0.85rem",
                color: "#00B894",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Stage {currentStepData.stage} of 3
            </div>
            <h3 style={{ color: "#333", fontWeight: "600" }}>
              {currentStepData.title}
            </h3>
            <p style={{ color: "#666", fontSize: "0.95rem" }}>
              {currentStepData.subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Render Current Step */}
      {renderStep()}
    </Container>
  );
};

export default BackwardDesignWizard;
