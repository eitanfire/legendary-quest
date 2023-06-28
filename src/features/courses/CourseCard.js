import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { id, image, name, icon, credit, theme } = course;
  return (
    <Link to={`${id}`}>
      <Card>
        <CardImg className="card-image" src={image} alt={name} />{" "}
        <CardImgOverlay>
          <CardTitle>
            {icon} {name}
          </CardTitle>
        </CardImgOverlay>
      </Card>
    </Link>
  );
};

export default CourseCard;
