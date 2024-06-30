import { useEffect } from "react";
import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import SubHeader from "../components/SubHeader";
import GenerateWarmUp from "../../src/components/GenerateWarmUp.jsx";

const WarmUpPage = () => {
  useEffect(() => {
    document.title = "Warm-Ups";
  }, []);

  return (
    <Container>
      <SubHeader current="Warm-Ups" />
      <Row>
        <h4 className="">
          Warm-ups, Bellringers, Skill Drills, Class Openers, Bellwork, Do Nows,
          Entry Tickets, Welcome Work, Questions of the Day.
        </h4>
        <h4>
          {" "}
          Starting class by having students work on a literacy activity can
          increase your effectiveness in the classroom.
        </h4>
        {/* <Col className="col-xl-12"> */}
        <p>
          {/* <h3 className="diaganol bg-transparent warm-up-title flick-the-lights text-center">
              Powerup Engagement
            </h3> */}
          <div className="pt-2">
            My students begin class with a daily warm-up question that activates
            their prior understanding and provides an entry point into the day's
            lesson.
          </div>
        </p>
        {/* <br></br>
          <p>
            I share these questions with students on Google Classroom in a view
            only file and a response sheet which I have Google Classroom make a
            copy for each student. I find that the response sheet is helpful to
            keep students organized but I don't require them to use it. While
            students are hard at work I take attendance and get complete any
            setup for the class period. After about 10 minutes I check students'
            response and record a grade between 1 and 8 points for their
            response. After 10 responses I record the grade in the gradebook. I
            allow students to respond in writing or with a sketchnote and allow
            students to write about other things as well so that they have a
            chance to get prepared for the lessson and to wake up their brains.
            After students have a chanch to respond in writing we discuss as a
            class and I take the opportunity to use the warm-up
          </p> */}
        {/* </Col> */}
        <Col
        // className="d-none d-block-lg"
        ></Col>
        <Col className="col-9 col-lg-8 ai-input-component mt-4 mb-4">
          <h3>
            <b>Generate your own warm-up question with AI</b>
          </h3>
          <GenerateWarmUp />
        </Col>
        <Col
        // className="d-none d-block-lg"
        ></Col>
      </Row>
    </Container>
  );
};
export default WarmUpPage;
