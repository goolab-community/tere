import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // lat: 41.92157741866657 || localStorage.getItem("lat"),
  // lon: 45.47760172158832 || localStorage.getItem("lon"),
  lat: 41.92157741866657,
  lon: 45.47760172158832,
  // lat: null,
  // lon: null,
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
