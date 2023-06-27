import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Col,
  CardImgOverlay,
} from "reactstrap";
import "../../Credit.css";
import { getClassCredit } from "./creditType/getClassCredit";

const CourseDetail = ({ course }) => {
  const { image, icon, name, credit, description } = course;

  const creditClasses = getClassCredit(credit);

  return (
    <Col md="11" className="m-4">
      <h2>
        {credit.map((type, index) => (
          <span key={index} className={creditClasses[index]}>
            {type}
          </span>
        ))}
        {credit.length === 0 && (
          <span className="electiveCredit">Elective</span>
        )}
      </h2>
      <Card>
        <CardTitle className="card-detail-title">
          {icon} {name}
        </CardTitle>
        <CardImg className="card-detail-image" top src={image} alt={name} />
        <CardBody>
          <CardText>{description}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
};

export default CourseDetail;
