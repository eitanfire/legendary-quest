import React, { useState, useEffect } from "react";
import { Col, Row, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import AnimatedDisplayCard from "./AnimatedDisplayCard";
import {
  fetchCourses,
  selectAllCourses,
  selectFeaturedCourse,
  selectRandomCourse,
} from "../courses/coursesSlice";
import {
  fetchTakes,
  selectAllTakes,
  selectFeaturedTake,
  selectRandomTake,
} from "../takes/takesSlice";
import {
  fetchRants,
  selectAllRants,
  selectFeaturedRant,
  selectRandomRant,
} from "../rants/rantsSlice";
import Error from "../../components/Error";
import Loading from "../../components/Loading";
import CourseCard from "../courses/CourseCard";

const postPerRow = 4;

function InfiniteScrollList() {
  const [next, setNext] = useState(postPerRow);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchData(page);
  }, [page]);

  const fetchData = (pageNum) => {
    // You should dispatch actions to fetch courses, takes, and rants
    dispatch(fetchCourses(pageNum));
    dispatch(fetchTakes(pageNum));
    dispatch(fetchRants(pageNum));
  };

  // Use useSelector to get the courses, takes, and rants from Redux store
    const items = useSelector((state) => [
      selectFeaturedTake(state),
      selectFeaturedRant(state),
      // selectFeaturedCourse(state),
      selectRandomCourse(state),

      // const courses = useSelector(selectAllCourses);
      // const featuredCourse = useSelector(selectFeaturedCourse);
      // const randomCourse = useSelector(selectRandomCourse);

      // const takes = useSelector(selectAllTakes);
      // const featuredTake = useSelector(selectFeaturedTake);
      // const randomTake = useSelector(selectRandomTake);

      // const rants = useSelector(selectAllRants);
      // const featuredRant = useSelector(selectFeaturedRant);
      // const randomRant = useSelector(selectRandomRant);
    ]);

  const handleMorePosts = () => {
    setNext(next + postPerRow);
  };

  return (
    <div>
      {/* Render your list of items */}
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

      {/* Add a loading indicator if needed */}
      {items.map((course, idx) => {
        if (!course) {
          // Handle the case where 'course' is undefined
          return null;
        }

        if (course.isLoading) {
          return <Loading key={idx} />;
        }
        if (course.errMsg) {
          return <Error errMsg={course.errMsg} key={idx} />;
        }
        return null; // Return null if neither loading nor error
      })}

      {/* Add a "Load More" button or similar UI element */}
      {next < items.length && (
        <Button className="mt-4" onClick={handleMorePosts}>
          Load more
        </Button>
      )}
    </div>
  );
}

export default InfiniteScrollList;
