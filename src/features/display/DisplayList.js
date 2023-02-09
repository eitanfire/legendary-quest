import { Col, Row, Container } from "reactstrap";
import AnimatedDisplayCard from "./AnimatedDisplayCard";
import { selectFeaturedTake } from "../takes/takesSlice";
import { selectFeaturedRant } from "../rants/rantsSlice";
import { selectFeaturedCourse } from "../courses/coursesSlice";

const DisplayList = () => {
  const items = [
    selectFeaturedTake(),
    selectFeaturedRant(),
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