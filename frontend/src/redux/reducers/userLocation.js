import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // lat: 41.799188,
  // lon: 44.797391,

  lat: localStorage.getItem("lat") || "something wrong",
  lon: localStorage.getItem("lon") || "wrong",
  defaultZoom: 7.5,
};

export const user_location = createSlice({
  name: "user_location",
  initialState: initialState,
  reducers: {
    editLocationStateAction: (state, action) => {
      state.lat = action.payload.lat;
      state.lon = action.payload.lon;
      state.defaultZoom = action.payload.defaultZoom;
    },
  },
});

export const { editLocationStateAction } = user_location.actions;

export default user_location.reducer;
