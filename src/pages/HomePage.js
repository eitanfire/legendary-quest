import { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import SubHeader from "../components/SubHeader";
import GenerateWarmUp from "../components/GenerateWarmUp";
import FeaturedCourseDisplay from "../features/courses/FeaturedCourseDisplay";
import Tags from "../features/courses/creditType/Tags";

const HomePage = () => {
  const [featuredCourse, setFeaturedCourse] = useState(null);

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

  return (
    <Container fluid>
      <SubHeader current="Home" />

      {/* Hero Cards Section */}
      <Row className="mb-5 mt-4">
        <Col md="6" className="mb-3">
          <Link to="/lounge" style={{ textDecoration: 'none' }}>
            <Card className="h-100 shadow-sm" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <CardBody className="d-flex flex-column align-items-center justify-content-center p-5"
                style={{ minHeight: '200px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <CardTitle tag="h2" className="text-white mb-3">
                  <span className="me-3" style={{ fontSize: '3rem' }}>☕</span>
                  The Teachers Lounge
                </CardTitle>
                <p className="text-white text-center" style={{ fontSize: '1.1rem' }}>
                  Learn about the mission, read educator perspectives, and join the conversation
                </p>
              </CardBody>
            </Card>
          </Link>
        </Col>

        <Col md="6" className="mb-3">
          <Link to="/watch" style={{ textDecoration: 'none' }}>
            <Card className="h-100 shadow-sm" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <CardBody className="d-flex flex-column align-items-center justify-content-center p-5"
                style={{ minHeight: '200px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
              >
                <CardTitle tag="h2" className="text-white mb-3">
                  <span className="me-3" style={{ fontSize: '3rem' }}>🎬</span>
                  Videos
                </CardTitle>
                <p className="text-white text-center" style={{ fontSize: '1.1rem' }}>
                  Watch educational content and teaching resources
                </p>
              </CardBody>
            </Card>
          </Link>
        </Col>
      </Row>

      {/* Main Content: Warm-ups (Left) and Directory (Right) */}
      <Row>
        {/* Left Side - Warm-ups */}
        <Col lg="6" className="mb-4">
          <div className="p-3 border rounded bg-light shadow-sm">
            <h3 className="text-center mb-4">
              <b>Lesson Plans & Warm-Up Generator</b>
            </h3>
            <p className="text-center text-muted mb-4">
              Generate AI-powered warm-up questions and complete lesson plans tailored to your needs
            </p>
            <GenerateWarmUp onCourseClick={handleCourseClick} />
          </div>
        </Col>

        {/* Right Side - Course Directory */}
        <Col lg="6" className="mb-4">
          <div className="p-3 border rounded bg-light shadow-sm">
            <h3 className="text-center mb-4">
              <b>Course Directory</b>
            </h3>
            <p className="text-center text-muted mb-4">
              Browse our comprehensive collection of educational courses
            </p>

            {/* Featured Course Display */}
            {featuredCourse && (
              <div className="mb-4">
                <FeaturedCourseDisplay
                  course={featuredCourse}
                  onClose={() => setFeaturedCourse(null)}
                />
              </div>
            )}

            {/* Course Tags and Filtering */}
            <Tags featuredCourse={featuredCourse} onCourseClick={handleCourseClick} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
