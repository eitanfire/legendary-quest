import { Card, CardImg, CardText, CardBody, CardTitle, Col } from "reactstrap";
import { getCourseThemeColor } from "../../utils/courseThemeColors";

const FreeCourseCard = ({ course }) => {
  const { id, image, icon, name, freeContentDescription } = course;
  const themeColor = getCourseThemeColor(id);

  return (
    <Col>
      <Card style={{
        border: `3px solid ${themeColor.primary}`,
        borderRadius: '0.375rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <CardTitle
          className="freeCourseCardTitle text-center"
          style={{
            color: themeColor.primary,
            padding: '1rem',
            fontWeight: 'bold',
            margin: 0
          }}
        >
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
