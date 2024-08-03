import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: null,
  token: null,
};

export const user = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateUser: (state, action) => {
      state._id = action.payload._id;
      state.token = action.payload.token;
    },
  },
});

export const { updateUser } = user.actions;

export default user.reducer;
