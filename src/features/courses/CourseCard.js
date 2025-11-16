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
    <Card style={{
      cursor: onClick ? 'pointer' : 'default',
      height: '250px',
      overflow: 'hidden'
    }}>
      <CardImg
        className="card-image"
        src={image}
        alt={name}
        style={{
          height: '250px',
          objectFit: 'cover'
        }}
      />
      <CardImgOverlay style={{
        display: 'flex',
        alignItems: 'flex-end',
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
        padding: '1.5rem'
      }}>
        <CardTitle style={{
          color: '#00B894',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          margin: 0,
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
        }}>
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
