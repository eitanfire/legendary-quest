import React from "react";
import { Row, Col } from "reactstrap";
import CourseCard from "./CourseCard";

const CoursesList = ({ courses }) => {
  return (
    <Row>
      {courses.map((course, id) => (
        <Col md="5" className="m-4" key={id}>
          <CourseCard course={course} />
        </Col>
      ))}
    </Row>
  );
};

export default CoursesList;
