import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import CourseCard from "./CourseCard";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

const coursePerRow = 4;

const LoadMoreCourses = () => {
  const [next, setNext] = useState(coursePerRow);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(true);

  const courses = useSelector((state) => state.courses.coursesArray);
  const isLoading = useSelector((state) => state.courses.isLoading);
  const errMsg = useSelector((state) => state.courses.errMsg);

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
