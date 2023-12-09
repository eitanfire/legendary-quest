import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import SubHeader from "../components/SubHeader";
import RantsList from "../features/rants/RantsList";

const RantPage = (props) => {
  return (
    <Container className="wrapper">
      <SubHeader current="Rant" />
      <Row className="diaganol bg-transparent mt-5 mb-4">
        <p>
          <h2>
            Know that scary dream where you show up for the final and realize
            you forgot to go to class?
            <br></br>
            <br></br>
            As educators we have that nightmare too but we're the ones who are
            supposed to be teaching it!
          </h2>
        </p>
      </Row>
      <Row className="row-content">
        <h3 className="title text-center">It's Not Just You</h3>
        <h3 className="m-2">It's Hard for All Educators</h3>
        <Col sm="6">
          <p className="text-center">
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
            </a>
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
          <Card>
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
      </Row>
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
      {/* <div className="spikes">Rants</div> */}
      <Card className="spikes mt-5">
        <div className="wrapper">
          <h2 className="text-center">
            <p>It's Enough.</p>
          </h2>
          <h3 className="">Our Students are Counting on Us.</h3>
          <h3> Flick the Lights on Oppression.</h3>
        </div>
      </Card>
      <Row className="row-content mt-5">
        <div className="wrapper">
          <Col xs="12">
            <h2 className="text-center">Rants</h2>
          </Col>
          <RantsList />
        </div>
      </Row>
    </Container>
  );
};

export default RantPage;
