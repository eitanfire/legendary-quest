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
    selectFeaturedCourse(state),
    selectFeaturedRant(state),
  ]);

  console.log("display items:", items);

  return (
    <Row className="displayList">
      {items.map((item, idx) => {
        const { icon, title, subtitle, link, featuredItem, isLoading, errMsg } = item;
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
                <h1>
                  {/* <Link to={`${link}`}> */}
                  <a href={`${link}`}>
                    {icon}
                    {title}
                    {/* </Link> */}
                  </a>
                </h1>
                <h2>{subtitle}</h2>
                {/* <Link to={`${CourseCard}`}> */}
                <AnimatedDisplayCard item={featuredItem} title={title} />
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
