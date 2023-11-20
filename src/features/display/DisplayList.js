import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import AnimatedDisplayCard from "./AnimatedDisplayCard";
import { selectFeaturedTake } from "../takes/takesSlice";
import { selectFeaturedRant } from "../rants/rantsSlice";
import { selectFeaturedCourse } from "../courses/coursesSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

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
        const { icon, title, subtitle, link, featuredItem, isLoading, errMsg } =
          item;
        if (isLoading) {
          return <Loading key={idx} />;
        }
        if (errMsg) {
          return <Error errMsg={errMsg} key={idx} />;
        }
        return (
          featuredItem && (
            <>
              <Col key={idx}>
                {" "}
                <a href={`${link}`} target="_blank" rel="noreferrer">
                  <button>
                    <h1>
                      {icon}
                      {title}
                    </h1>
                    <h2>{subtitle}</h2>
                    <AnimatedDisplayCard item={featuredItem} title={title} />
                  </button>
                </a>
              </Col>
            </>
          )
        );
      })}
    </Row>
  );
};

export default DisplayList;
