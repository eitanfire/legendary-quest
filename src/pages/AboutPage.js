import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import SubHeader from '../components/SubHeader';
import TakesList from "../features/takes/TakesList";

const AboutPage = (props) => {
    return (
      <Container>
        <SubHeader current="About Us" />
        <Row className="row-content">
          <Col sm="6">
            <h3 className="title">Our Mission</h3>
            <p>We know how hard an educator’s job is. </p>
            <p>
              Teachers are entrusted by society to prepare the next generation.
              They have numerous duties and responsibilities they must meet with
              scarce resources.
              <a
                href="https://www.edutopia.org/article/what-can-we-do-about-teacher-turnover"
                target="_blank"
              >
                Inadequate compensation is a major reason cited for teachers
                leaving the profession.{" "}
              </a>{" "}
              Lack of credit for their work is especially unjust considering the
              fact that{" "}
              <a
                href="https://www.weareteachers.com/teachers-undervalued-women/"
                target="_blank"
              >
                most teachers are women
              </a>
              who are already doing more than their share of duties such as
              child care, cooking, and cleaning without monetary compensation.
              Expecting a constant stream of new teachers to be pedagogical
              wizards is unrealistic.
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
                <Row className="row">
                  <a
                    href="https://www.edweek.org/leadership/5-things-to-know-about-todays-teaching-force/2018/10"
                    target="_blank"
                  >
                    On average 44% of teachers only stay in the classroom for 5
                    years.
                  </a>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm="6">
            <Card>
              <CardHeader className="card-header">
                <h3 className="text-center">Did You Know?</h3>
              </CardHeader>
              <CardBody>
                <Row className="row">
                  <a
                    href="https://www.edweek.org/leadership/5-things-to-know-about-todays-teaching-force/2018/10"
                    target="_blank"
                  >
                    On average 44% of teachers only stay in the classroom for 5
                    years.
                  </a>
                </Row>
              </CardBody>
            </Card>
          </Col>
          </Row><Row>
          <Col>
            <Card className="bg-light mt-3 mb-4">
              <CardBody>
                <blockquote className="blockquote">
                  <p>
                    <h2>
                      Know that dream where you show up for the final and
                      realize you forgot to go to class?
                      <br></br>
                      <br></br>
                      Yeah, we have that too but were supposed to be teaching
                      it!
                    </h2>
                  </p>
                  {/* <footer className="blockquote-footer">
                    {" "}
                    Muriel Strode,{" "}
                    <cite title="Source Title">
                      "Wind-Wafted Wild Flowers" - The Open Court, 1903
                    </cite>
                  </footer> */}
                </blockquote>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="row-content">
          <Col xs="12">
            <h3>Community Partners</h3>
          </Col>
          <TakesList />
        </Row>
      </Container>
    );
};

export default AboutPage;