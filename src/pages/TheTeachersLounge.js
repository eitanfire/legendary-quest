import { Col, Row, Container } from "reactstrap";
import { Card, CardBody } from 'reactstrap';
import DisplayList from "../features/display/DisplayList";
import SubHeader from "../components/SubHeader";

const TheTeachersLounge = () => {
  return (
    <>
      <Col>
        <h1 className="title">The Teachers Lounge</h1>
      </Col>
      <Container>
        <SubHeader current="The Teachers Lounge" />
        <DisplayList className="displayList" />
      </Container>
    </>
  );
};

export default TheTeachersLounge;