import { Container, Row, Col } from "reactstrap";
import CoursesList from "../features/courses/CoursesList";
import SubHeader from "../components/SubHeader";
import LoadMoreCourses from "../features/courses/LoadMoreCourses";
import Tags from "../features/courses/creditType/Tags";

const CoursesDirectoryPage = () => {
  const url1 =
    "https://docs.google.com/document/d/1dbdDA3tfZp5NugzgwWx2FdOfh7b3U2xHxGbILYKIliA/edit";
  const url2 =
    "https://docs.google.com/document/d/1cftkj88mYvBn6q3JI5YAJXJgcVvpERpo1nWDzs88wSY/edit";
  const assignments = [url2, url1];

  const mapassignments = assignments.map((link) => "data-url=" + link);

  return (
    <Container>
      <Row>
        <Col>
          <SubHeader current="Resources" />
        </Col>
        <Col className="col col-8">
          <Tags />
        </Col>
      </Row>
      {/* <Row>
        <p>
          Warm-ups, Bellringers, Skill Drills, Class Openers, Bellwork, Do Nows,
          Entry Tickets, Welcome Work, Questions of the Day.
          <br></br>
          Starting class by having students work on a literacy activity can
          increase your effectiveness in the classroom.
          <br></br>I begin class by projecting a daily warm-up question for
          students to respond to as class begins. I ask students to respond to a
          thought-provoking question that connects with their own identity and
          with the content we're studying in class. I share these questions with
          students on Google Classroom in a view only file and a response sheet
          which I have Google Classroom make a copy for each student. I find
          that the response sheet is helpful to keep students organized but I
          don't require them to use it. While students are hard at work I take
          attendance and get complete any setup for the class period. After
          about 10 minutes I check students' response and record a grade between
          1 and 8 points for their response. After 10 responses I record the
          grade in the gradebook. I allow students to respond in writing or with
          a sketchnote and allow students to write about other things as well so
          that they have a chance to get prepared for the lessson and to wake up
          their brains. After students have a chanch to respond in writing we
          discuss as a class and I take the opportunity to use the warm-up as an
          entry point into the day's lesson.
        </p> */}
        {/* <div
          class="g-sharetoclassroom"
          data-size="64"
          data-itemtype="assignment"
          data-title="Warm-Ups"
          data-body="Come to class on time and aim to write at least five (5) sentences or a sketchnote.
You may respond to the question, to another prompt of your choice, journal about how it’s going or what you’re grateful for, or add to your own story."
          data-theme="classic" */}
          {/* data-url=
           data-role="presentation"
          data-url={mapassignments}
          data-url1="https://docs.google.com/document/d/1dbdDA3tfZp5NugzgwWx2FdOfh7b3U2xHxGbILYKIliA/edit"
          data-url2="https://docs.google.com/document/d/1cftkj88mYvBn6q3JI5YAJXJgcVvpERpo1nWDzs88wSY/edit"
           data-topic="Warm-Up Questions"
           data-url="https://docs.google.com/document/d/1dbdDA3tfZp5NugzgwWx2FdOfh7b3U2xHxGbILYKIliA/copy"
           data-copies-only=true
           className="vRMGwf oJeWuf"
           data-role="dialog"
         ></div> */}
      {/* </Row> */}
      <LoadMoreCourses />
      {/* <CoursesList /> */}
    </Container>
  );
};
export default CoursesDirectoryPage;
