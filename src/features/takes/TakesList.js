import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
// import { TAKES } from "../../app/shared/TAKES";
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
    <Col className="mt-4">
      <Row>
        {takes.map((take) => {
          return (
            <div className="d-flex mb-5" key={take.id}>
              <Take take={take} />
            </div>
          );
        })}
      </Row>
    </Col>
  );
};

export default TakesList;
