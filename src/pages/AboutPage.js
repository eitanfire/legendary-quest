import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import SubHeader from "../components/SubHeader";
import TakesList from "../features/takes/TakesList";

const AboutPage = (props) => {
  return (
    <Container>
      <SubHeader current="About Us" />
      <Row className="row-content">
        <Col sm="6">
          <h3 className="title text-center">Our Mission</h3>
          <h3 className="m-2">It's Hard for Educators</h3>
          <p>
            Teachers are entrusted by society to prepare the next generation.
            They have numerous duties and responsibilities they must meet with
            scarce resources.
            <a
              href="https://www.edutopia.org/article/what-can-we-do-about-teacher-turnover"
              target="_blank"
              rel="noreferrer"
            >
              Inadequate compensation is a major reason cited for teachers
              leaving the profession.{" "}
            </a>{" "}
            Lack of credit for their work is especially unjust considering the
            fact that{" "}
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
            On the other hand, simply giving them a textbook to follow can be
            soul-deadening. This website will offer teaching resources that
            teachers can use right away and personalize for their own needs.
          </p>
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
          <Card className="mt-5">
            <h2 className="text-center">
              <p>Enough.</p>
            </h2>
            <h3>
              <p>Our Students are Counting on Us.</p>
            </h3>{" "}
            <h3> Flick the Lights on Oppression.</h3>
          </Card>
          <Card className="mt-5">
            <CardHeader className="card-header">
              <h3 className="text-center">Free Speech.</h3>
            </CardHeader>
            <CardBody>
              <h3 className="text-center">Not Free Work.</h3>
              {/* </a> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="bg-light mt-3 mb-4">
            <CardBody>
              <blockquote className="blockquote">
                <p>
                  <h2>
                    Know that dream where you show up for the final and realize
                    you forgot to go to class?
                    <br></br>
                    <br></br>
                    Yeah, we have that too but were supposed to be teaching it!
                  </h2>
                </p>
              </blockquote>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="row-content">
        <Col xs="12">
          <h2 className="text-center">Hot Takes</h2>
        </Col>
        <TakesList />
      </Row>
    </Container>
  );
};

export default AboutPage;
