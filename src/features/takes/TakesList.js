import { Col } from "reactstrap";
import { TAKES } from "../../app/shared/TAKES";
import Take from './Take';
import { selectAllTakes } from './takesSlice';

const TakesList = () => {
  const takes = selectAllTakes();
  return (
    <Col className="mt-4">
      {TAKES.map((take) => {
        return (
          <div className="d-flex mb-5" key={take.id}>
            <Take take={take} />
          </div>
        );
      })}
    </Col>
  );
};

export default TakesList;