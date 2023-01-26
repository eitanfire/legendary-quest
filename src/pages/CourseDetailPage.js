import { Container, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import { selectCourseById } from "../features/courses/coursesSlice";
import CourseDetail from "../features/courses/CourseDetail";

const CourseDetailPage = () => {
    const { courseId } = useParams();
    const course = selectCourseById(courseId);

    return (
        <Container>
            <Row>
                <CourseDetail course ={course} />
            </Row>
        </Container>
    );
};

export default CourseDetailPage;