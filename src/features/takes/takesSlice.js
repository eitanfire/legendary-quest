import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { TAKES } from "../../app/shared/TAKES";
import { baseUrl } from "../../app/shared/baseUrl";
import { mapImageURL } from "../../utils/mapImageURL";

export const fetchTakes = createAsyncThunk("takes/fetchTakes", async () => {
  const response = await fetch(baseUrl + "takes");
  if (!response.ok) {
    return Promise.reject("Unable to fetch, status: " + response.status);
  }
  const data = await response.json();
  return data;
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
  return state.takes.takesArray.find((take) => take.featured);
};
