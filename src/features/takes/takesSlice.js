import { createSlice } from "@reduxjs/toolkit";
import { TAKES } from "../../app/shared/TAKES";

const initialState = {
  takesArray: TAKES,
};

const takesSlice = createSlice({
  name: "takes",
  initialState,
});

export const takesReducer = takesSlice.reducer;

export const selectAllTakes = (state) => {
  return state.takes.takesArray;
};

export const selectFeaturedTake = (state) => {
  return state.takes.takesArray.find((take) => take.featured);
};
