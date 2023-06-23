import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import CourseCard from "./CourseCard";
import { selectAllCourses } from "./coursesSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

const CoursesList = () => {
  const courses = useSelector(selectAllCourses);
  console.log("courses:", courses);
  const isLoading = useSelector((state) => state.courses.isLoading);
  const errMsg = useSelector((state) => state.courses.errMsg);
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
