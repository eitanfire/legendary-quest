import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import CourseCard from "./CourseCard";
import { selectAllCourses } from "./coursesSlice";

const CoursesList = () => {
  const courses = useSelector(selectAllCourses);
  console.log("courses:", courses);

  return (
    <Row className="ms-auto">
      {courses.map((course) => {
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
