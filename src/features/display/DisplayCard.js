import { Card, CardImg, CardText, CardBody, CardTitle } from "reactstrap";

const DisplayCard = ({ item }) => {
  const { image, name, description, icon } = item;
  return (
    <Card className="display-boxes m-1">
      <CardImg src={image} alt={name} />
      <CardTitle>{name}</CardTitle>
      <CardBody>
        <CardText>
          {icon}
          {description[(0, 20)]}
        </CardText>
      </CardBody>
    </Card>
  );
};

export default DisplayCard;
