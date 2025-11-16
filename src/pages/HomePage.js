import { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import GenerateWarmUp from "../components/GenerateWarmUp";
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
    <Container fluid>
      {/* Hero Cards Section */}

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

      {/* Main Content: Curriculum Generator and Directory/YouTube */}
      <Row>
        {/* Curriculum Generator - Full width when curriculum generated, half when not */}
        <Col xs="12" lg={curriculumGenerated ? "12" : "6"} className="mb-4">
          <div className="p-3 border rounded bg-light shadow-sm">
            <h3 className="text-center mb-4">
              <b>Curriculum Generator</b>
            </h3>
            <p className="text-center text-muted mb-4">
              Generate AI-powered warm-up questions and complete lesson plans
              tailored to your needs
            </p>
            <GenerateWarmUp
              onCourseClick={handleCourseClick}
              onCurriculumGenerated={handleCurriculumGenerated}
            />
          </div>
        </Col>

        {/* Right column: YouTube Videos and Course Directory stacked */}
        <Col xs="12" lg={curriculumGenerated ? "12" : "6"} className="mb-4">
          {/* YouTube Videos Card */}
          <div className="mb-4">
            <a
              href="https://www.youtube.com/@eitanfire9861/playlists"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Card
                className="h-100 shadow-sm"
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <CardBody
                  className="d-flex flex-column align-items-center justify-content-center p-5"
                  style={{
                    minHeight: "200px",
                    background:
                      "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
                  }}
                >
                  <CardTitle
                    tag="h2"
                    className="text-white mb-3"
                    style={{ fontWeight: "var(--font-weight-bold)" }}
                  >
                    <span className="me-3" style={{ fontSize: "3rem" }}>
                      🎬
                    </span>
                    YouTube Videos
                  </CardTitle>
                  <p
                    className="text-white text-center"
                    style={{ fontSize: "var(--font-size-md)", opacity: 0.95 }}
                  >
                    Watch educational content and teaching resources on my
                    YouTube channel
                  </p>
                </CardBody>
              </Card>
            </a>
          </div>

          {/* Course Directory */}
          <div className="p-3 border rounded bg-light shadow-sm">
            <h3 className="text-center mb-4">
              <b>Course Directory</b>
            </h3>
            <p className="text-center text-muted mb-4">
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
    </Container>
  );
};

export default HomePage;
