import { useSelector } from "react-redux";
import { Col, Row, Container } from "reactstrap";
import AnimatedDisplayCard from "./AnimatedDisplayCard";
import { selectFeaturedTake } from "../takes/takesSlice";
import { selectFeaturedRant } from "../rants/rantsSlice";
import { selectFeaturedCourse } from "../courses/coursesSlice";
import { shortSelectFeaturedCourse } from "../courses/coursesSlice";


const DisplayList = () => {
  const items = useSelector((state) => [
    selectFeaturedTake(state),
    selectFeaturedRant(state),
    selectFeaturedCourse(state),
  ]);

console.log('display items:', items);

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