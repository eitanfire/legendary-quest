import { Container } from "reactstrap";
import DisplayList from "../features/display/DisplayList";
import SubHeader from "../components/SubHeader";

const TheTeachersLounge = () => {
  return (
    <>
      <Container>
        <SubHeader current="The Teachers Lounge" />
        <span>
          <DisplayList className="displayList" />
        </span>
      </Container>
    </>
  );
};

export default TheTeachersLounge;
