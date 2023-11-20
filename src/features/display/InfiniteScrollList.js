import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import AnimatedDisplayCard from "./AnimatedDisplayCard";
import {
  fetchCourses,
  selectRandomCourse,
} from "../courses/coursesSlice";
import {
  fetchTakes,
  selectFeaturedTake,
} from "../takes/takesSlice";
import {
  fetchRants,
  selectFeaturedRant,
} from "../rants/rantsSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";

const postPerRow = 4;

function InfiniteScrollList() {
  const [next, setNext] = useState(postPerRow);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = (pageNum) => {
    dispatch(fetchCourses(pageNum));
    dispatch(fetchTakes(pageNum));
    dispatch(fetchRants(pageNum));
  };

  const items = useSelector((state) => [
    selectFeaturedTake(state),
    selectFeaturedRant(state),
    selectRandomCourse(state),
  ]);

  const handleMorePosts = () => {
    setNext(next + postPerRow);
  };

  return (
    <div>
      <Row>
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
                <Col md className="m-1" key={idx}>
                  <h3>
                    {icon}
                    {title}
                  </h3>
                  <AnimatedDisplayCard item={featuredItem} title={title} />
                </Col>
              </>
            )
          );
        })}
      </Row>

      {items.map((course, idx) => {
        if (!course) {
          return null;
        }

        if (course.isLoading) {
          return <Loading key={idx} />;
        }
        if (course.errMsg) {
          return <Error errMsg={course.errMsg} key={idx} />;
        }
        return null;
      })}
      {next < items.length && (
        <Button className="mt-4" onClick={handleMorePosts}>
          Load more
        </Button>
      )}
    </div>
  );
}

export default InfiniteScrollList;
