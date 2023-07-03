import { Col } from "reactstrap";
import "../../../Credit.css";

const Credit = ({ course }) => {// Destructure the course prop
  return <Col className="credit">{course}</Col>;
};

export default Credit;
