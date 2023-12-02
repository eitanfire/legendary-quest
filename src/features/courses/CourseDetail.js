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
  makeCopyOfDescription,
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
      <div className="course-links-container mb-4">
        <Row>
          {description && (
            <Col className="col col-8 col col-md-9 col-xxl-10">
              <Card className="youtube-playlist">
                <a href={description} target="_blank" rel="noreferrer">
                  {icon} Course description and essential questions for {name}
                </a>
              </Card>
            </Col>
          )}
          <Col>
            <a
              href={makeCopyOfDescription(description)}
              target="_blank"
              rel="noreferrer"
            >
              <Button className="copy-button active" role="button">
                Make a Copy
              </Button>
            </a>
          </Col>
        </Row>
        <br></br>
        <Row>
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
          )}
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
            <Col className="col col-8 col col-md-9 col-xxl-10">
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
                <Button className="copy-button active" role="button">
                  Make a Copy
                </Button>
              </a>
            </Col>
          </Row>
        )}
        <Row>
          <p>
            Warm-ups, Bellringers, Skill Drills, Class Openers, Bellwork, Do
            Nows, Entry Tickets, Welcome Work, Questions of the Day.
            <br></br>
            Starting class by having students work on a literacy activity can
            increase your effectiveness in the classroom.
            <br></br>I begin class by projecting a daily warm-up question for
            students to respond to as class begins. I ask students to respond to
            a thought-provoking question that connects with their own identity
            and with the content we're studying in class. I share these
            questions with students on Google Classroom in a view only file and
            a response sheet which I have Google Classroom make a copy for each
            student. I find that the response sheet is helpful to keep students
            organized but I don't require them to use it. While students are
            hard at work I take attendance and get complete any setup for the
            class period. After about 10 minutes I check students' response and
            record a grade between 1 and 8 points for their response. After 10
            responses I record the grade in the gradebook. I allow students to
            respond in writing or with a sketchnote and allow students to write
            about other things as well so that they have a chance to get
            prepared for the lessson and to wake up their brains. After students
            have a chanch to respond in writing we discuss as a class and I take
            the opportunity to use the warm-up as an entry point into the day's
            lesson.
          </p>
          <div
            class="g-sharetoclassroom"
            data-size="64"
            data-itemtype="assignment"
            data-title="Warm-Ups"
            data-body="Come to class on time and aim to write at least five (5) sentences or a sketchnote. You may respond to the question, to another prompt of your choice, journal about how it’s going or what you’re grateful for, or add to your own story."
            data-theme="classic"
            // data-role="presentation"
            // data-url={mapassignments}
            //           data-url1="https://docs.google.com/document/d/1dbdDA3tfZp5NugzgwWx2FdOfh7b3U2xHxGbILYKIliA/edit"
            //           data-url2="https://docs.google.com/document/d/1cftkj88mYvBn6q3JI5YAJXJgcVvpERpo1nWDzs88wSY/edit"
                       data-topic="Warm-Up Questions"
                       data-url="https://docs.google.com/document/d/1dbdDA3tfZp5NugzgwWx2FdOfh7b3U2xHxGbILYKIliA/copy"
            //            data-copies-only=true
                      //  className="vRMGwf oJeWuf"
            //            data-role="dialog"
          ></div>
        </Row>
        <br></br>
        {extra && (
          <Row>
            <Col className="col col-8 col col-md-9 col-xxl-10">
              <Card className="youtube-playlist">
                <a href={extra} target="_blank" rel="noreferrer">
                  {icon} Resources for Extra Credit and Honors Work
                </a>
              </Card>
            </Col>
            <Col>
              <a href={makeCopyOfExtra(extra)} target="_blank" rel="noreferrer">
                <Button className="copy-button active" role="button">
                  Make a Copy
                </Button>
              </a>
            </Col>
          </Row>
        )}
        <br></br>
        {curriculum && (
          <Row>
            <Col className="col col-8 col col-md-9 col-xxl-10">
              <Card className="youtube-playlist">
                <a href={curriculum} target="_blank" rel="noreferrer">
                  {icon} Curriculum
                </a>
              </Card>
            </Col>
            <Col>
              <a
                href={makeCopyOfCurriculum(curriculum)}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="copy-button active" role="button">
                  Make a Copy
                </Button>
              </a>
            </Col>
          </Row>
        )}
      </div>
    </Container>
  );
};

export default CourseDetail;
