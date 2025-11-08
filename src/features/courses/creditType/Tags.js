import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Badge } from "reactstrap";
import { getClassCredit } from "./getClassCredit";
import CourseCard from "../CourseCard";
import LoadMoreCourses from "../LoadMoreCourses";
import FeaturedCourseDisplay from "../FeaturedCourseDisplay";

const Tags = ({ featuredCourse, onCourseClick, isHomePage = false }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const coursesState = useSelector((state) => state.courses);
  const { coursesArray } = coursesState;

  // Calculate filtered course count
  const filteredCount = selectedTags.length === 0
    ? coursesArray.length
    : coursesArray.filter((course) =>
        selectedTags.every((tag) => course.credit && course.credit.includes(tag))
      ).length;

  const handleTagClick = (creditTag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(creditTag)
        ? prevTags.filter((tag) => tag !== creditTag)
        : [...prevTags, creditTag]
    );
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleClearAll = () => {
    setSelectedTags([]);
  };

  const creditTags = [
    "Government",
    "World History",
    "US History",
    "Geography",
    "Language Arts",
  ];

  return (
    <div className="container">
      {/* Featured Course Display */}
      {featuredCourse && (
        <FeaturedCourseDisplay
          course={featuredCourse}
          onClose={() => onCourseClick && onCourseClick(null)}
        />
      )}

      {/* Formula Bar */}
      <div className="formula-bar mb-4 p-3 bg-light border rounded">
        <div className="d-flex align-items-center flex-wrap">
          <span className="me-2 fw-bold text-muted">Show courses with</span>

          {selectedTags.length === 0 ? (
            <span className="text-muted fst-italic">all tags</span>
          ) : (
            selectedTags.map((tag, index) => (
              <React.Fragment key={tag}>
                <Badge
                  color="primary"
                  className="me-2 mb-1 d-inline-flex align-items-center"
                  style={{
                    fontSize: '0.9rem',
                    padding: '0.4rem 0.6rem',
                    cursor: 'pointer'
                  }}
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="btn-close btn-close-white ms-2"
                    style={{ fontSize: '0.6rem' }}
                    aria-label={`Remove ${tag}`}
                  ></button>
                </Badge>
                {index < selectedTags.length - 1 && (
                  <span className="me-2 fw-bold text-primary">AND</span>
                )}
              </React.Fragment>
            ))
          )}

          <span className="ms-2 me-2 fw-bold">=</span>
          <Badge color="success" className="me-3" style={{ fontSize: '1rem', padding: '0.4rem 0.8rem' }}>
            {filteredCount} {filteredCount === 1 ? 'course' : 'courses'}
          </Badge>

          {selectedTags.length > 0 && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Available Tags Section */}
      <div className="mb-4">
        <h5 className="text-muted mb-3">Available Tags:</h5>
        <Row className="g-2">
          {creditTags.map((creditTag) => {
            const isSelected = selectedTags.includes(creditTag);
            return (
              <Col key={creditTag} xs="auto">
                <button
                  className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleTagClick(creditTag)}
                  style={{ minWidth: '120px' }}
                >
                  {isSelected && <span className="me-2">✓</span>}
                  {creditTag}
                </button>
              </Col>
            );
          })}
        </Row>
      </div>

      <CoursesList
        selectedTags={selectedTags}
        renderLoadMore={selectedTags.length === 0}
        onCourseClick={onCourseClick}
        isHomePage={isHomePage}
      />
    </div>
  );
};

const CoursesList = ({ selectedTags, renderLoadMore, onCourseClick, isHomePage }) => {
  const coursesState = useSelector((state) => state.courses);
  const { coursesArray, isLoading, errMsg } = coursesState;
  const [displayedCourses, setDisplayedCourses] = React.useState([]);

  // Filter courses to show only those that have ALL selected tags (AND logic)
  const filteredCourses = selectedTags.length === 0
    ? coursesArray
    : coursesArray.filter((course) =>
        selectedTags.every((tag) => course.credit && course.credit.includes(tag))
      );

  // Initialize displayed courses - randomize 4 for mobile on home page
  React.useEffect(() => {
    if (isHomePage && filteredCourses.length > 0) {
      // Shuffle for variety
      const shuffled = [...filteredCourses].sort(() => 0.5 - Math.random());
      setDisplayedCourses(shuffled);
    } else {
      setDisplayedCourses(filteredCourses);
    }
  }, [filteredCourses, isHomePage]);

  const coursesToDisplay = isHomePage ? displayedCourses : filteredCourses;

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : errMsg ? (
        <p>Error: {errMsg}</p>
      ) : (
        <>
          {/* Mobile view - show only 4 random courses initially */}
          <Row className="d-lg-none">
            {coursesToDisplay.slice(0, 4).map((course, id) => (
              <Col md="5" className="m-4" key={id}>
                <CourseCard course={course} onClick={() => onCourseClick && onCourseClick(course)}>
                  {course}
                </CourseCard>
              </Col>
            ))}
          </Row>

          {/* Desktop view - show courses in scrollable container to match AI form height */}
          <div className="d-none d-lg-block courses-scroll-container">
            <Row>
              {coursesToDisplay.map((course, id) => (
                <Col md="5" className="m-4" key={id}>
                  <CourseCard course={course} onClick={() => onCourseClick && onCourseClick(course)}>
                    {course}
                  </CourseCard>
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}

      {renderLoadMore && <LoadMoreCourses isHomePage={isHomePage} />}
    </div>
  );
};

export default Tags;
