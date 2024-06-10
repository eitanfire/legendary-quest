import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import SubHeader from "../components/SubHeader";
import Tags from "../features/courses/creditType/Tags";
import { useSelector } from "react-redux";
import LoadMoreCourses from "../features/courses/LoadMoreCourses.js";
import CoursesList from "../features/courses/CoursesList";
import { Link } from "react-router-dom";
import Gemini from '../app/assets/img/google-gemini-icon.png';

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
        {" "}
        <SubHeader className="subheader-title" current="Resources" />
      </Row>
      <Row className="">
        <Col className="col">
          <h3>
            <a
              href="https://www.youtube.com/@eitanfire9861/playlists"
              className=""
              type="submit"
              color="primary"
              target="_blank"
              rel="noopener"
            >
              <a
                className="btn btn-social-icon btn-google"
                href="https://www.youtube.com/@eitanfire9861/playlists"
                target="_blank"
                rel="noopener"
              >
                <i className="fa fa-youtube" />
              </a>{" "}
              <h3 className="">Videos</h3>
            </a>
          </h3>
        </Col>
        <Col className="col">
          <Link to="/warmups" className="" type="submit" color="primary">
            <h3 className="social-media-links">
              <a className="btn btn-social-icon btn-reddit">
                <img src={Gemini} />
              </a>
              <br></br>
              Warm-Ups
            </h3>
          </Link>
        </Col>
      </Row>

      {selectedTags.length === 0 && selectedTags.includes("All courses") && (
        <LoadMoreCourses />
      )}
      <Tags selectedTags={selectedTags} onTagClick={handleTagClick} />
      {selectedTags.length > 0 && <CoursesList courses={filteredCourses} />}
      <span className="gclassroom-padding"></span>
    </Container>
  );
};

export default CoursesDirectoryPage;
