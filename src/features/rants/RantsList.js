import { Card, Col, Row } from "reactstrap";
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
    <Row className="mt-4 col-9">
      {rants.map((rant) => {
        const { id, link } = rant;
        return (
          <a href={`${link}`} target="_blank" rel="noreferrer">
            <button>
              <div className="rants-list d-flex mb-5 pt-5" key={rant.id}>
                <Rant rant={rant} />
              </div>
            </button>
          </a>
        );
      })}
    </Row>
  );
};

export default RantsList;
