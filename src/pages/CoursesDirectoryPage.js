import { Container } from "reactstrap";
import CoursesList from "../features/courses/CoursesList";
import SubHeader from "../components/SubHeader";
import Header from "../components/Header";
import loadMoreCourses from "../utils/loadMoreCourses"

const CoursesDirectoryPage = () => {
  return (
    <Container>
      <SubHeader current="Directory" />
      <CoursesList />
      <loadMoreCourses />
    </Container>
  );
};

export default CoursesDirectoryPage;
