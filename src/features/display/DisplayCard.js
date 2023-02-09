import { Card, CardImg, CardText, CardBody, CardTitle } from "reactstrap";

const DisplayCard = ({ item }) => {
  const { image, name, description, icon } = item;
  return (
    <Card>
      <CardImg src={image} alt={name} />
      <CardTitle>{name}</CardTitle>
      <CardBody>
        <CardText>
          {icon}
          {description}
        </CardText>
      </CardBody>
    </Card>
  );
};

export default DisplayCard;