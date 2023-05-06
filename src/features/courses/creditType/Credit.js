import { Col } from "reactstrap";
import '../../../Credit.css';
import COURSES from '../../../app/shared/COURSES';

const Credit = ( course ) => {
  return <Col className="credit">{course}</Col>;
};    

export default Credit;
