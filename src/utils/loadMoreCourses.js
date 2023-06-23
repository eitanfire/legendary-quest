import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { useSelector } from "react-redux";
import CourseCard from "../features/courses/CourseCard";
import Error from "../components/Error";
import Loading from "../components/Loading";

const coursePerRow = 2;

const LoadMoreCourses = () => {
  const [next, setNext] = useState(coursePerRow);
  const courses = useSelector((state) => state.courses.coursesArray); // Accessing the coursesArray state from Redux
  const isLoading = useSelector((state) => state.courses.isLoading);
  const errMsg = useSelector((state) => state.courses.errMsg);

  const handleMoreCourse = () => {
    setNext(next + coursePerRow);
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
        {courses?.slice(0, next)?.map((course, id) => (
          <Col md="5" className="m-4" key={id}>
            <CourseCard course={course} />
          </Col>
        ))}
        {next < courses?.length && (
          <Button className="mt-4" onClick={handleMoreCourse}>
            Load more
          </Button>
        )}
      </Row>
    </>
  );
};

export default LoadMoreCourses;
