import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../app/firebase.config";
import { collection, getDocs } from "firebase/firestore";

export const fetchComments = createAsyncThunk(
  "coments/fetchComments",
  async () => {
    const querySnapshot = await getDocs(collection(db, "comments"));
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push(doc.data());
    });

    return comments;
  }
);
// export const postComment = createAsyncThunk(
//   "comments/postComment",
//   async (comment, { dispatch }) => {
//     const response = await fetch(baseUrl + "comments", {
//       method: "POST",
//       body: JSON.stringify(comment),
//       headers: { "Content-Type": "application/json" },
//     });
//     if (!response.ok) {
//       return Promise.reject(response.status);
//     }
//     const data = await response.json();
//     dispatch(addComment(data));
//   }
// );

const initialState = {
  commentsArray: [],
  isLoading: true,
  errMsg: "",
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action) => {
      console.log("addComment action.payload:", action.payload);
      console.log("addComment state.commentsArray:", state.commentsArray);
      const newComment = {
        id: state.commentsArray.length + 1,
        ...action.payload,
      };
      state.commentsArray.push(newComment);
    },
  },
  extraReducers: {
    [fetchComments.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errMsg = "";
      state.commentsArray = action.payload;
    },

    [fetchComments.rejected]: (state, action) => {
      state.isLoading = false;
      state.errMsg = action.error ? action.error.message : "Fetch Failed";
    },
    // [postComment.rejected]: (state, action) => {
    //   // state.isLoading = false;
    //   state.errMsg = action.error ? action.error.message : "Fetch Failed";
    //   alert(
    //     "Your comment could not be posted\nError: " +
    //       (action.error ? action.error.message : "Fetch failed")
    //   );
    // },
  },
});

export const commentsReducer = commentsSlice.reducer;

export const { addComment } = commentsSlice.actions;

export const selectCommentsByCourseId = (courseId) => (state) => {
  return state.comments.commentsArray.filter(
    (comment) => comment.courseId === parseInt(courseId)
  );
};
