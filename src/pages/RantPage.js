import { Col, Row, Container } from "reactstrap";
import SubHeader from "../components/SubHeader";
import RantsList from "../features/rants/RantsList";
import React, { useEffect } from "react";

const RantPage = (props) => {
  useEffect(() => {
    document.title = "Rant";
  }, []);

  return (
    <Container className="wrapper">
      <SubHeader current="Rant" />
      <subheading className="subheading">
        The challenges you face as a teacher can be daunting. Sometimes you just
        need to vent or hear a good rant to feel validated.
      </subheading>
      <Row className="diaganol bg-transparent mt-5 mb-4">
        <p>
          <h3>
            Know that scary dream where you show up for the final and realize
            you forgot to go to class?
            <br></br>
            <br></br>
            As educators we have that nightmare too but we're the ones who are
            supposed to be teaching it!
          </h3>
        </p>
      </Row>
      <Row className="row-content mt-5">
        <div className="wrapper">
          <Col xs="12">
            <h2 className="title text-center">Rants</h2>
          </Col>
          <RantsList />
        </div>
      </Row>
    </Container>
  );
};

export default RantPage;
