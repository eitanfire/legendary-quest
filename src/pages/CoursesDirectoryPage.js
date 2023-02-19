import { Container } from "reactstrap";
import CoursesList from "../features/courses/CoursesList";
import SubHeader from "../components/SubHeader";
import Header from "../components/Header";

const CoursesDirectoryPage = () => {
  return (
    <Container>
      <SubHeader current="Directory" />
      <CoursesList />
    </Container>
  );
};

export default CoursesDirectoryPage;
