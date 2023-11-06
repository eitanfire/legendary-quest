import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Col,
  CardImgOverlay,
  Container,
  Row
} from "reactstrap";
import React from "react";
// import "../../Credit.css";
import "../../courseTheme.css";
import { getClassCredit } from "./creditType/getClassCredit";

const CourseDetail = ({ course }) => {
  const {
    image,
    icon,
    name,
    credit,
    description,
    theme,
    youtube,
    extrayoutube,
    extrayoutube1,
  } = course;

  const creditArray = Array.isArray(credit) ? credit : [credit];
  const creditClasses = creditArray.map((creditItem) =>
    getClassCredit(creditItem)
  );

  return (
    <Container>
      <Col md="11" className="m-4">
        <span id={theme}></span>
        <h2>
          {creditArray.map((type, index) => (
            <span key={index} className={creditClasses[index]}>
              {type}
            </span>
          ))}
          {creditArray.length === 0 && (
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
      <Row>
        {" "}
        <Col>
          <Card className="youtube-playlist">
            <a href=
            {youtube}
            target="_blank"
              rel="noreferrer">
             {icon} Playlist for {name}
            "</a>
          </Card>
        </Col>
      </Row>
      <Col>{extrayoutube}</Col>
      <Col>{extrayoutube1}</Col>
    </Container>
  );
};

export default CourseDetail;
