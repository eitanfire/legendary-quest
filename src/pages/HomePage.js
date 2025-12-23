import { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import SimpleLessonPlanner from "../components/SimpleLessonPlanner";
import FeaturedCourseDisplay from "../features/courses/FeaturedCourseDisplay";
import Tags from "../features/courses/creditType/Tags";
import { AvatarLink } from "../components/AvatarLink.tsx";
import AvatarImg from "../app/assets/img/favicon.ico";
                
const HomePage = () => {
  const [featuredCourse, setFeaturedCourse] = useState(null);
  const [curriculumGenerated, setCurriculumGenerated] = useState(false);
  const [showCourseDirectory, setShowCourseDirectory] = useState(false);
  const [showResources, setShowResources] = useState(false);

  useEffect(() => {
    document.title = "TeachLeague - AI Teaching Assistant";
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
    <Container fluid className="px-3 px-md-4" style={{ maxWidth: "1400px" }}>
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

      <Row className="justify-content-center mb-4">
        <Col xs="12" lg="11" xl="10">
          <div
            className="lesson-planner-card"
            style={{
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
              padding: "3rem 2rem",
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

      {/* Resources Section - Collapsible */}
      {!curriculumGenerated && (
        <Row className="justify-content-center mb-4">
          <Col xs="12" lg="11" xl="10">
            <div className="text-center">
              <button
                onClick={() => setShowResources(!showResources)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#00B894",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(0, 184, 148, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <i
                  className={`fa fa-${
                    showResources ? "chevron-up" : "chevron-down"
                  } me-2`}
                ></i>
                Browse Resources
              </button>
            </div>

            {showResources && (
              <>
                {/* YouTube Videos Card */}
                <Row className="justify-content-center mb-4 mt-4">
                  <Col xs="12" md="6" lg="5">
                    <a
                      href="https://www.youtube.com/@eitanfire9861/playlists"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Card
                        className="shadow-sm resource-card h-100"
                        style={{
                          cursor: "pointer",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          borderRadius: "16px",
                          border: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 24px rgba(0, 184, 148, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0, 0, 0, 0.1)";
                        }}
                      >
                        <CardBody
                          className="d-flex flex-column align-items-center justify-content-center p-4"
                          style={{
                            minHeight: "220px",
                            background:
                              "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(234, 232, 240, 0.85) 100%), url('https://thumbs.dreamstime.com/z/cinema-seamless-pattern-icons-movie-background-tv-show-television-online-entertainment-concept-film-elements-repeating-251720735.jpg')",
                            backgroundSize: "250%",
                            backgroundPosition: "center",
                            borderRadius: "16px",
                          }}
                        >
                          <div className="mb-3" style={{ fontSize: "4.5rem" }}>
                            🎬
                          </div>
                          <CardTitle
                            tag="h4"
                            className="mb-2"
                            style={{
                              fontWeight: "600",
                              fontSize: "1.5rem",
                              color: "#00B894",
                            }}
                          >
                            Educational Videos
                          </CardTitle>
                          <p
                            className="text-center mb-0"
                            style={{
                              fontSize: "0.9rem",
                              opacity: 0.95,
                              color: "#00B894",
                            }}
                          >
                            Engaging video playlists
                          </p>
                        </CardBody>
                      </Card>
                    </a>
                  </Col>

                  {/* Course Directory */}
                  <Col xs="12" md="6" lg="5">
                    <div
                      onClick={() =>
                        setShowCourseDirectory(!showCourseDirectory)
                      }
                      className="resource-card h-100"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0, 184, 148, 0.85) 0%, rgba(0, 153, 119, 0.85) 100%), url('https://www.shutterstock.com/image-vector/lamp-light-bulb-hand-drawn-600w-520326277.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "16px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        padding: "2rem",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        minHeight: "220px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(0, 184, 148, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                      <div className="mb-3" style={{ fontSize: "4.5rem" }}>
                        📚
                      </div>
                      <h4
                        className="text-center mb-2 text-white"
                        style={{ fontWeight: "600" }}
                      >
                        Course Directory
                      </h4>
                      <p
                        className="text-center text-white mb-0"
                        style={{ fontSize: "0.9rem", opacity: 0.95 }}
                      >
                        Browse course templates
                      </p>
                    </div>
                  </Col>
                </Row>

                {/* Avatar Link - Centered below resource cards */}
                <Row className="justify-content-center mb-4">
                  <Col xs="12" className="d-flex justify-content-center">
                    <AvatarLink
                      href="https://eitans.website"
                      avatarSrc={AvatarImg}
                      text="connect with me"
                    />
                  </Col>
                </Row>

                {/* Expandable Course Directory */}
                {showCourseDirectory && (
                  <Row className="justify-content-center mt-4">
                    <Col xs="12">
                      <div
                        className="resource-card"
                        style={{
                          background: "white",
                          borderRadius: "16px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          padding: "2rem",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <h3
                          className="text-center mb-3"
                          style={{ color: "#00B894", fontWeight: "600" }}
                        >
                          Course Templates
                        </h3>
                        <p
                          className="text-center text-muted mb-4"
                          style={{ fontSize: "0.9rem" }}
                        >
                          Browse our collection of educational course templates
                        </p>

                        <Tags
                          featuredCourse={featuredCourse}
                          onCourseClick={handleCourseClick}
                          isHomePage={true}
                        />
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default HomePage;
