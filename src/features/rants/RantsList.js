import { Col } from "reactstrap";
import { RANTS } from "../../app/shared/RANTS";
import Rant from "./Rant";
import { selectAllRants } from "./rantsSlice";
import { Error } from "../../components/Error";
import { Loading } from "../../components/Loading";
import { useSelector } from "react-redux";

const RantsList = () => {
  const isLoading = useSelector(state.rants.isLoading);
  const errMsg = useSelector(state.rants.errMsg);

  const rants = selectAllRants();
  return isLoading ? (
    <Loading />
  ) : errMsg ? (
    <Error errMsg={errMsg} />
  ) : (
    <Col className="mt-4">
      <Row>
        {rants.map((rant) => {
          return (
            <div className="d-flex mb-5" key={rant.id}>
              <Rant rant={rant} />
            </div>
          );
        })}
      </Row>
    </Col>
  );
};

export default RantsList;
