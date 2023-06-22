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

const CourseDetail = ({ course }) => {
  const { image, icon, name, credit, description, theme } = course;

  return (
    <Col md="11" className="m-4">
      {theme}
      <h2>{credit}</h2>
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
