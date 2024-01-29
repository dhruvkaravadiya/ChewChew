import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Slices/authSlice.js";
import restaurantSlice from "./Slices/restaurantSlice.js";
import cartSlice from "./Slices/cartSlice.js";
import orderSlice from "./Slices/orderSlice.js";

const store = configureStore({
  reducer: {
    auth: AuthSlice,
    restaurant: restaurantSlice,
    cart: cartSlice,
    order: orderSlice,
  },
  devTools: true,
});

export default store;
