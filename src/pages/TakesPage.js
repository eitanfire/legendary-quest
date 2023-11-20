import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import SubHeader from "../components/SubHeader";
import TakesList from "../features/takes/TakesList";

const TakesPage = (props) => {
  return (
    <Container className="wrapper">
      <SubHeader current="Takes" />
      <TakesList />
    </Container>
  );
};

export default TakesPage;
