import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  edit: null,
};

export const nessesary = createSlice({
  name: "nessesary",
  initialState: initialState,
  reducers: {
    editStateAction: (state, action) => {
      state.edit = action.payload.bool;
    },
  },
});

export const { editStateAction } = nessesary.actions;

export default nessesary.reducer;
