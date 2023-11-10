import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Col,
  CardImgOverlay,
  Container,
  Row,
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
    id,
    warmups,
    extra,
    curriculum,
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
        {youtube && (
          <Col>
            <Card className="youtube-playlist">
              <a href={youtube} target="_blank" rel="noreferrer">
                {icon} YouTube playlist for {name}
              </a>
            </Card>
          </Col>
        )}
        {extrayoutube && (
          <Col>
            <Card className="youtube-playlist">
              <a href={extrayoutube} target="_blank" rel="noreferrer">
                {icon} Related playlist for {name}
              </a>
            </Card>
          </Col>
        )}{" "}
        {extrayoutube1 && (
          <Col>
            <Card className="youtube-playlist">
              <a href={extrayoutube1} target="_blank" rel="noreferrer">
                {icon} Another related playlist for {name}
              </a>
            </Card>
          </Col>
        )}
      </Row>
      <br></br>
      {warmups && (
        <Row>
          <Col>
            <Card className="youtube-playlist">
              <a href={warmups} target="_blank" rel="noreferrer">
                {icon} Warm-up questions
              </a>
            </Card>
          </Col>
          <Col className="youtube-playlist">
            <a
              href="https://docs.google.com/document/d/1xkXxjwE4FKx9pmOleHYkNFJFl5DK4yxBoJj_PPUwdy0/copy"
              target="_blank"
              rel="noreferrer"
            >
              Make a Copy
            </a>
          </Col>
        </Row>
      )}
      <br></br>
      {extra && (
        <Row>
          <Col>
            <Card className="youtube-playlist">
              <a href={extra} target="_blank" rel="noreferrer">
                {icon} Resources for Extra Credit and Honors Work
              </a>
            </Card>
          </Col>
          <Col className="youtube-playlist">
            <a
              href="https://docs.google.com/document/d/1JYHPc44KjabOynCVk2p1XROe4OZuLllRo_kKBwWG-w4/copy"
              target="_blank"
              rel="noreferrer"
            >
              Make a Copy
            </a>
          </Col>
        </Row>
      )}
      <br></br>
      {curriculum && (<Row>
        <Col>
          <Card className="youtube-playlist">
            <a href={curriculum} target="_blank" rel="noreferrer">
              {icon} Curriculum
            </a>
          </Card>
        </Col>
        <Col className="youtube-playlist">
          <a
            href="https://docs.google.com/document/d/1JYHPc44KjabOynCVk2p1XROe4OZuLllRo_kKBwWG-w4/copy"
            target="_blank"
            rel="noreferrer"
          >
            Make a Copy
          </a>
        </Col>
      </Row>)}
      <br></br>
      <br></br>
    </Container>
  );
};

export default CourseDetail;
