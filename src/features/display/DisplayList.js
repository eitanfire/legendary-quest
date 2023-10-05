import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import AnimatedDisplayCard from "./AnimatedDisplayCard";
import { selectFeaturedTake, selectAllTakes,  } from "../takes/takesSlice";
import { selectFeaturedRant, selectAllRants } from "../rants/rantsSlice";
import {
  selectFeaturedCourse,
  selectAllCourses,
  selectRandomCourse,
  selectFreeCourse,
} from "../courses/coursesSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

const DisplayList = () => {
  const items = useSelector((state) => [
    selectFeaturedTake(state),
    selectFeaturedRant(state),
    selectFeaturedCourse(state),
    selectAllTakes(state),
    selectFreeCourse(state),
  ]);

  console.log("display items:", items);

  
  return (
    <Row>
      {items.map((item, idx) => {
        const { 
          icon, 
        title, featuredItem, freeItem, isLoading, errMsg } = item;
        if (isLoading) {
          return <Loading key={idx} />;
        }
        if (errMsg) {
          return <Error errMsg={errMsg} key={idx} />;
        }
        return (
          freeItem &&
          featuredItem && (
            <>
              <Col md className="m-1" key={idx}>
                <h3>
                  {icon}
                  {title}
                </h3>
                <AnimatedDisplayCard
                  item={{ 
                    freeItem, 
                  featuredItem }}
                  title={title}
                />
              </Col>
            </>
          )
        );
      })}
    </Row>
  );
};

export default DisplayList;
