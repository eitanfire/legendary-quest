import {
  Card,
  CardGroup,
  CardImg,
  CardText,
  CardTitle,
  Row,
} from "reactstrap";

const Rant = ({ rant }) => {
  if (rant) {
    const { name, image, description } = rant;
    return (
      <Row className="card resources-list">
        <CardGroup>
          <CardImg
            className="resource-img"
            src={image}
            alt={name}
            style={{ width: "150px" }}
          />
          <span>
            <CardTitle className="resource-title take fw-bold">{name}</CardTitle>
            <CardText> {description}</CardText>
          </span>
        </CardGroup>
      </Row>
    );
    return null;
  }
};
export default Rant;
