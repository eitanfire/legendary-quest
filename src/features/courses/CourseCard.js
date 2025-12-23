import { Card, CardImg, CardImgOverlay } from "reactstrap";
import { Link } from "react-router-dom";
import { getCourseThemeColor } from "../../utils/courseThemeColors";
import { useState } from "react";

const CourseCard = ({ course, onClick }) => {
  const { id, image, name, icon } = course;
  const [isHovered, setIsHovered] = useState(false);

  const themeColor = getCourseThemeColor(id);

  // Extract text from name (which might be a JSX element or string)
  const nameText = typeof name === 'string' ? name : (name?.props?.children || 'Course');

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(course);
    }
  };

  const CardContent = (
    <Card
      style={{
        cursor: onClick ? 'pointer' : 'default',
        height: '250px',
        overflow: 'hidden',
        border: `3px solid ${themeColor.primary}`,
        borderRadius: '0.375rem',
        boxShadow: isHovered
          ? `0 8px 16px rgba(0, 0, 0, 0.2), 0 0 20px ${themeColor.primary}60`
          : '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        position: 'relative'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardImg
        className="card-image"
        src={image}
        alt={nameText}
        style={{
          height: '250px',
          objectFit: 'cover'
        }}
      />
      <CardImgOverlay style={{
        display: 'flex',
        alignItems: 'flex-end',
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
        padding: 0,
        position: 'relative'
      }}>
        {/* Pattern banner behind title */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: `linear-gradient(135deg, ${themeColor.primary} 0%, ${themeColor.secondary} 100%)`,
          opacity: 0.4,
          zIndex: 1
        }} />

        <div style={{
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          margin: 0,
          padding: '1.5rem',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
          position: 'relative',
          zIndex: 2,
          width: '100%'
        }}>
          {icon} {name}
        </div>
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
