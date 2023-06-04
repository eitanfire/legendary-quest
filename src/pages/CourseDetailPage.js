import { useSelector } from "react-redux";
import { Container, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import { selectCourseById } from "../features/courses/coursesSlice";
import CourseDetail from "../features/courses/CourseDetail";
import CommentsList from "../features/comments/CommentsList";

const CourseDetailPage = () => {
    const { courseId } = useParams();
    const course = useSelector(selectCourseById(courseId));
    console.log('course:', course);
    return (
      <Container>
        <Row>
          <CourseDetail course={course} />
          <CommentsList courseId={courseId} />
        </Row>
      </Container>
    );
};

export default CourseDetailPage;