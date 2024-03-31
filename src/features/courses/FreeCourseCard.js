import { Card, CardImg, CardText, CardBody, CardTitle, Col } from "reactstrap";

const FreeCourseCard = ({ course }) => {
  const { image, icon, name, freeContentDescription } = course;

  return (
    <Col>
      <Card>
        <CardTitle className="freeCourseCardTitle text-center">
          {icon} {name}
        </CardTitle>
        <CardImg id="free-course" top src={image} alt={name} />
        <CardBody>
          <CardText>{freeContentDescription}</CardText>
        </CardBody>
      </Card>
    </Col>
  );
};

export default FreeCourseCard;
