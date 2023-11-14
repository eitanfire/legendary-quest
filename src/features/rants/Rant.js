import { Card, CardGroup, CardImg, CardImgOverlay, CardText, CardTitle, Col, Row} from "reactstrap";

const Rant = ({ rant }) => {
  if (rant) {
    const { id, name, image, link, description } = rant;
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
          {/* <Col className="col col-4"> */}

          {/* </Col> */}
          {/* <Col className="col col-8"> */}
          <CardTitle className="rant-title col-8">
            <CardTitle className="rant-text fw-bold">{name}</CardTitle>
            <CardText> {description}</CardText>
          </CardTitle>
          {/* </Col> */}
        </Card>
      </CardGroup>
       </Row>
    );
    return null;
  }
};
export default Rant;
