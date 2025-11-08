import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Col, Row, Container, Button } from "reactstrap";
import SubHeader from "../components/SubHeader";
import GenerateWarmUp from "../../src/components/GenerateWarmUp.jsx";
import FeaturedCourseDisplay from "../features/courses/FeaturedCourseDisplay";

const WarmUpPage = () => {
  const [featuredCourse, setFeaturedCourse] = useState(null);
  const coursesArray = useSelector((state) => state.courses.coursesArray);

  useEffect(() => {
    document.title = "Lesson Plans & Warm-Ups";
  }, []);

  const handleCourseClick = (course) => {
    setFeaturedCourse(course);
    // Scroll to featured course
    if (course) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <Container>
      <SubHeader current="Warm-Ups" />
      <Row>
        <h4 className="">
          Warm-ups, Bellringers, Skill Drills, Class Openers, Bellwork, Do Nows,
          Entry Tickets, Welcome Work, Questions of the Day.
        </h4>
        <h4>
          {" "}
          Starting class by having students work on a literacy activity can
          increase your effectiveness in the classroom.
        </h4>
        <p>
          <div className="pt-2">
            My students begin class with a daily warm-up question that activates
            their prior understanding and provides an entry point into the day's
            lesson.
          </div>
        </p>
        <Col></Col>
        <Col className="col-9 col-lg-8 ai-input-component mt-4 mb-4">
          {/* Debug: Test Featured Course Display */}
          {coursesArray && coursesArray.length > 0 && !featuredCourse && (
            <div className="mb-3">
              <Button
                color="info"
                size="sm"
                onClick={() => setFeaturedCourse(coursesArray[0])}
              >
                🧪 Test: Show Featured Course (click to see how it looks)
              </Button>
              <small className="ms-2 text-muted">
                ({coursesArray.length} courses loaded)
              </small>
            </div>
          )}

          {/* Featured Course Display */}
          {featuredCourse && (
            <div className="mb-4">
              <FeaturedCourseDisplay
                course={featuredCourse}
                onClose={() => setFeaturedCourse(null)}
              />
            </div>
          )}

          <h3>
            <b>Generate lesson plans and warm-up questions with AI</b>
          </h3>
          <GenerateWarmUp onCourseClick={handleCourseClick} />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};
export default WarmUpPage;
