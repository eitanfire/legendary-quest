import { useSelector } from "react-redux";
import { Row, Col, Card, Container } from "reactstrap";
import Take from "./Take";
import { selectAllTakes } from "./takesSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

const TakesList = () => {
  const isLoading = useSelector((state) => state.takes.isLoading);
  const errMsg = useSelector((state) => state.takes.errMsg);

  const takes = useSelector(selectAllTakes);

  // Separate archive takes from other takes
  const archiveTakes = takes.filter((take, index) => index > 0);

  return isLoading ? (
    <Loading />
  ) : errMsg ? (
    <Error errMsg={errMsg} />
  ) : (
    <Container className="text-center">
      {takes.map((take, index) => {
        const { id, link } = take;

        if (index === 0) {
          // Render the first take with "🔥 The Hot Take" label
          return (
            <Row className="text-center mb-5" key={id}>
              <Col>
                <h2 className="text-center">🔥 The Hot Take</h2>
                <Col>
                  <a href={link} target="_blank" rel="noreferrer">
                    <Take take={take} />
                  </a>
                </Col>
              </Col>
            </Row>
          );
        } else if (index === 1) {
          // Render the second take with "Doubletake" label
          return (
            <Row className="mb-5" key={id}>
              <h2 className="dt-and-archive-label text-center">Doubletake</h2>
              <h3 className="dt-and-archive-label-subheadings">
                Did you miss this last hot take? Dig in...it’s still warm!
              </h3>
              <Col className="mt-5 col col-xs-10">
                <a href={link} target="_blank" rel="noreferrer">
                  <Take take={take} />
                </a>
              </Col>
            </Row>
          );
        } else if (index === 2) {
          // Render the "Archive" section only once
          return (
            <Row className="mb-5" key={id}>
              <h2 className="dt-and-archive-label text-center">The Archive</h2>
              <h3 className="dt-and-archive-label-subheadings">
                Hit the stacks and go down the rabbithole
              </h3>
              <Col className="mt-5 col col-xs-10">
                <a href={link} target="_blank" rel="noreferrer">
                  <Take take={take} />
                </a>
              </Col>
            </Row>
          );
        } else {
          // Render other archive takes
          return (
            <Row className="extra-take mb-5" key={id}>
              <Col className="mt-5 col col-xs-10">
                <a href={link} target="_blank" rel="noreferrer">
                  <Take take={take} />
                </a>
              </Col>
            </Row>
          );
        }
      })}
    </Container>
  );
};

export default TakesList;
