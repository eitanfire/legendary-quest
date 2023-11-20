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
    <Container>
      <Row className="col-12">
        {takes.map((take) => {
          const { id, link } = take;
          return (
            <Card className="mb-5">
              <a
                key={`${id}`}
                href={`${link}`}
                target="_blank"
                rel="noreferrer"
              >
                <Take take={take} key={take.id} />
              </a>
            </Card>
          );
        })}
      </Row>
    </Container>
  );
};

export default TakesList;
