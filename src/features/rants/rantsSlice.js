import { createSlice } from "@reduxjs/toolkit";
import { RANTS } from "../../app/shared/RANTS";

const initialState = {
  rantsArray: RANTS,
};

const rantsSlice = createSlice({
  name: "takes",
  initialState,
});

export const rantsReducer = rantsSlice.reducer;

export const selectAllRants = (state) => {
  return state.rants.takesArray;
};

export const selectFeaturedRant = (state) => {
  return state.rants.takesArray.find((rant) => rant.featured);
};
