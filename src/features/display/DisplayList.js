import { Col, Row, Container } from "reactstrap";
import AnimatedDisplayCard from "./AnimatedDisplayCard";
import { selectFeaturedSecret } from "../secrets/secretsSlice";
import { selectFeaturedRant } from "../rants/rantsSlice";
import { selectFeaturedCourse } from "../courses/coursesSlice";

const DisplayList = () => {
  const items = [
    selectFeaturedSecret(),
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