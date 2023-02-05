import { Col, Row, Container } from "reactstrap";
import AnimatedDisplayCard from "./AnimatedDisplayCard";
import { selectFeaturedPromotion } from "../promotions/promotionsSlice";
import { selectFeaturedPartner } from "../partners/partnersSlice";
import { selectFeaturedCourse } from "../courses/coursesSlice";

const DisplayList = () => {
  const items = [
    selectFeaturedPromotion(),
    selectFeaturedPartner(),
    selectFeaturedCourse(),
  ];

  return (
    <Row>
      {items.map((item, idx) => {
        return (
           item && (
          <Col md className="m-1" key={idx}>
            <AnimatedDisplayCard item={item} />
          </Col>
        ));
      })}
    </Row>
  );
};


export default DisplayList;