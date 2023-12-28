import { useSelector } from "react-redux";
import {
  selectAllCourses,
  selectCourseById,
} from "../features/courses/coursesSlice";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import FreeCourseCard from "../features/courses/FreeCourseCard";

const FreeCourse = () => {
  const { courseId } = useParams();
  const course = useSelector(selectCourseById(courseId));
  const courses = useSelector(selectAllCourses);

  return (
    <Container>
      <subheading className="subheading">
        Receive access to this course content for <b>free</b> when you sign up
      </subheading>
      <Row className="ms-auto">
        {courses.map((course) => {
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
