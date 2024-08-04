import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    allAnimals: [],
  },
];

export const animals = createSlice({
  name: "animals",
  initialState: initialState,
  reducers: {
    loadanimals: (state, action) => {
      state[0].allAnimals = action.payload.allAnimals;
    },
    loadMoreAnimals: (state, action) => {
      state[0].allAnimals = action.payload.loadanimals;
    },
  },
});

export const { loadanimals, loadMoreAnimals } = animals.actions;

export default animals.reducer;
