import CoursesList from "../../src/features/courses/CoursesList";
import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";

const coursePerRow = 4;
export const CourseGallery = ({ CourseGallery }) => {
  const [next, setNext] = useState(coursePerRow);
  const handleMoreCourse = () => {
    setNext(next + coursePerRow);
  };
  return (
    <>
      <div className="gap-y-4 flex flex-wrap justify-center">
        {CourseGallery?.slice(0, next)?.map((image, index) => {
          return (
            <div key={index} className="px-2.5 md:px-0">
              <img className="cursor-pointer" src={image?.url} />
            </div>
          );
        })}
        {next < CourseGallery?.length && (
          <Button className="mt-4" onClick={handleMoreCourse}>
            Load more
          </Button>
        )}
      </div>
    </>
  );
};
