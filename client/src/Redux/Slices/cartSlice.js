import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.cartItems.push(action.payload);
    },
    removeItem(state, action) {
      console.log("action", action.payload);
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.clear();
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
