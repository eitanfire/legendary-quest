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
            className="rant-img"
            src={image}
            alt={name}
            style={{ width: "150px" }}
          />
          <Card className="card rants-list">
            <CardTitle className="rant-title col-8">
              <CardTitle className="rant-text fw-bold">{name}</CardTitle>
              <CardText> {description}</CardText>
            </CardTitle>
          </Card>
        </CardGroup>
      </Row>
    );
    return null;
  }
};
export default Rant;
