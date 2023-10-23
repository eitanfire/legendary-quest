import { Container } from "reactstrap";
import DisplayList from "../features/display/DisplayList";
import SubHeader from "../components/SubHeader";
import InfiniteScrollList from "../features/display/InfiniteScrollList";

const TheTeachersLounge = () => {
  return (
    <>
      <Container
      // className="theTeachersLounge"
      >
        <SubHeader current="The Teachers Lounge" />
        <span>
          <DisplayList className="displayList" />
        </span>
      </Container>
    </>
  );
};

export default TheTeachersLounge;
