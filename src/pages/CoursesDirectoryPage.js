import { Container, Row, Col } from "reactstrap";
import CoursesList from "../features/courses/CoursesList";
import SubHeader from "../components/SubHeader";
import LoadMoreCourses from "../features/courses/LoadMoreCourses";
import Tags from "../features/courses/creditType/Tags";
// import ToggleCreditTags from "../components/ToggleCreditTags";
// import fakerData from "../utils/fakerData";

const CoursesDirectoryPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <SubHeader current="Resources" />
        </Col>
        <Col className="col col-8">
          <Tags />
          {/* <fakerData /> */}
          {/* <ToggleCreditTags /> */}
        </Col>
      </Row>
      {/* <CoursesList /> */}
      <LoadMoreCourses />
    </Container>
  );
};

export default CoursesDirectoryPage;
