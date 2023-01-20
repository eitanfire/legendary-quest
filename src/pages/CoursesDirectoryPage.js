import { Container, Row, Col } from "reactstrap";
import CourseDetail from "../features/courses/CourseDetail";
import CoursesList from "../features/courses/CoursesList";
import { selectCourseById } from "../features/courses/coursesSlice";
import { useState } from "react";

const CoursesDirectoryPage = () => {
  const [courseId, setCourseId] = useState(0);
  const selectedCourse = selectCourseById(courseId);

  return (
    <>
      <Container>
        <Row>
          <Col sm="5" md="7">
            <CoursesList setCourseId={setCourseId} />
          </Col>
          <Col sm="7" md="5">
            <CourseDetail course={selectedCourse} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CoursesDirectoryPage;
