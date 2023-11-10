import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../app/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { mapImageURL } from "../../utils/mapImageURL";

export const fetchvideos = createAsyncThunk(
  "videos/fetchvideos",
  async () => {
    const querySnapshot = await getDocs(collection(db, "videos"));
    const videos = [];
    querySnapshot.forEach((doc) => {
      videos.push(doc.data());
    });

    return videos;
  }
);

const initialState = {
  videosArray: [],
  isLoading: true,
  errMsg: "",
};

const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchvideos.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchvideos.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.errMsg = "";
      state.videosArray = mapImageURL(action.payload);
    },
    [fetchvideos.rejected]: (state, action) => {
      state.isLoading = false;
      state.errMsg = action.error ? action.error.message : "Fetch failed";
    },
  },
});

export const videosReducer = videosSlice.reducer;

export const selectAllvideos = (state) => {
  return state.videos.videosArray;
};

export const selectRandomVideo = (state) => {
  return state.videos.videosArray[
    Math.floor(fetchvideos.length * Math.random())
  ];
};

export const selectVideoById = (id) => (state) => {
  return state.videos.videosArray.find(
    (video) => video.id === parseInt(id)
  );
};

export const selectFeaturedVideo = (state) => {
  return {
    // title: "Featured video",
    featuredItem: state.videos.videosArray.find((video) => video.featured),
    isLoading: state.videos.isLoading,
    errMsg: state.videos.errMsg,
  };
};
