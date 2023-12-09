import { Col, Row, Container, Card, CardBody, CardHeader } from "reactstrap";
import SubHeader from "../components/SubHeader";
import TakesList from "../features/takes/TakesList";

const TakesPage = (props) => {
  return (
    <Container className="wrapper">
      <SubHeader current="Takes" />
      <p>Don't go on your teaching journey alone. Hone your craft with the insights you find here.</p>
      <TakesList />
    </Container>
  );
};

export default TakesPage;
