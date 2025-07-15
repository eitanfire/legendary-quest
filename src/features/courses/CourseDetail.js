import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
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
import GoogleShare from "../../components/GoogleShare";
// import STWResources from '../../features/courses/stw-resources.html';

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
          <CardBody className="course-body">
            <CardText className="course-intro-text">{intro}</CardText>
          </CardBody>
        </Card>
      </Col>
      {description && (
        <div className="course-links-container mb-4">
          <Row>
            {/* <> */}
            <Col className="col col-8 col col-md-9 col-xxl-10">
              <Card className="youtube-playlist">
                <a href={description} target="_blank" rel="noreferrer">
                  {icon} Course description and essential questions for {name}
                </a>
              </Card>
            </Col>
            <Col>
              <a
                href={makeCopyOfDescription(description)}
                target="_blank"
                rel="noreferrer"
              >
                <button className="btn btn-lg btn-primary">Make a Copy</button>
              </a>
            </Col>
            {/* </> */}
          </Row>
          <br></br>
          <Row>
            {youtube && (
              <Col>
                <Card className="youtube-playlist">
                  <a href={youtube} target="_blank" rel="noreferrer">
                    <a className="btn btn-social-icon btn-google">
                      <i className="fa fa-youtube" />
                    </a>{" "}
                    YouTube playlist for {name}
                  </a>
                </Card>
              </Col>
            )}
            {extrayoutube && (
              <Col>
                <Card className="youtube-playlist">
                  <a href={extrayoutube} target="_blank" rel="noreferrer">
                    <a className="btn btn-social-icon btn-google">
                      <i className="fa fa-youtube" />
                    </a>{" "}
                    Related playlist for {name}
                  </a>
                </Card>
              </Col>
            )}
            {extrayoutube1 && (
              <Col>
                <Card className="youtube-playlist">
                  <a href={extrayoutube1} target="_blank" rel="noreferrer">
                    <a className="btn btn-social-icon btn-google">
                      <i className="fa fa-youtube" />
                    </a>{" "}
                    Another related playlist for {name}
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
                  <button className="btn btn-lg btn-primary">
                    Make a Copy
                  </button>
                </a>
              </Col>
              <div
                class="g-sharetoclassroom"
                data-size="32"
                data-url="..."
              ></div>
            </Row>
          )}
          <Row>
            {/* <a href="#warm-ups" onClick="renderWidget();">
            Render the Classroom share button
          </a> */}
            {/* <div id="warm-ups">
              <div
                class="g-sharetoclassroom"
                data-size="32"
                data-url="..."
              ></div>
            </div> */}
            {/* <g:sharetoclassroom size=32 url="http://google.com"></g:sharetoclassroom> */}
            {/* <a
            href="https://classroom.google.com/share?url=https://foo.com/"
            topic="Warm-Up Questions"
          >
            Warm-Ups
          </a> */}
            {/* <Col class="g-sharetoclassroom" data-size="32" data-url="..."> */}
            {/* <a
              href="https://classroom.google.com/share?url=https://foo.com/"
              topic="Warm-Up Questions"
              body="Come to class on time and aim to write at least five (5) sentences or a sketchnote. You may respond to the question, to another prompt of your choice, journal about how it’s going or what you’re grateful for, or add to your own story"
              // className="g-sharetoclassroom"
            >
              {" "}
              Warm-Ups
            </a> */}
            {/* <a
              href="https://classroom.google.com/share?url=https://foo.com/"
              data-topic="Warm-Up Questions"
              body="Come to class on time and aim to write at least five (5) sentences or a sketchnote. You may respond to the question, to another prompt of your choice, journal about how it’s going or what you’re grateful for, or add to your own story"
              // className="g-sharetoclassroom"
            >
              {" "}
              Warm-Ups
            </a> */}
            {/* <g:sharetoclassroom
              size="32"
              url="http://google.com"
            ></g:sharetoclassroom> */}
            {/* {React.createElement(
              "g:sharetoclassroom",
              { theme: "dark", size: "32" },
              null
            )}
            ; */}
            {/* <div class="g-sharetoclassroom" data-size="32" data-url="..."></div> */}
            {/* </Col> */}
            {/* {warmups && (
              <div
                className="warmUps"
                explicit
                clasName="g-sharetoclassroom"
                data-size="64"
                data-theme="classic"
                data-topic="Warm-Up Questions"
                data-url="https://docs.google.com/document/d/1dbdDA3tfZp5NugzgwWx2FdOfh7b3U2xHxGbILYKIliA/"
                data-role="presentation" */}
            {/* //  data-url={mapassignments}
                //            data-url1="https://docs.google.com/document/d/1dbdDA3tfZp5NugzgwWx2FdOfh7b3U2xHxGbILYKIliA/edit"
                //            data-url2="https://docs.google.com/document/d/1cftkj88mYvBn6q3JI5YAJXJgcVvpERpo1nWDzs88wSY/edit"
                data-itemtype="assignment"
                data-title="Warm-Ups"
                data-body="Come to class on time and aim to write at least five (5) sentences or a sketchnote. You may respond to the question, to another prompt of your choice, journal about how it’s going or what you’re grateful for, or add to your own story."
                data-copies-only={true}
                // data-role="dialog"
              >
                hello */}
            {/* </div>
            )} */}
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
                <a
                  href={makeCopyOfExtra(extra)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="btn btn-lg btn-primary">
                    Make a Copy
                  </button>
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
                  <button className="btn btn-lg btn-primary">
                    Make a Copy
                  </button>
                </a>
              </Col>
            </Row>
          )}
        </div>
      )}
    </Container>
  );
};

export default CourseDetail;
