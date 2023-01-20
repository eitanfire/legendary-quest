import { COURSES } from "../../app/shared/COURSES";

export const selectAllCourses = () => {
  return COURSES;
};

// export const selectRandomCourse = () => {
//     return COURSES[Math.floor(COURSES.length * Math.random())];
// };

export const selectCourseById = (id) => {
  return COURSES.find((course) => course.id === id);
};