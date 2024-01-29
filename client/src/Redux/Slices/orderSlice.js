import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";
import { STRIPE_Publishable_key } from "../../../config";
import { loadStripe } from "@stripe/stripe-js";
import { Socket } from "socket.io-client";

const initialState = {
  currentOrders: [],
  pastOrders: [],
  preparedOrders: [],
  deliveryHistory: [],
};

export const placeorder = createAsyncThunk(
  "/placeorder",
  async ([resId, cartItems]) => {
    const loadingMessage = toast.loading("Please wait! Placing your order...");
    try {
      const stripe = await loadStripe(STRIPE_Publishable_key);

      const session = await axiosInstance.post(`/order/placeorder/${resId}`, {
        items: cartItems,
      });

      const result = await stripe.redirectToCheckout({
        sessionId: session.data.data.paymentSessionId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const orderSuccess = createAsyncThunk(
  "/orderSuccess",
  async ([resId, session_id, cartItems]) => {
    const loadingMessage = toast.loading("Please wait! verifying Payment...");
    try {
      const res = await axiosInstance.post(
        `/order/handle-success-response/${resId}?sessionId=${session_id}`,
        {
          items: cartItems,
        }
      );
      toast.success(res.data.message, {
        id: loadingMessage,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const changePaymentStatus = createAsyncThunk(
  "/paymentStatus",
  async (orderID) => {
    const loadingMessage = toast.loading(
      "Please wait! changing payment status..."
    );
    try {
      const res = await axiosInstance.put(
        `/order/handle-payment-response/${orderID}`
      );
      console.log("res", res);
      toast.success("payment status", { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const getCurrentOrders = createAsyncThunk("/currentOrder", async () => {
  const loadingMessage = toast.loading(
    "Please wait! fetching your current orders..."
  );
  try {
    const res = await axiosInstance.get("/order/current");
    toast.success("current orders", { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error, { id: loadingMessage });
    throw error;
  }
});

export const getPastOrders = createAsyncThunk("/pastOrders", async () => {
  const loadingMessage = toast.loading(
    "Please wait! fetching your past orders..."
  );
  try {
    const res = await axiosInstance.get("/order/past");
    toast.success("current orders", { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error, { id: loadingMessage });
    throw error;
  }
});

export const updateOrderStatus = createAsyncThunk(
  "/update/orderStatus",
  async ([orderId, orderStatus]) => {
    const loadingMessage = toast.loading(
      "Please wait! updating order status..."
    );
    try {
      const res = await axiosInstance.put(`/order/update/${orderId}`, {
        orderStatus: orderStatus,
      });
      toast.success("order status updated done", { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const getPreparedOrders = createAsyncThunk(
  "/preparedOrder",
  async () => {
    const loadingMessage = toast.loading(
      "Please wait! fetching your prepared Orders..."
    );
    try {
      const res = await axiosInstance.get("/order/prepared");
      toast.success("prepared orders", { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const pickOrder = createAsyncThunk("/pickOrder", async (orderId) => {
  const loadingMessage = toast.loading("Please wait! pickOrder...");
  try {
    console.log("orderId", orderId);
    const res = await axiosInstance.put(`/order/pick/${orderId}`);
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error, { id: loadingMessage });
    throw error;
  }
});

export const completeOrder = createAsyncThunk(
  "/completeOrder",
  async ([orderId, OTP]) => {
    const loadingMessage = toast.loading("Please wait! ...");
    try {
      const res = await axiosInstance.put(`/order/verify/${orderId}`, { OTP });
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const cancelOrder = createAsyncThunk("/cancelOrder", async (orderId) => {
  const loadingMessage = toast.loading("Please wait! ...");
  try {
    const res = await axiosInstance.put(`/order/cancel/${orderId}`);
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error, { id: loadingMessage });
    throw error;
  }
});

export const getOrderDistance = createAsyncThunk(
  "/getOrderDistance",
  async () => {
    const loadingMessage = toast.loading("Please wait! ...");
    try {
      const res = await axiosInstance.get(`/order/location`);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    NewCurrentOrder: (state, action) => {
      console.log("action payload", action.payload);
      state.currentOrders.push(action.payload.data);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentOrders.fulfilled, (state, action) => {
        console.log("payload", action.payload);
        state.currentOrders = action.payload.data;
      })
      .addCase(getCurrentOrders.rejected, (state, action) => {
        state.currentOrders = [];
      })
      .addCase(getPreparedOrders.fulfilled, (state, action) => {
        state.preparedOrders = action.payload.data;
      });
  },
});

export const { NewCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
