import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Col,
  CardImgOverlay,
} from "reactstrap";

const FreeCourseCard = ({ course }) => {
  const { image, icon, name, freeContentDescription } = course;

  return (
    <Col>
      <Card>
        <CardTitle>
          {icon} {name}
        </CardTitle>
        <CardImg Id="free-course" top src={image} alt={name} />
        <CardBody>
          {/* <CardImgOverlay id="icon"><span>{name}</span>{icon}</CardImgOverlay> */}
          <CardText>{freeContentDescription}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
};

export default FreeCourseCard;
