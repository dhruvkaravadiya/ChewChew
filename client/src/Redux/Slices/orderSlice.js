import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";
import { STRIPE_Publishable_key } from "../../../config";
import { loadStripe } from "@stripe/stripe-js";

const initialState = {
  currentOrders: [],
  pastOrders: [],
  preparedOrders: [],
  AllPrepredOrders: [],
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
    toast.success(res?.data?.message, { id: loadingMessage });
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

    toast.success("past orders", { id: loadingMessage });
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

export const getAllPrepredOrdersBydmId = createAsyncThunk(
  "/PrepredOrders",
  async (deliveryManId) => {
    console.log("getAllPrepredOrdersBydmId");
    const loadingMessage = toast.loading("Wait getting prepred orders...!");
    try {
      const res = await axiosInstance.get(
        `/order/currentOrders/${deliveryManId}`
      );
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    NewCurrentOrder: (state, action) => {
      console.log("action payload", action.payload);
      state.currentOrders.push(action.payload);
    },
    removeFromPreOrder: (state, action) => {
      const orderId = action.payload;
      console.log(orderId);
      console.log("state.AllPrepredOrders", state.AllPrepredOrders);
      state.AllPrepredOrders = state?.AllPrepredOrders?.filter((order) => {
        return order._id !== orderId;
      });
      console.log(AllPrepredOrders);
    },
    removeFromCurrentOrder: (state, action) => {
      const orderId = action.payload;
      console.log("action.payload", action.payload);
      console.log("state.cuurrentOrders", state.currentOrders);
      state.currentOrders = state?.currentOrders?.filter((order) => {
        return order._id !== orderId;
      });
      console.log("state.cuurrentOrders after loop", state.currentOrders);
    },
    pushOrderToAllPrepredOrders: (state, action) => {
      state?.AllPrepredOrders?.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentOrders.fulfilled, (state, action) => {
        state.currentOrders = action?.payload?.data;
      })
      .addCase(getCurrentOrders.rejected, (state, action) => {
        state.currentOrders = [];
      })
      .addCase(getPreparedOrders.fulfilled, (state, action) => {
        state.preparedOrders = action.payload.data;
      })
      .addCase(getPastOrders.fulfilled, (state, action) => {
        state.pastOrders = action?.payload?.data;
      })
      .addCase(getAllPrepredOrdersBydmId.fulfilled, (state, action) => {
        state.AllPrepredOrders = action?.payload?.data;
      });
  },
});

export const {
  NewCurrentOrder,
  removeFromPreOrder,
  removeFromCurrentOrder,
  pushOrderToAllPrepredOrders,
  setIsLoading,
} = orderSlice.actions;

export default orderSlice.reducer;
