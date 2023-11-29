import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import CourseCard from "./CourseCard";
// import CoursesList from "./CoursesList";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import { getClassCredit } from "./creditType/getClassCredit";

const coursePerRow = 4;

const LoadMoreCourses = () => {
  const [next, setNext] = useState(coursePerRow);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);
  const [tags, setTags] = useState([]);

  const courses = useSelector((state) => state.courses.coursesArray); // Accessing the coursesArray state from Redux
  const isLoading = useSelector((state) => state.courses.isLoading);
  const errMsg = useSelector((state) => state.courses.errMsg);
const handleTagClick = (tag) => {
 
  // Toggle the tag in the list
  setTags((prevTags) =>
    prevTags.includes(tag)
      ? prevTags.filter((t) => t !== tag)
      : [...prevTags, tag]
  );
};
  const handleMoreCourse = () => {
    setNext(next + coursePerRow);
    if (next + coursePerRow >= courses.length) {
      setShowLoadMoreButton(false);
    }
  };

  const handleShowAllCourses = () => {
    setShowAllCourses(true);
    setShowLoadMoreButton(false);
  };

  if (isLoading) {
    return (
      <Row>
        <Loading />
      </Row>
    );
  }

  if (errMsg) {
    return (
      <Row>
        <Error errMsg={errMsg} />
      </Row>
    );
  }

  return (
    <>
      <Row>
        <div className="tags-container">
          {/* Display tags */}
          {[
            "Government",
            "World History",
            "US History",
            "Geography",
            "Language Arts",
          ].map((tag) => (
            <Col
              key={tag}
              className={`tag ${getClassCredit(tag)} ${
                tags.includes(tag) ? "selected" : ""
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Col>
          ))}
        </div>
      </Row>
      <Row className="ms-auto justify-center">
        {showAllCourses
          ? courses?.map((course, id) => (
              <Col md="5" className="m-4" key={id}>
                <CourseCard course={course} />
              </Col>
            ))
          : courses?.slice(0, next)?.map((course, id) => (
              <Col md="5" className="m-4" key={id}>
                <CourseCard course={course} />
              </Col>
            ))}
      </Row>
      <Row className="load-courses-buttons col-4">
        {!showAllCourses && showLoadMoreButton && (
          <Button className="mt-4" onClick={handleMoreCourse}>
            Load more
          </Button>
        )}

        {!showAllCourses && !showLoadMoreButton && (
          <p className="title mt-4 text-center">That's Everything!</p>
        )}

        {!showAllCourses && showLoadMoreButton && (
          <Button className="mt-4 text-center" onClick={handleShowAllCourses}>
            See All
          </Button>
        )}
      </Row>
      {showAllCourses && (
        <p className="title mt-4 text-center">That's Everything!</p>
      )}
    </>
  );
};

export default LoadMoreCourses;
