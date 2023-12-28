import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../app/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { mapImageURL } from "../../utils/mapImageURL";

export const fetchTakes = createAsyncThunk("takes/fetchTakes", async () => {
  const querySnapshot = await getDocs(collection(db, "takes"));
  const takes = [];
  querySnapshot.forEach((doc) => {
    takes.push(doc.data());
  });

  return takes;
});

const initialState = {
  takesArray: [],
  isLoading: true,
  errMsg: "",
};

const takesSlice = createSlice({
  name: "takes",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchTakes.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchTakes.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errMsg = "";
      state.takesArray = mapImageURL(action.payload);
    },
    [fetchTakes.rejected]: (state, action) => {
      state.isLoading = false;
      state.errMsg = action.error ? action.error.message : "Fetch Failed";
    },
  },
});

export const takesReducer = takesSlice.reducer;

export const selectAllTakes = (state) => {
  return state.takes.takesArray;
};

export const selectFeaturedTake = (state) => {
  return {
    icon: "🔥 ",
    title: "Hot Take",
    subtitle: "Get a fresh perspective from the cutting edge.",
    link: "http://localhost:3000/takes",
    featuredItem: state.takes.takesArray.find((take) => take.featured),
    isLoading: state.takes.isLoading,
    errMsg: state.takes.errMsg,
  };
};
