import { Col, Row, Container } from "reactstrap";
import DisplayCard from "./DisplayCard";
// import { selectFeaturedCourse } from "../courses/coursesSlice";
import { selectFeaturedPromotion } from "../promotions/promotionsSlice";
import { selectFeaturedPartner } from "../partners/partnersSlice";
import { selectRandomCourse } from "../courses/coursesSlice";

const DisplayList = () => {
  const items = [
    // selectFeaturedCourse(),
    selectFeaturedPromotion(),
    selectFeaturedPartner(),
    selectRandomCourse(),
  ];

  return (
    <Row>
      {items.map((item, idx) => {
        return (
          <Col md className="m-1" key={idx}>
            <DisplayCard item={item} />
          </Col>
        );
      })}
    </Row>
  );
};


export default DisplayList;