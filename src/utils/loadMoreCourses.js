import CoursesList from "../features/courses/CoursesList";
import React, { useState } from "react";
import { Button } from "reactstrap";
import { COURSES } from "../app/shared/COURSES";
import CourseCard from "../features/courses/CourseCard";
import { Col, Row } from "reactstrap";
// import { useSelector } from "react-redux";
// import { selectAllCourses } from "../features/courses/coursesSlice";


const coursePerRow = 4;
 const LoadMoreCourses = ({ courses }) => {
   const [next, setNext] = useState(coursePerRow);
   // const courses = useSelector(selectAllCourses);

   const handleMoreCourse = () => {
     setNext(next + coursePerRow);
   };
   return (
     <>
       <div className="gap-y-4 flex flex-wrap justify-center">
         {COURSES?.slice(0, next)?.map((course, id) => {
           {
             /* return (
            <div key={index} className="px-2.5 md:px-0">
              <img className="cursor-pointer" src={course?.id} />
            </div>
          );
        })} */
             return (
               <Row className="ms-auto">
                 <Col md="5" className="m-4" key={course.id}>
                   <CourseCard course={course} />
                 </Col>
               </Row>
             );
           }
         })}
         <div>
           {next < COURSES?.length && (
             <Button className="mt-4" onClick={handleMoreCourse}>
               Load more
             </Button>
           )}
         </div>
       </div>
     </>
   );
 };

export default LoadMoreCourses;