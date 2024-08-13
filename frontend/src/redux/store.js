import { combineReducers, configureStore } from "@reduxjs/toolkit";

import user from "./reducers/user";
import animals from "./reducers/animals";
import markers from "./reducers/markers";
import nessesaryState from "./reducers/nessesaryState";
import userLocation from "./reducers/userLocation";
const allReducers = combineReducers({
  user: user,
  animals: animals,
  markers: markers,
  nessesary: nessesaryState,
  user_location: userLocation,
});

const store = configureStore({
  reducer: allReducers,
});

export default store;
