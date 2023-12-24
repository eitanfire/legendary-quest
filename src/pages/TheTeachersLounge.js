import { useEffect, useState } from "react";
import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import DisplayList from "../features/display/DisplayList";
import SubHeader from "../components/SubHeader";

const TheTeachersLounge = () => {
  const [allowScroll, setAllowScroll] = useState(true);

  const scrollTo = (elementId) => {
    if (allowScroll) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const scrollToEnough = () => {
    scrollTo("enough");
  };

  const scrollToTeachersLounge = () => {
    scrollTo("TeachersLounge");
  };

  return (
    <>
      <Row>
        {" "}
        <Col>
          <button
            className="crumple-button hero-button"
            onClick={scrollToTeachersLounge}
          >
            Down to the Teachers Lounge
          </button>
        </Col>
        <Col>
          <button
            className="get-schooled-button hero-button"
            onClick={() => scrollTo("intro-info")}
          >
            Get Schooled
          </button>{" "}
        </Col>
      </Row>
      <Row className="broken-pencil-section">
        <h3 className="Not-Just-You">It's Not Just You</h3>
        <span className="broken-pencil"></span>
        <h3 className="Hard-for-Educators">It's Hard for Educators</h3>
      </Row>
      <Row id="intro-info" className="intro-info-bg">
        <CardHeader sm="7">
          <p className="Hard-for-Educators-Subsection">
            Teachers are entrusted by society to prepare the next generation.
          </p>
        </CardHeader>
        <Col sm="6">
          <p>
            They have numerous duties and responsibilities they must meet with
            scarce resources.{" "}
            <a
              href="https://www.edutopia.org/article/what-can-we-do-about-teacher-turnover"
              target="_blank"
              rel="noreferrer"
            >
              Inadequate compensation is a major reason cited for teachers
              leaving the profession.
            </a>
          </p>
          <p>
            Lack of credit for their work is especially unjust considering the
            fact that {""}
            <a
              href="https://www.weareteachers.com/teachers-undervalued-women/"
              target="_blank"
              rel="noreferrer"
            >
              most teachers are women
            </a>{" "}
            who are already doing more than their share of duties such as child
            care, cooking, and cleaning without monetary compensation.
          </p>
          <p>
            All too often teachers are infantilized instead and their voices are
            not valued.
          </p>
          <Card className="intro-card m-1">
            <CardHeader className="card-header">
              <h3 className="text-center">Did You Know?</h3>
            </CardHeader>
            <CardBody>
              <a
                href="https://www.edweek.org/leadership/5-things-to-know-about-todays-teaching-force/2018/10"
                target="_blank"
                rel="noreferrer"
              >
                On average 44% of teachers only stay in the classroom for 5
                years.
              </a>
            </CardBody>
          </Card>
        </Col>
        <Col sm="6">
            <Card className="m-5">
              <CardHeader className="card-header">
                <h3 className="text-center">Free Speech.</h3>
              </CardHeader>
              <CardBody>
                <h3 className="text-center">Not Free Work.</h3>
              </CardBody>
            </Card>
          <p>Politicians use teachers as props to score political points.</p>
          <p>
            You should be recognized for what you do and get treated like the
            professional that you are.
          </p>
          <p>
            Share your lesson plans to support other educators and adequately
            compensated for your work.
          </p>
          <p>
            You forge the citizenry of tomorrow. You weave the fabric of our
            democracy. You should not toil away in the shadows.
          </p>
          <p className="text-center">You should let your teaching shine.</p>
        </Col>
        {/* <Row></Row>{" "} */}
        {/* <Col>
          {" "}
          <button className="intro-button hero-button" onClick={scrollToEnough}>
            Scroll Down
          </button>
        </Col> */}
      </Row>
      <div id="enough" className="enough wrapper">
        <p className="text-center">
          <span className="crumple">Enough.</span>
        </p>
        <p className="crumple">Our Students are Counting on Us.</p>
        <br></br>{" "}
        <p className="crumple"> Let's Flick the Lights on Oppression.</p>
      </div>
      <Container id="TeachersLounge">
        <SubHeader current="The Teachers Lounge" />
        <span>
          <DisplayList className="displayList" />
        </span>
      </Container>
    </>
  );
};

export default TheTeachersLounge;
