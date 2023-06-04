import { configureStore } from '@reduxjs/toolkit';
import { coursesReducer } from '../features/courses/coursesSlice';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
  },
});
