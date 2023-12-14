import { CardGroup, CardImg, CardText, CardBody, CardTitle, Col } from "reactstrap";
import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

const AnimatedDisplayCard = ({ item }) => {
  const { image, name, description, intro, icon } = item;
  const [toggle, setToggle] = useState(false);

  const animatedStyle = useSpring({
    opacity: toggle ? 1 : 0,
    transform: toggle ? "scale(1,1)" : "scale(1,0)",
    config: { duration: 500 },
  });

  useEffect(() => {
    setToggle(true);
  }, []);

  return (
    <animated.div className="theTeachersLounge" style={animatedStyle}>
      <CardGroup className="dispaly-card-group">
        <CardImg className="dispaly-card-image" src={image} alt={name} />
        <CardBody>
          <CardTitle>
            <span id="icon">{icon}</span> {name}
          </CardTitle>
          <Col className="display-card-intro">
            {intro && <CardText>{intro}</CardText>}
            {!intro && <CardText>{description}</CardText>}
          </Col>
        </CardBody>
      </CardGroup>
    </animated.div>
  );
};

export default AnimatedDisplayCard;
