import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import AnimatedDisplayCard from "./AnimatedDisplayCard";
import { selectFeaturedTake } from "../takes/takesSlice";
import { selectFeaturedRant } from "../rants/rantsSlice";
import { selectFeaturedCourse } from "../courses/coursesSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
import CourseCard from "../courses/CourseCard";

const DisplayList = () => {
  const items = useSelector((state) => [
    selectFeaturedTake(state),
    selectFeaturedRant(state),
    selectFeaturedCourse(state),
  ]);

  console.log("display items:", items);

  return (
    <Row className="displayList">
      {items.map((item, idx) => {
        const { icon, title, featuredItem, isLoading, errMsg } = item;
        if (isLoading) {
          return <Loading key={idx} />;
        }
        if (errMsg) {
          return <Error errMsg={errMsg} key={idx} />;
        }
        return (
          featuredItem && (
            <>
              {/* <span className="col"> */}
              <Col
                // className="display-boxes m-1"
                key={idx}
              >
                <h3>
                  {icon}
                  {title}
                </h3>
                {/* <Link to={`${CourseCard}`}> */}
                  <AnimatedDisplayCard
                    item={featuredItem}
                    title={title}
                  />
                {/* </Link> */}
              </Col>
              {/* </span> */}
            </>
          )
        );
      })}
    </Row>
  );
};

export default DisplayList;
