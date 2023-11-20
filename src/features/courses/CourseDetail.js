import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Button,
} from "reactstrap";
import React from "react";
import "../../courseTheme.css";
import { getClassCredit } from "./creditType/getClassCredit";
import {
  makeCopyOfWarmups,
  makeCopyOfExtra,
  makeCopyOfCurriculum,
} from "../../utils/makeCopyOfLinks";

const CourseDetail = ({ course }) => {
  const {
    image,
    icon,
    name,
    credit,
    intro,
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
            <CardText>{intro}</CardText>
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
        )}{" "}
        {description && (
          <Col>
            <Card className="youtube-playlist">
              <a href={description} target="_blank" rel="noreferrer">
                {icon} Course description and essential questions for{name}
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
          <Col>
            <a
              href={makeCopyOfWarmups(warmups)}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="copy-button"> Make a Copy</Button>
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
            <a href={makeCopyOfExtra(extra)} target="_blank" rel="noreferrer">
              Make a Copy
            </a>
          </Col>
        </Row>
      )}
      <br></br>
      {curriculum && (
        <Row>
          <Col>
            <Card className="youtube-playlist">
              <a href={curriculum} target="_blank" rel="noreferrer">
                {icon} Curriculum
              </a>
            </Card>
          </Col>
          <Col className="youtube-playlist">
            <a
              href={makeCopyOfCurriculum(curriculum)}
              target="_blank"
              rel="noreferrer"
            >
              Make a Copy
            </a>
          </Col>
        </Row>
      )}
      <br></br>
      <br></br>
    </Container>
  );
};

export default CourseDetail;
