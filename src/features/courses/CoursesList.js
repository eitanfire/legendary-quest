import { COURSES } from "../../app/shared/COURSES";
import { Col, Row } from "reactstrap";
import CourseCard from "./CourseCard";
import { selectAllCourses } from "./coursesSlice";

const CoursesList = ({ setCourseId }) => {
  const courses = selectAllCourses();

  return (
    <Row className="ms-auto">
      {COURSES.map((course) => {
        return (
          <Col
            md="5"
            className="m-4"
            key={course.id}
            onClick={() => setCourseId(course.id)}
          >
            <CourseCard course={course} />
          </Col>
        );
      })}
    </Row>
  );
};

export default CoursesList;