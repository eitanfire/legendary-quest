import { Card, CardImg, CardImgOverlay, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

const CourseCard = ({ course, onClick }) => {
  const { id, image, name, icon, credit, theme } = course;

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(course);
    }
  };

  const CardContent = (
    <Card style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <CardImg className="card-image" src={image} alt={name} />{" "}
      <CardImgOverlay>
        <CardTitle>
          {icon} {name}
        </CardTitle>
      </CardImgOverlay>
    </Card>
  );

  // If onClick is provided, use div wrapper, otherwise use Link
  return onClick ? (
    <div onClick={handleClick}>
      {CardContent}
    </div>
  ) : (
    <Link to={`${id}`}>
      {CardContent}
    </Link>
  );
};

export default CourseCard;
