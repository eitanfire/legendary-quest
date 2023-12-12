import { Container } from "reactstrap";
import DisplayList from "../features/display/DisplayList";
import SubHeader from "../components/SubHeader";
import React, { useEffect } from "react";

const TheTeachersLounge = () => {
    useEffect(() => {
      document.title = "The Teachers Lounge";
    }, []);
    
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
