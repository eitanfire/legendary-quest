import { Container } from "reactstrap";
import DisplayList from "../features/display/DisplayList";

const HomePage = () => {
  return (
    <Container>
      <DisplayList className="displayList" />
    </Container>
  );
};

export default HomePage;