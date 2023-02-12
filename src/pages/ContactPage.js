import { Container, Col, Row } from "reactstrap";
// import SubHeader from "../components/SubHeader";

const ContactPage = () => {
  return (
    <Container>
      {/* <SubHeader current="Contact Us" /> */}

      <Row className="row-content align-items-center">
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

      <Row className="row-content">
        <Col xs="12">
          <h2>Send Us Your Feedback</h2>
          <hr />
        </Col>
        <Col md="10">TBD: ContactForm</Col>
      </Row>
    </Container>
  );
};

export default ContactPage;