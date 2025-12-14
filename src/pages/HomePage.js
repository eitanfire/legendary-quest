import { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import SimpleLessonPlanner from "../components/SimpleLessonPlanner";
import FeaturedCourseDisplay from "../features/courses/FeaturedCourseDisplay";
import Tags from "../features/courses/creditType/Tags";

const HomePage = () => {
  const [featuredCourse, setFeaturedCourse] = useState(null);
  const [curriculumGenerated, setCurriculumGenerated] = useState(false);

  useEffect(() => {
    document.title = "TeachLeague - Home";
  }, []);

  const handleCourseClick = (course) => {
    setFeaturedCourse(course);
    // Scroll to featured course
    if (course) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handleCurriculumGenerated = (generated) => {
    setCurriculumGenerated(generated);
  };

  return (
    <Container fluid className="px-3 px-md-4">
      {/* Featured Course Display - Full Width */}
      {featuredCourse && (
        <Row className="mb-4">
          <Col xs="12">
            <FeaturedCourseDisplay
              course={featuredCourse}
              onClose={() => setFeaturedCourse(null)}
            />
          </Col>
        </Row>
      )}

      {/* Main Lesson Planner - Prominently Featured */}
      <Row className="justify-content-center mb-5">
        <Col xs="12" lg="10" xl="8">
          <div
            className="lesson-planner-card"
            style={{
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 184, 148, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
              padding: "2rem",
              transition: "all 0.3s ease",
            }}
          >
            <SimpleLessonPlanner
              onCourseClick={handleCourseClick}
              onCurriculumGenerated={handleCurriculumGenerated}
            />
          </div>
        </Col>
      </Row>

      {/* Resources Section - Below the planner */}
      {!curriculumGenerated && (
        <>
          {/* YouTube Videos Card */}
          <Row className="justify-content-center mb-4">
            <Col xs="12" lg="10" xl="8">
              <a
                href="https://www.youtube.com/@eitanfire9861/playlists"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Card
                  className="shadow-sm resource-card"
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    borderRadius: "12px",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 184, 148, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <CardBody
                    className="d-flex flex-column align-items-center justify-content-center p-4"
                    style={{
                      minHeight: "200px",
                      background:
                        "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
                      borderRadius: "12px",
                    }}
                  >
                    <div className="mb-3" style={{ fontSize: "4rem" }}>
                      🎬
                    </div>
                    <CardTitle
                      tag="h3"
                      className="text-white mb-2"
                      style={{ fontWeight: "600", fontSize: "1.5rem" }}
                    >
                      Educational Videos
                    </CardTitle>
                    <p
                      className="text-white text-center mb-0"
                      style={{ fontSize: "0.95rem", opacity: 0.95 }}
                    >
                      Help students visualize the material with engaging clips
                    </p>
                  </CardBody>
                </Card>
              </a>
            </Col>
          </Row>

          {/* Course Directory */}
          <Row className="justify-content-center mb-4">
            <Col xs="12" lg="10" xl="8">
              <div
                className="resource-card"
                style={{
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  padding: "1.5rem",
                  transition: "all 0.3s ease",
                }}
              >
                <h3 className="text-center mb-3" style={{ color: "var(--color-primary)", fontWeight: "600" }}>
                  Course Directory
                </h3>
                <p className="text-center text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                  Browse our comprehensive collection of educational courses
                </p>

                {/* Course Tags and Filtering */}
                <Tags
                  featuredCourse={featuredCourse}
                  onCourseClick={handleCourseClick}
                  isHomePage={true}
                />
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default HomePage;
