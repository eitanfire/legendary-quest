import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { RANTS } from "../../app/shared/RANTS";
import { db } from "../../app/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { mapImageURL } from "../../utils/mapImageURL";

export const fetchRants = createAsyncThunk(
  "rants/fetchRants", 
  async () => {
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
    icon: "🖇️ ",
    title: "Learn League",
    subtitle: "The best teachers are forever students. Stay on the cutting edge of best practices.",
    link: "https://twitter.com/EitanFire/status/651521850095235072?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E651521850095235072%7Ctwgr%5Ec7b20ce67f4bdb366b65a0d5d1193d75b9ce4762%7Ctwcon%5Es1_c10&ref_url=https%3A%2F%2Fpublish.twitter.com%2F%3Fquery%3Dhttps3A2F2Ftwitter.com2FEitanFire2Fstatus2F651521850095235072widget%3DTweet",
    featuredItem: state.rants.rantsArray.find((rant) => rant.featured),
    isLoading: state.rants.isLoading,
    errMsg: state.rants.errMsg,
  };
};
