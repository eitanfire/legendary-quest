import { Col, Row, Container } from "reactstrap";
import { Card, CardBody } from 'reactstrap';
import DisplayList from "../features/display/DisplayList";

const TheTeachersLounge = () => {
  return (
    <>
      <Col>
        <h1 className="title">The Teachers Lounge</h1>
      </Col>
      <Container>
        <DisplayList className="displayList" />
      </Container>
    </>
  );
};

export default TheTeachersLounge;