import { COURSES } from "../../app/shared/COURSES";

export const selectAllCourses = () => {
  return COURSES;
};

export const selectRandomCourse = () => {
    return COURSES[Math.floor(COURSES.length * Math.random())];
};

export const selectCourseById = (id) => {
  return COURSES.find((course) => course.id === parseInt(id));
};

export const selectFeaturedCourse = () => {
    return COURSES.find((course) => course.featured);
};

export const selectFreeCourse = () => {
  return COURSES.find((course) => course.free);
};

export const shortSelectFeaturedCourse = () => {
  return selectFeaturedCourse.slice(0,20);
};