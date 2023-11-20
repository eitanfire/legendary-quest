import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../app/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { mapImageURL } from "../../utils/mapImageURL";

export const fetchRants = createAsyncThunk("rants/fetchRants", async () => {
  const querySnapshot = await getDocs(collection(db, "rants"));
  const rants = [];
  querySnapshot.forEach((doc) => {
    rants.push(doc.data());
  });

  return rants;
});

const initialState = {
  rantsArray: [],
  isLoading: true,
  errMsg: "",
};

const rantsSlice = createSlice({
  name: "rants",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchRants.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchRants.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errMsg = "";
      state.rantsArray = mapImageURL(action.payload);
    },
    [fetchRants.rejected]: (state, action) => {
      state.isLoading = false;
      state.errMsg = action.error ? action.error.message : "Fetch Failed";
    },
  },
});

export const rantsReducer = rantsSlice.reducer;

export const selectAllRants = (state) => {
  return state.rants.rantsArray;
};

export const selectFeaturedRant = (state) => {
  return {
    icon: "📢 ",
    title: "Rant",
    subtitle: "Find comraderie and collaboration.",
    link: "https://www.reddit.com/r/Teachers/",
    featuredItem: state.rants.rantsArray.find((rant) => rant.featured),
    isLoading: state.rants.isLoading,
    errMsg: state.rants.errMsg,
  };
};
