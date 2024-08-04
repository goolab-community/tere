import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    latitude: null,
    longitude: null,
  },
];
// const initialState = [
//   {
//     AllMarkerLocation: [],
//   },
// ];

export const markers = createSlice({
  name: "markers",
  initialState: initialState,
  reducers: {
    update_markers: (state, action) => {
      return [...state, action.payload];
    },
  },
});

export const { update_markers } = markers.actions;

export default markers.reducer;
