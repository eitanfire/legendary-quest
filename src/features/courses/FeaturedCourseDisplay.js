import React from "react";
import { Card, CardImg, CardBody, CardTitle, CardText, Row, Col, Badge, Button } from "reactstrap";
import { getClassCredit } from "./creditType/getClassCredit";

const FeaturedCourseDisplay = ({ course, onClose }) => {
  if (!course) return null;

  const {
    image,
    icon,
    name,
    credit,
    intro,
    description,
    youtube,
    warmups,
    extra,
    curriculum,
  } = course;

  const creditArray = Array.isArray(credit) ? credit : [credit];

  return (
    <div className="featured-course-display mb-4 p-4 border rounded bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <Badge color="info" className="me-2">AI Recommended</Badge>
          Featured Course
        </h4>
        {onClose && (
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Close featured course"
          ></button>
        )}
      </div>

      <Row>
        <Col md="4">
          <Card>
            <CardImg top src={image} alt={name} className="rounded" />
          </Card>
        </Col>

        <Col md="8">
          <div className="mb-2">
            {creditArray.map((type, index) => {
              const creditClass = typeof type === 'string' ? getClassCredit(type) : '';
              const creditText = typeof type === 'string' ? type : type.props?.children || '';
              return (
                <Badge key={index} color="secondary" className="me-2">
                  {creditText}
                </Badge>
              );
            })}
          </div>

          <h3 className="mb-3">
            {icon} {name}
          </h3>

          <CardText className="mb-3">{intro}</CardText>

          <div className="course-links">
            <Row className="g-2">
              {description && (
                <Col xs="12" sm="6">
                  <Button
                    color="primary"
                    size="sm"
                    href={description}
                    target="_blank"
                    rel="noopener noreferrer"
                    block
                  >
                    📄 Course Description
                  </Button>
                </Col>
              )}

              {youtube && (
                <Col xs="12" sm="6">
                  <Button
                    color="danger"
                    size="sm"
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    block
                  >
                    📺 YouTube Playlist
                  </Button>
                </Col>
              )}

              {warmups && (
                <Col xs="12" sm="6">
                  <Button
                    color="info"
                    size="sm"
                    href={warmups}
                    target="_blank"
                    rel="noopener noreferrer"
                    block
                  >
                    💡 Warm-Up Questions
                  </Button>
                </Col>
              )}

              {curriculum && (
                <Col xs="12" sm="6">
                  <Button
                    color="success"
                    size="sm"
                    href={curriculum}
                    target="_blank"
                    rel="noopener noreferrer"
                    block
                  >
                    📚 Full Curriculum
                  </Button>
                </Col>
              )}

              {extra && (
                <Col xs="12" sm="6">
                  <Button
                    color="warning"
                    size="sm"
                    href={extra}
                    target="_blank"
                    rel="noopener noreferrer"
                    block
                  >
                    ⭐ Extra Credit Resources
                  </Button>
                </Col>
              )}
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FeaturedCourseDisplay;
