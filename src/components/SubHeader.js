import { Col, Row, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from "react-router-dom";

const SubHeader = ({ current, detail }) => {

  return (
    <Row Id="BreadCrumb">
      <Col>
        <Breadcrumb>
          <BreadcrumbItem Id="icon">
            <Link theme to="/">
              ☕️
            </Link>
          </BreadcrumbItem>
          {detail && (
            <BreadcrumbItem>
              <Link to="/directory">Directory</Link>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem active>{current}</BreadcrumbItem>
        </Breadcrumb>
        <h2>{current}</h2>
        <hr />
      </Col>
    </Row>
  );
};

export default SubHeader;
