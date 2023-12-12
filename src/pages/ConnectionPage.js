import { Container, Col, Row, Card, CardBody } from "reactstrap";
import SignUpForm from "../components/SignUpForm";
import FreeCourse from "../components/FreeCourse";
import SubHeader from "../components/SubHeader";
import React, { useEffect } from "react";

const ConnectionPage = () => {
      useEffect(() => {
        document.title = "Connect";
      }, []);

  return (
    <Container>
      <SubHeader current="Connect" />
      <Card id="social-bar" className="m-4">
        <CardBody>
          <Row className="row-content align-items-center">
            <Col>
              <p className="build-community">Build Community</p>
            </Col>
            <Col>
              {" "}
              <Col className="text-center">
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
                <Row>
                  <span className="build-community">🖇️</span>
                </Row>
              </Col>
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
      <Row>
        <h1 className="text-center mb-4">Easier than signing a yearbook</h1>
        <Col xs="6">
          <FreeCourse id="free-course" />
        </Col>
        <Col xs="6">
          <h2>Sign up for a free account</h2>
          <hr />
          <SignUpForm />
        </Col>
      </Row>
    </Container>
  );
};

export default ConnectionPage;
