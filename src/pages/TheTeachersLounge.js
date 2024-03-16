import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import DisplayList from "../features/display/DisplayList";
import SubHeader from "../components/SubHeader";

const TheTeachersLounge = () => {
  const navigate = useNavigate();
  const [allowScroll, setAllowScroll] = useState(true);
  const [scrolledToTeachersLounge, setScrolledToTeachersLounge] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const teachersLoungeSection = document.getElementById("TeachersLounge");
      if (teachersLoungeSection) {
        const scrolled =
          window.scrollY >=
          teachersLoungeSection.offsetTop - window.innerHeight / 2;

        setScrolledToTeachersLounge(scrolled);

        if (scrolled) {
          navigate("/TheTeachersLounge");
        }
      }
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Set the default and dynamic titles
  useEffect(() => {
    if (scrolledToTeachersLounge) {
      navigate("/TheTeachersLounge");
    }
  }, [scrolledToTeachersLounge, navigate]);

  // Set the default and dynamic titles
  const pageTitle = scrolledToTeachersLounge
    ? "The Teachers Lounge"
    : "Teach League";

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
            className="xs-lounge-button hero-button d-sm-none col col-8"
            onClick={scrollToTeachersLounge}
          >
            The Teachers Lounge
          </button>
        </Col>{" "}
        <Col>
          <button
            className="sm-md-lounge-button hero-button d-none d-sm-block d-lg-none"
            onClick={scrollToTeachersLounge}
          >
            The Teachers Lounge
          </button>
        </Col>
        <Col>
          <button
            className="lg-lounge-button hero-button d-none d-lg-block d-xl-none"
            onClick={scrollToTeachersLounge}
          >
            The Teachers Lounge
          </button>
        </Col>
        <Col>
          <button
            className="xl-xxl-lounge-button hero-button d-none d-xl-block"
            onClick={scrollToTeachersLounge}
          >
            The Teachers Lounge
          </button>
        </Col>
        <Col>
          <button
            className="xs-get-schooled-button hero-button d-sm-none col col-8"
            onClick={() => scrollTo("Hard-for-Educators-Subsection")}
          >
            Get Schooled
          </button>{" "}
        </Col>
        <Col>
          <button
            className="sm-md-get-schooled-button hero-button d-none d-sm-block d-lg-none"
            onClick={() => scrollTo("Hard-for-Educators-Subsection")}
          >
            Get Schooled
          </button>{" "}
        </Col>
        <Col>
          <button
            className="lg-get-schooled-button hero-button d-none d-lg-block d-xl-none"
            onClick={() => scrollTo("Hard-for-Educators-Subsection")}
          >
            Get Schooled
          </button>{" "}
        </Col>
        <Col>
          <button
            className="xl-xxl-get-schooled-button hero-button d-none d-xl-block"
            onClick={() => scrollTo("Hard-for-Educators-Subsection")}
          >
            Get Schooled
          </button>{" "}
        </Col>
      </Row>
      <Row className="broken-pencil-section">
        <h3 className="Not-Just-You">It's Not Just You</h3>
        <span className="broken-pencil"></span>
        <h3 className="Hard-for-Educators">It's Hard for Educators</h3>
        <Container id="TeachersLounge">
          <SubHeader current="The Teachers Lounge" />
          <span>
            <DisplayList className="displayList" />
          </span>
        </Container>
        {/* Set the document title dynamically */}
        {document.title !== pageTitle && (document.title = pageTitle)}
      </Row>
      <div id="enough" className="enough wrapper">
        <p className="text-center">
          {/* <span className="crumple">Enough.</span> */}
        </p>
        <p className="crumple">Our Students are Counting on Us.</p>
        <br></br>{" "}
        <p className="crumple flick-the-lights">
          {" "}
          Let's Flick the Lights on Oppression.
        </p>
      </div>
      <Row id="intro-info" className="intro-info-bg">
        <CardHeader>
          <Col id="Hard-for-Educators-Subsection">
            Teachers are entrusted by society to prepare the next generation.
          </Col>
        </CardHeader>
        <Col sm="6 mt-3">
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
          <Card className="know-card m-1 col-xxl-5">
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
          <Card className="xs-speech-card d-sm-none col-5 m-5">
            <CardHeader className="card-header">
              <h3 className="text-center">Free Speech.</h3>
            </CardHeader>
            <CardBody>
              <h3 className="text-center">Not Free Work.</h3>
            </CardBody>
          </Card>
          <Card className="speech-card d-none d-sm-block col-8 m-5">
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
          <p className="you-should-let-your-teaching-shine">
            You should let your teaching shine.
          </p>
        </Col>
        {/* <Row></Row>{" "} */}
        {/* <Col>
          {" "}
          <button className="intro-button hero-button" onClick={scrollToEnough}>
            Scroll Down
          </button>
        </Col> */}
      </Row>
    </>
  );
};

export default TheTeachersLounge;
