import { Container, Col, Row, Card, CardBody } from "reactstrap";
import SignUpForm from "../components/SignUpForm";
import { Link } from "react-router-dom";
// import SubHeader from "../components/SubHeader";

const ConnectionPage = () => {
  return (
    <Container>
      <h1>Build Community</h1>
      {/* <SubHeader current="Contact Us" /> */}
      <Card>
        <CardBody>
          <Row className="row-content align-items-center">
            <Col>
              {" "}
              <Col xs="6" sm="3" className="text-center">
                <h5>Social</h5>
                <a
                  className="btn btn-social-icon btn-instagram"
                  href="http://instagram.com/"
                >
                  <i className="fa fa-instagram" />
                </a>{" "}
                <a
                  className="btn btn-social-icon btn-facebook"
                  href="http://www.facebook.com/"
                >
                  <i className="fa fa-facebook" />
                </a>{" "}
                <a
                  className="btn btn-social-icon btn-twitter"
                  href="http://twitter.com/"
                >
                  <i className="fa fa-twitter" />
                </a>{" "}
                <a
                  className="btn btn-social-icon btn-google"
                  href="http://youtube.com/"
                >
                  <i className="fa fa-youtube" />
                </a>
              </Col>
            </Col>
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