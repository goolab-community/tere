import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  edit: null,
  load: null,
};

export const nessesary = createSlice({
  name: "nessesary",
  initialState: initialState,
  reducers: {
    editStateAction: (state, action) => {
      state.edit = action.payload.bool;
    },
    loadStateAction: (state, action) => {
      state.load = action.payload.bool;
    },
  },
});

export const { editStateAction, loadStateAction } = nessesary.actions;

export default nessesary.reducer;
