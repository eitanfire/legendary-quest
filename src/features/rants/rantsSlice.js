import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { RANTS } from "../../app/shared/RANTS";
import { baseUrl } from "../../app/shared/baseUrl";
import { mapImageURL } from "../../utils/mapImageURL";

export const fetchRants = createAsyncThunk("rants/fetchRants", async () => {
  const response = await fetch(baseUrl + "rants");
  if (!response.ok) {
    return Promise.reject("Unable to fetch, status: " + response.status);
  }
  const data = await response.json();
  return data;
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
    title: "The Rant",
    featuredItem: state.rants.rantsArray.find((rant) => rant.featured),
    isLoading: state.rants.isLoading,
    errMsg: state.rants.errMsg,
  };
};
