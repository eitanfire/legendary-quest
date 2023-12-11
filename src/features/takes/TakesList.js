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

  return isLoading ? (
    <Loading />
  ) : errMsg ? (
    <Error errMsg={errMsg} />
  ) : (
    <Container className="text-center">
      {takes.map((take, index) => {
        const { id, link } = take;
        let label;
        if (index === 0) {
          label = "🔥 The Hot Take";
          return (
            <Row className="text-center mb-5" key={id}>
              <Col>
                <h2 className="text-center">{label}</h2>
                <Col>
                  <a href={link} target="_blank" rel="noreferrer">
                    <Take take={take} />
                  </a>
                </Col>
              </Col>
            </Row>
          );
        } else {
          label = index === 1 ? "Doubletake" : "The Archive";
          return (
            <Row className="mb-5" key={id}>
              {/* <Col className="col col-xs-2"> */}
              <h2 className="dt-and-archive-label">{label}</h2>
              <p>
                {index === 1
                  ? "Did you miss this last hot take? Dig in...it’s still warm!"
                  : "Hit the stacks and go down the rabbithole"}
              </p>
              {/* </Col> */}
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
