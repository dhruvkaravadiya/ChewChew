import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  restaurantData: [],
  selectedRestaurant: null,
};

export const getAllRestaurants = createAsyncThunk(
  "/restaurant/get",
  async () => {
    const loadingMessage = toast.loading("fetching restaurants! ...");
    try {
      const res = await axiosInstance.get("/restaurants");
      toast.success("All restaurants", { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const createRestaurant = createAsyncThunk(
  "/create/restaurant",
  async (formData) => {
    const loadingMessage = toast.loading("Wait! Adding New restaurant! ...");
    try {
      const res = await axiosInstance.post("/restaurants/create", formData);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  "/delete/restaurant",
  async (resId) => {
    const loadingMessage = toast.loading("Wait Deleting restaurant! ...");
    try {
      const res = await axiosInstance.delete(`/restaurants/delete/${resId}`);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  "/update/restaurant",
  async ([resId, formData]) => {
    const loadingMessage = toast.loading("Wait updating restaurant! ...");
    try {
      const res = await axiosInstance.put(
        `/restaurants/edit/${resId}`,
        formData
      );
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const selectRestaurant = createAsyncThunk(
  "/select/restaurant",
  async (resId) => {
    const loadingMessage = toast.loading("Wait loading restaurant Details!");
    try {
      const res = await axiosInstance.get(`/restaurants/find/${resId}`);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const addMenuItem = createAsyncThunk(
  "/add/menuItem",
  async (formData) => {
    const loadingMessage = toast.loading("Wait Adding MenuItem...!");
    try {
      const res = await axiosInstance.post(`/restaurants/menu/add`, formData);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  "/update/menuItem",
  async ([id, formData]) => {
    const loadingMessage = toast.loading("Wait updating MenuItem...!");
    try {
      const res = await axiosInstance.put(
        `/restaurants/menu/update/${id}`,
        formData
      );
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

export const DeleteMenuItem = createAsyncThunk(
  "/delete/menuItem",
  async ([id, formData]) => {
    const loadingMessage = toast.loading("Wait deleting MenuItem...!");
    try {
      const res = await axiosInstance.delete(`/restaurants/menu/delete/${id}`);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.message, { id: loadingMessage });
    }
  }
);

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllRestaurants.fulfilled, (state, action) => {
      state.restaurantData = action?.payload.data;
    });
  },
});

export default restaurantSlice.reducer;
