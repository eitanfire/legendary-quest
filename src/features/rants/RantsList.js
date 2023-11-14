import { Button, Card, Col, Container, Row } from "reactstrap";
// import RANTS from "../../app/shared/RANTS";
import Rant from "./Rant";
import { selectAllRants } from "./rantsSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";

const RantsList = () => {

  const isLoading = useSelector((state) => state.rants.isLoading);
  const errMsg = useSelector((state) => state.rants.errMsg);


  const rants = useSelector(selectAllRants);
  return isLoading ? (
    <Loading />
  ) : errMsg ? (
    <Error errMsg={errMsg} />
  ) : (
    <Container>
      <Row className="col-12">
        {rants.map((rant) => {
          const { id, link } = rant;
          return (
            <Card className="mb-5">
              <a
                key={`${id}`}
                href={`${link}`}
                target="_blank"
                rel="noreferrer"
              >
                <Rant rant={rant} key={rant.id} />
              </a>
            </Card>
          );
        })}
      </Row>
    </Container>
  );
};

export default RantsList;
