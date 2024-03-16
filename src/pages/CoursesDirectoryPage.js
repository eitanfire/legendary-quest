import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import SubHeader from "../components/SubHeader";
import Tags from "../features/courses/creditType/Tags";
import { useSelector } from "react-redux";
import LoadMoreCourses from "../features/courses/LoadMoreCourses.js";
import CoursesList from "../features/courses/CoursesList";

const CoursesDirectoryPage = () => {
     useEffect(() => {
       document.title = "Resources";
     }, []);

  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const courses = useSelector((state) => state.courses.coursesArray);

  const filteredCourses = courses.filter(
    (course) =>
      selectedTags.length === 0 ||
      selectedTags.some((tag) => course.tags.includes(tag))
  );

  return (
    <Container>
      <Row>
        <Col class="subheader-title">
          <SubHeader current="Resources" />
          <h3 className="social-media-links">
            <a
              className="btn btn-social-icon btn-google"
              href="https://www.youtube.com/@eitanfire9861/playlists"
              target="_blank"
              rel="noopener"
            >
              <i className="fa fa-youtube" />
            </a>
            <a
              href="https://www.youtube.com/@eitanfire9861/playlists"
              target="_blank"
              rel="noopener"
            >
            </a>{" "}
            Need a video? Subscribe for curated content.
          </h3>
        </Col>
      </Row>
      {selectedTags.length === 0 && selectedTags.includes("All courses") && (
        <LoadMoreCourses />
      )}
      <Tags selectedTags={selectedTags} onTagClick={handleTagClick} />
      {selectedTags.length > 0 && <CoursesList courses={filteredCourses} />}
    </Container>
  );
};

export default CoursesDirectoryPage;
