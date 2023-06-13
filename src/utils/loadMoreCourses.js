import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { COURSES } from "../app/shared/COURSES";
import CourseCard from "../features/courses/CourseCard";

const coursePerRow = 4;

const LoadMoreCourses = () => {
  const [next, setNext] = useState(coursePerRow);

  const handleMoreCourse = () => {
    setNext(next + coursePerRow);
  };

  return (
    <>
      <Row className="ms-auto justify-center">
        {COURSES?.slice(0, next)?.map((course, id) => (
          <Col md="5" className="m-4" key={id}>
            <CourseCard course={course} />
          </Col>
        ))}
        {next < COURSES?.length && (
          <Button className="mt-4" onClick={handleMoreCourse}>
            Load more
          </Button>
        )}
      </Row>
    </>
  );
};

export default LoadMoreCourses;
