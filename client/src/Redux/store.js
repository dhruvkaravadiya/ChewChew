import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Slices/authSlice.js";
import restaurantSlice from "./Slices/restaurantSlice.js";

const store = configureStore({
  reducer: {
    auth: AuthSlice,
    restaurant: restaurantSlice,
  },
  devTools: true,
});

export default store;
