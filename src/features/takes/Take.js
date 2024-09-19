import {
  Card,
  CardGroup,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

const Take = ({ take }) => {
  if (take) {
    const { image, name, description } = take;
    return (
      <Row className="take-row">
        <CardGroup>
          <Col className="col col-xs">
            <CardImg
              className="resource-img"
              src={image}
              alt={name}
              style={{ width: "250px" }}
            />
          </Col>
          <Col>
            <Card className="card resources-list">
              <CardTitle className="resource-title fw-bold">{name}</CardTitle>
              <CardText> {description}</CardText>
            </Card>
          </Col>
        </CardGroup>
      </Row>
    );
    return null;
  }
};
export default Take;
