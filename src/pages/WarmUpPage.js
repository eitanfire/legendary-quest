import { Container, Row, Col } from "reactstrap";
import { useEffect } from "react";
import SubHeader from "../components/SubHeader";
import GenerateWarmUp from '../../src/components/GenerateWarmUp.jsx';

const WarmUpPage = () => {
  useEffect(() => {
    document.title = "Warm-Ups";
  }, []);

  return (
    <Container>
      <SubHeader current="Warm-Ups" />
      <Row>
        <p>
          Warm-ups, Bellringers, Skill Drills, Class Openers, Bellwork, Do Nows,
          Entry Tickets, Welcome Work, Questions of the Day.
        </p>
        <Col className="comments">
          <p>
            Starting class by having students work on a literacy activity can
            increase your effectiveness in the classroom.
          </p>
          <p>
            I begin class by projecting a daily warm-up question for students to
            respond to as class begins. I ask students to respond to a
            thought-provoking question that connects with their own identity and
            with the content we're studying in class. I share these questions
            with students on Google Classroom in a view only file and a response
            sheet which I have Google Classroom make a copy for each student. I
            find that the response sheet is helpful to keep students organized
            but I don't require them to use it. While students are hard at work
            I take attendance and get complete any setup for the class period.
          </p>
          <p>
            After about 10 minutes I check students' response and record a grade
            between 1 and 8 points for their response. After 10 responses I
            record the grade in the gradebook. I allow students to respond in
            writing or with a sketchnote and allow students to write about other
            things as well so that they have a chance to get prepared for the
            lessson and to wake up their brains. After students have a chanch to
            respond in writing we discuss as a class and I take the opportunity
            to use the warm-up as an entry point into the day's lesson.
          </p>
        </Col>
        <Col className="ai-input mt-4 mb-4">
          <h3>
            Generate your own warm-up question with <b>AI</b>
          </h3>
          <GenerateWarmUp />
        </Col>
      </Row>
    </Container>
  );
};
export default WarmUpPage;