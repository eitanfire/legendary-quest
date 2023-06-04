import { createSlice } from "@reduxjs/toolkit";
import { COURSES } from "../../app/shared/COURSES";

const initialState = {
  coursesArray: COURSES,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
});

export const coursesReducer = coursesSlice.reducer;

export const selectAllCourses = (state) => {
  return state.courses.coursesArray;
};

export const selectRandomCourse = (state) => {
  return state.courses.coursesArray[Math.floor(COURSES.length * Math.random())];
};

export const selectCourseById = (id) => (state) => {
  return state.courses.coursesArray.find(
    (course) => course.id === parseInt(id)
  );
};

export const selectFeaturedCourse = (state) => {
  return state.courses.coursesArray.find((course) => course.featured);
};

export const shortSelectFeaturedCourse = (state) => {
  return selectFeaturedCourse.slice(0, 20);
};

export const selectFreeCourse = (state) => {
  return state.courses.coursesArray.find((course) => course.free);
};
