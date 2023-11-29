// CoursesDirectoryPage.js
import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import SubHeader from "../components/SubHeader";
import Tags from "../features/courses/creditType/Tags";
import CoursesList from "../features/courses/CoursesList"; // Import the CoursesList component
import { useSelector } from "react-redux";

const CoursesDirectoryPage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(4);

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
    setVisibleCourses(4);
  };

  const handleShowAllCourses = () => {
    setVisibleCourses(
      selectedTags.length === 0
        ? courses.length
        : courses.filter((course) =>
            course.tags.some((tag) => selectedTags.includes(tag))
          ).length
    );
  };

  const handleLoadMore = () => {
    setVisibleCourses((prevVisibleCourses) =>
      Math.min(
        prevVisibleCourses + 4,
        selectedTags.length === 0
          ? courses.length
          : courses.filter((course) =>
              course.tags.some((tag) => selectedTags.includes(tag))
            ).length
      )
    );
  };

  const courses = useSelector((state) => state.courses.coursesArray);

  // Filter courses based on selected tags and credit search
  const filteredCourses = courses.filter((course) => {
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => course.tags.includes(tag));
    return matchesTags;
  });

  return (
    <Container>
      <Row>
        <Col>
          <SubHeader current="Resources" />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="governmentCredit">Government</Col>
        <Col className="worldHistoryCredit">World History</Col>{" "}
        <Col className="uSHistoryCredit">US History</Col>{" "}
        <Col className="geographyCredit">Geography</Col>
        <Col className="lACredit">Language Arts</Col>
      </Row>
      <Tags selectedTags={selectedTags} onTagClick={handleTagClick} />

      <CoursesList courses={filteredCourses.slice(0, visibleCourses)} />
      <Row className="load-courses-buttons col-4">
        {visibleCourses < filteredCourses.length && (
          <>
            <Button className="mt-4" onClick={handleLoadMore}>
              Load More
            </Button>
            <Button className="mt-4 ml-2" onClick={handleShowAllCourses}>
              See All
            </Button>
          </>
        )}

        {visibleCourses >= filteredCourses.length && (
          <p className="title mt-4 text-center">That's Everything!</p>
        )}
      </Row>
    </Container>
  );
};

export default CoursesDirectoryPage;
