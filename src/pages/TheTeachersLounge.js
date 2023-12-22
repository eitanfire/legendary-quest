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
      <Row className="broken-pencil-section">
        <h3 className="Not-Just-You">It's Not Just You</h3>
        <span className="broken-pencil"></span>
        <h3 className="Hard-for-All-Educators">It's Hard for All Educators</h3>
        <Col>
          <button
            className="hard-button hero-button"
            onClick={() => scrollTo("intro-info")}
          >
            Scroll Down
          </button>{" "}
        </Col>
      </Row>
      <Row id="intro-info">
        <Col sm="6">
          <p className="Hard-for-All-Educators-Subsection text-center">
            Teachers are entrusted by society to prepare the next generation.
          </p>
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
          <p>Politicians use teachers as props to score political points.</p>
        </Col>
        <Col sm="6">
          <Card className="intro-card">
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
        <Row className="row-content">
          <Col sm="6">
            <Card className="mt-5">
              <CardHeader className="card-header">
                <h3 className="text-center">Free Speech.</h3>
              </CardHeader>
              <CardBody>
                <h3 className="text-center">Not Free Work.</h3>
              </CardBody>
            </Card>
          </Col>
          <Col sm="6">
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
        </Row>
        {/* <Row></Row>{" "} */}
        <Col>
          {" "}
          <button className="intro-button hero-button" onClick={scrollToEnough}>
            Scroll Down
          </button>
        </Col>
      </Row>
      <div id="enough" className="enough wrapper">
        <p className="text-center">
          <span className="crumple">Enough.</span>
        </p>
        <p className="crumple">Our Students are Counting on Us.</p>
        <br></br>{" "}
        <p className="crumple"> Let's Flick the Lights on Oppression.</p>
      </div>
      <Col>
        <button
          className="crumple-button hero-button"
          onClick={scrollToTeachersLounge}
        >
          Scroll Down
        </button>
      </Col>
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
