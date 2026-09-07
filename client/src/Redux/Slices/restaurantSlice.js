import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  restaurantData: null,
  filteredRestaurant: [],
  menuItems: [],
  restaurants: []
};

export const getAllRestaurants = createAsyncThunk(
  "/restaurant/get",
  async () => {
    const loadingMessage = toast.loading("Fetching restaurants...");
    try {
      const res = await axiosInstance.get("/restaurants");
      toast.success("All restaurants", { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const getRestaurantByResId = createAsyncThunk(
  "/restaurant/:id",
  async (resId) => {
    const loadingMessage = toast.loading("Fetching restaurant...");
    try {
      const res = await axiosInstance.get(`/restaurants/find/${resId}`);
      toast.success("Restaurant found", { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const createRestaurant = createAsyncThunk(
  "/create/restaurant",
  async (formData) => {
    const loadingMessage = toast.loading("Adding new restaurant...");
    try {
      const res = await axiosInstance.post("/restaurants/create", formData);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  "/delete/restaurant",
  async (resId) => {
    const loadingMessage = toast.loading("Deleting restaurant...");
    try {
      const res = await axiosInstance.delete(`/restaurants/delete/${resId}`);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  "/update/restaurant",
  async ([resId, formData]) => {
    const loadingMessage = toast.loading("Updating restaurant...");
    try {
      const res = await axiosInstance.put(`/restaurants/edit/${resId}`, formData);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const selectRestaurant = createAsyncThunk(
  "/select/restaurant",
  async (resId) => {
    const loadingMessage = toast.loading("Loading restaurant details...");
    try {
      const res = await axiosInstance.get(`/restaurants/find/${resId}`);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const addMenuItem = createAsyncThunk(
  "/add/menuItem",
  async (formData) => {
    const loadingMessage = toast.loading("Adding menu item...");
    try {
      const res = await axiosInstance.post(`/restaurants/menu/add`, formData);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const fetchMenuItems = createAsyncThunk(
  "/fetch/menuItems",
  async (resId) => {
    const loadingMessage = toast.loading("Fetching menu items...");
    try {
      const res = await axiosInstance.get(`/restaurants/menu/items/${resId}`);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  "/update/menuItem",
  async ([id, formData]) => {
    const loadingMessage = toast.loading("Updating menu item...");
    try {
      const res = await axiosInstance.put(`/restaurants/menu/update/${id}`, formData);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  "/delete/menuItem",
  async (data) => {
    const loadingMessage = toast.loading("Deleting menu item...");
    try {
      const res = await axiosInstance.delete(`/restaurants/menu/delete/${data.itemId}`);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

export const getRestaurantByUserId = createAsyncThunk(
  "/restaurant/find/user/:id",
  async (userId) => {
    const loadingMessage = toast.loading("Fetching restaurant...");
    try {
      const res = await axiosInstance.get(`/restaurants/find/user/${userId}`);
      toast.success("Restaurant found", { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
    }
  }
);

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    searchRestaurant: (state, action) => {
      const searchText = action.payload;
      state.filteredRestaurant = (state.restaurants || []).filter((res) => {
        return (
          res?.restaurantName?.toLowerCase().includes(searchText) ||
          res?.cuisines?.some((cuisine) =>
            cuisine?.toLowerCase().includes(searchText)
          )
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllRestaurants.fulfilled, (state, action) => {
        state.restaurants = action?.payload?.data || [];
      })
      .addCase(getAllRestaurants.rejected, (state) => {
        state.restaurants = [];
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.menuItems = action?.payload?.data || [];
      })
      .addCase(fetchMenuItems.rejected, (state) => {
        state.menuItems = [];
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        if (action?.payload?.newItem) {
          state.menuItems = [...(state.menuItems || []), action.payload.newItem];
        }
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.menuItems = (state.menuItems || []).filter(
          (item) => item._id !== action?.meta?.arg?.itemId
        );
      })
      .addCase(getRestaurantByUserId.fulfilled, (state, action) => {
        state.restaurantData = action?.payload?.data || null;
      })
      .addCase(getRestaurantByResId.fulfilled, (state, action) => {
        state.restaurantData = action?.payload?.data || null;
      })
      // ✅ KEY FIX — update restaurantData in state after edit
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        if (action?.payload?.data) {
          state.restaurantData = action.payload.data;
        }
      });
  },
});

export const { searchRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;