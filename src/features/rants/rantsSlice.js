import { createSlice } from "@reduxjs/toolkit";
import { RANTS } from "../../app/shared/RANTS";

const initialState = {
  rantsArray: RANTS,
};

const rantsSlice = createSlice({
  name: "rants",
  initialState,
});

export const rantsReducer = rantsSlice.reducer;

export const selectAllRants = (state) => {
  return state.rants.rantsArray;
};

export const selectFeaturedRant = (state) => {
  return state.rants.rantsArray.find((rant) => rant.featured);
};
