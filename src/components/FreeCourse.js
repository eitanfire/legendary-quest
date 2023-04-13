import { COURSES } from "../app/shared/COURSES";
import CourseCard from "../features/courses/CourseCard";
import FreeCourseCard from "../features/courses/FreeCourseCard";
import { selectFreeCourse } from "../features/courses/coursesSlice";
import { Container, Col, Row, Card, CardBody } from "reactstrap";
import { useParams } from "react-router-dom";
import { selectCourseById } from "../features/courses/coursesSlice";

const FreeCourse = () => {
  const FreeCourse = selectFreeCourse();
      const { courseId } = useParams();
      const course = selectCourseById(courseId);
      
  return (
    <Container>
      <h2>
        Receive access to this course content for <b>free</b> when you
        sign up
      </h2>
      <Row className="ms-auto">
        {COURSES.map((course) => {
          return (
            <Col key={course.id}>
              {course.free && <FreeCourseCard course={course} />}
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};
export default FreeCourse;