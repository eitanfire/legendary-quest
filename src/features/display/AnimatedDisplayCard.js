import { Card, CardImg, CardText, CardBody, CardTitle } from "reactstrap";
import { useState, useEffect } from 'react';
import { useSpring, animated } from "react-spring";

const AnimatedDisplayCard = ({ item }) => {
  const { image, name, description, icon } = item;
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
      <Card>
        <CardImg src={image} alt={name} />
        <CardBody>
          <CardTitle>
            <span id="icon">{icon}</span> {name}
          </CardTitle>
          <CardText>{description}</CardText>

          {/* <CardText>{description.substring(0, 220)}</CardText> */}

          {/* <p className={classes.details}>
            {item.description.length > 250
              ? `${item.description.substring(0, 250)}...`
              : item.description}
          </p> */}
        </CardBody>
      </Card>
    </animated.div>
  );
};

export default AnimatedDisplayCard;