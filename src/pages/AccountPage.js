import { Container, Col, Row, Card, CardBody } from "reactstrap";
import SignUpForm from "../components/SignUpForm";
import FreeCourse from "../components/FreeCourse";
import SubHeader from "../components/SubHeader";
import React, { useEffect } from "react";

const AccountPage = () => {
  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  return (
    <Container>
      <SubHeader current="Account" />
      <Row className="row-content"></Row>
      {/* <UserLoginForm className="top-of-fold-sign-up-btn" /> */}
      <Card id="social-bar" className="m-4">
        <CardBody>
          <Row className="row-content text-center mt-5 pt-5">
            <Col>
              <p className="build-community">
                Build <span className="">🖇️</span>
                Community
              </p>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Row className="row-content">
        <Col className=""></Col>
        <Col className="sign-up-col col-9 col-lg-4 col-xl-3">
          <subheading className="subheading">
            Receive a <b>free</b> course when you sign up
          </subheading>
          <SignUpForm />
          <subheading className="subheading">
            Easier than signing a yearbook
          </subheading>
          {/* TODO - Make UserLoginForm render */}
          {/* <UserLoginForm className="have-an-account-login-btn" /> */}
        </Col>
        <Col className=""></Col>
        <Col className="col col-lg-6 col-xl-7">
          <FreeCourse id="free-course" />
        </Col>
        <span className="gclassroom-padding"></span>
      </Row>
    </Container>
  );
};

export default AccountPage;
