import { Col, Row, Container } from "reactstrap";
import { Card, CardBody } from 'reactstrap';
import DisplayList from "../features/display/DisplayList";
import SubHeader from "../components/SubHeader";

const TheTeachersLounge = () => {
  return (
    <>
      <Container>
        <SubHeader current="The Teachers Lounge" />
        <DisplayList className="displayList" />
      </Container>
    </>
  );
};

export default TheTeachersLounge;