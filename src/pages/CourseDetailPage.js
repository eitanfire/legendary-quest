import { useSelector } from "react-redux";
import { Container, Row } from "reactstrap";
import { useParams } from "react-router-dom";
import { selectCourseById } from "../features/courses/coursesSlice";
import CourseDetail from "../features/courses/CourseDetail";
import CommentsList from "../features/comments/CommentsList";
import Error from "../components/Error";
import Loading from "../components/Loading";
import SubHeader from "../components/SubHeader";
import React, { useEffect } from "react";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const course = useSelector(selectCourseById(courseId));

  useEffect(() => {
    if (course) {
      document.title = course.name; // Set the document title based on the course name
    }
  }, [course]);

  const isLoading = useSelector((state) => state.courses.isLoading);
  const errMsg = useSelector((state) => state.courses.errMsg);
  let content = null;

  if (isLoading) {
    content = <Loading />;
  } else if (errMsg) {
    content = <Error errMsg={errMsg} />;
  } else {
    content = (
      <>
        <CourseDetail course={course} />
        <CommentsList courseId={courseId} />
      </>
    );
  }

  return (
    <Container>
      {course && <SubHeader current={course.name} detail={true} />}
      <Row>{content}</Row>
    </Container>
  );
};

export default CourseDetailPage;
