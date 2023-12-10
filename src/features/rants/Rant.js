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
      <Row>
        <CardGroup>
          <CardImg
            className="resource-img"
            src={image}
            alt={name}
            style={{ width: "150px" }}
          />
          <Card className="card resources-list">
              <CardTitle className="resource-title fw-bold">{name}</CardTitle>
              <CardText> {description}</CardText>
          </Card>
        </CardGroup>
      </Row>
    );
    return null;
  }
};
export default Rant;
