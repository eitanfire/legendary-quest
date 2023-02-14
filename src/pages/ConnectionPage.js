import { Container, Col, Row, Card, CardBody } from "reactstrap";
import SignUpForm from "../components/SignUpForm";
// import SubHeader from "../components/SubHeader";

const ConnectionPage = () => {
  return (
    <Container>
      {/* <SubHeader current="Contact Us" /> */}
      <Card>
        <CardBody>
          <Row className="row-content align-items-center">
            <h1>Send Feedback</h1>
            <Col sm="4">
              <h5>Our Address</h5>
              <address>
                218 Lincoln ST
                <br />
                Longmont, CO 80501
                <br />
                U.S.A.
              </address>
            </Col>
            <Col>
              <a role="button" className="btn btn-link" href="tel:+12065551234">
                <i className="fa fa-phone" /> 1-206-555-1234
              </a>
              <br />
              <a
                role="button"
                className="btn btn-link"
                href="mailto:support@teachleague.com"
              >
                <i className="fa fa-envelope-o" /> support@teachleague.com
              </a>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Row className="row-content">
        <Col xs="12">
          <h1>Easier than signing a yearbook</h1>
          <h2>Sign up for a free account</h2>
          <hr />
        </Col>
        <Col md="10">
          <SignUpForm />
        </Col>
      </Row>
    </Container>
  );
};

export default ConnectionPage;