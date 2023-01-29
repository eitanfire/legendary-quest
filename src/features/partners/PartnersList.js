import { Col } from "reactstrap";
import { PARTNERS } from "../../app/shared/PARTNERS";
import Partner from './Partner';
import { selectAllPartners } from './partnersSlice';

const PartnersList = () => {
  const partners = selectAllPartners();
  return (
    <Col className="mt-4">
      {PARTNERS.map((partner) => {
        return (
          <div className="d-flex mb-5" key={partner.id}>
            <Partner partner={partner} />
          </div>
        );
      })}
    </Col>
  );
};

export default PartnersList;