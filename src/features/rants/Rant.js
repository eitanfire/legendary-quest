import {
  CardGroup,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";

const Rant = ({ rant }) => {
  if (rant) {
    const { name, image, description } = rant;
    return (
      <Row className="card resources-list">
        <CardGroup>
          <Col className="col col-sm-3">
            <CardImg
              className="resource-img"
              src={image}
              alt={name}
              style={{ width: "150px" }}
            />
          </Col>
          <Col>
            <CardTitle className="resource-title take fw-bold">
              {name}
            </CardTitle>
            <CardText> {description}</CardText>
          </Col>
        </CardGroup>
      </Row>
    );
    return null;
  }
};
export default Rant;
