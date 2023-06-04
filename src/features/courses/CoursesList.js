import { useSelector } from 'react-redux';
import { COURSES } from "../../app/shared/COURSES";
import { Col, Row } from "reactstrap";
import CourseCard from "./CourseCard";
import { selectAllCourses } from "./coursesSlice";
import Credit from "../../features/courses/creditType/Credit"

const CoursesList = () => {
  const courses = useSelector(selectAllCourses);
  console.log('courses:', courses);

  return (
    <Row className="ms-auto">
      {COURSES.map((course) => {
        return (
          <Col md="5" className="m-4" key={course.id}>
            <CourseCard course={course} />
          </Col>
        );
      })}
    </Row>
  );
};

export default CoursesList;