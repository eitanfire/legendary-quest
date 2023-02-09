import { Col } from "reactstrap";
import { RANTS } from "../../app/shared/RANTS";
import Rant from './Rant';
import { selectAllRants } from './rantsSlice';

const RantsList = () => {
  const partners = selectAllRants();
  return (
    <Col className="mt-4">
      {RANTS.map((rant) => {
        return (
          <div className="d-flex mb-5" key={rant.id}>
            <Rant rant={rant} />
          </div>
        );
      })}
    </Col>
  );
};

export default RantsList;