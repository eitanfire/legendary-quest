import { Container } from "reactstrap";
import CoursesList from "../features/courses/CoursesList";
import SubHeader from "../components/SubHeader";
import LoadMoreCourses from "../utils/LoadMoreCourses";

const CoursesDirectoryPage = () => {
  return (
    <Container>
      <SubHeader current="Directory" />
      <CoursesList />
      <LoadMoreCourses />
    </Container>
  );
};

export default CoursesDirectoryPage;
