import { Col, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from "react-router-dom";

const SubHeader = ({ current, detail }) => {
  return (
    <Col id="BreadCrumb">
      <Breadcrumb>
        {current !== "Home" && current !== "The Teachers Lounge" && (
          <BreadcrumbItem>
            <Link to="/#TeachersLounge">☕️ The Teachers Lounge</Link>
          </BreadcrumbItem>
        )}
        {detail && current !== "Home" && current !== "The Teachers Lounge" && (
          <BreadcrumbItem>
            <Link to="/directory">Directory</Link>
          </BreadcrumbItem>
        )}
        <BreadcrumbItem active>
          {current === "The Teachers Lounge" ? <>☕️ {current}</> : current}
        </BreadcrumbItem>
      </Breadcrumb>
      <h2 className="text-center">{current}</h2>
      <hr />
    </Col>
  );
};

export default SubHeader;
