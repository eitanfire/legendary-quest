import { Container } from "reactstrap";
import DisplayList from "../features/display/DisplayList";
import SubHeader from "../components/SubHeader";

const TheTeachersLounge = () => {
  return (
    <>
      <Container className="theTeachersLounge">
        <SubHeader current="The Teachers Lounge" />
        <DisplayList className="displayList" />
      </Container>
    </>
  );
};

export default TheTeachersLounge;