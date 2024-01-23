import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: JSON.parse(localStorage.getItem("cart")) || [],
  totalBill: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      console.log("action payload", action.payload);
      state.cartItems.push({
        ...action.payload,
        Id: action.payload._id,
        quantity: 1,
      });
    },
    removeItem(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    },
    updateQuantity: (state, action) => {
      const { itemId, newQuantity } = action.payload;
      if (newQuantity != 0) {
        state.cartItems = state.cartItems.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        );
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    calculateTotalBill: (state, action) => {
      if (state.cartItems != []) {
        state.totalBill = state?.cartItems?.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalBill = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addItem,
  removeItem,
  clearCart,
  updateQuantity,
  calculateTotalBill,
} = cartSlice.actions;

export default cartSlice.reducer;
