import { combineReducers, configureStore } from "@reduxjs/toolkit";

import user from "./reducers/user";

const rootReducer = combineReducers({
  user: user,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
