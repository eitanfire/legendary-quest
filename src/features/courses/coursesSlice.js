import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../app/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { mapImageURL } from "../../utils/mapImageURL";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push(doc.data());
    });

    return courses;
  }
);

const initialState = {
  coursesArray: [],
  isLoading: true,
  errMsg: "",
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCourses.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchCourses.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errMsg = "";
      state.coursesArray = mapImageURL(action.payload);
    },
    [fetchCourses.rejected]: (state, action) => {
      state.isLoading = false;
      state.errMsg = action.error ? action.error.message : "Fetch failed";
    },
  },
});

export const coursesReducer = coursesSlice.reducer;

export const selectAllCourses = (state) => {
  return state.courses.coursesArray;
};

export const selectRandomCourse = (state) => {
  return state.courses.coursesArray[
    Math.floor(fetchCourses.length * Math.random())
  ];
};

export const selectCourseById = (id) => (state) => {
  return state.courses.coursesArray.find(
    (course) => course.id === parseInt(id)
  );
};

export const selectFeaturedCourse = (state) => {
  return {
    icon: "📓 ",
    title: "Resources",
    subtitle:
      "I'm a teacher. I get it. If you need help with your content I've got you so you don’t lose it.",
    link: "http://localhost:3000/directory/",
    featuredItem: state.courses.coursesArray.find((course) => course.featured),
    isLoading: state.courses.isLoading,
    errMsg: state.courses.errMsg,
  };
};

export const selectFreeCourse = (state) => {
  return {
    freeItem: state.courses.coursesArray.find((course) => course.free),
    isLoading: state.courses.isLoading,
    errMsg: state.courses.errMsg,
  };
};

export const shortSelectFeaturedCourse = (state) => {
  return selectFeaturedCourse.slice(0, 20);
};
