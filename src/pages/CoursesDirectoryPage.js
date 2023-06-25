import { Container, Row, Col } from "reactstrap";
import CoursesList from "../features/courses/CoursesList";
import SubHeader from "../components/SubHeader";
import LoadMoreCourses from "../utils/LoadMoreCourses";
import Tags from "../features/courses/creditType/Tags";
import ToggleCreditTags from "../components/ToggleCreditTags";

const CoursesDirectoryPage = () => {
  return (
    <Container>
      <Row>
        <Col>
          <SubHeader current="Directory" />
        </Col>
        <Col col col-8>
          <Tags />
          {/* <ToggleCreditTags /> */}
        </Col>
      </Row>
      {/* <CoursesList /> */}
      <LoadMoreCourses />
    </Container>
  );
};

export default CoursesDirectoryPage;
