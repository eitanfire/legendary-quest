import { COURSES } from "../app/shared/COURSES";
import CourseCard from "../features/courses/CourseCard";
import FreeCourseCard from "../features/courses/FreeCourseCard";
import { selectFreeCourse } from "../features/courses/coursesSlice";
import { Container, Col, Row, Card, CardBody } from "reactstrap";


const FreeCourse = () => {
  const FreeCourse = selectFreeCourse();
  return (
    <Container>
      <h2>Receive access to this course content for free when you sign up</h2>
      <Row className="ms-auto">
        {COURSES.map((course) => {
          return (
            <Col key={course.id}>
              {course.free && (
                <FreeCourseCard course={course} />
              )}
            </Col>
          );
        })}
      </Row>

      {/* <Col>
          {icon}
          <h2>{name}</h2>
          {image}
          <h2>{freeContentDescription}</h2>
        </Col> */}
    </Container>
  );
};
export default FreeCourse;