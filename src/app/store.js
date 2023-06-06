import { configureStore } from '@reduxjs/toolkit';
import { coursesReducer } from '../features/courses/coursesSlice';
import { takesReducer } from '../features/takes/takesSlice';
import { rantsReducer } from '../features/rants/rantsSlice';
import { commentsReducer } from '../features/comments/commentsSlice';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    takes: takesReducer,
    rants: rantsReducer,
    comments: commentsReducer
  },
});
