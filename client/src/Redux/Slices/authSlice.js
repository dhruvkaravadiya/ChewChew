import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data:
    localStorage.getItem("data") !== undefined
      ? JSON.parse(localStorage.getItem("data"))
      : {},
};

export const createUserAccount = createAsyncThunk(
  "/auth/signup",
  async (data) => {
    const loadingMessage = toast.loading(
      "Please wait! Creating your account..."
    );
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success(res?.data?.message || res?.data?.error, {
        id: loadingMessage,
      });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const createDeliveryMan = createAsyncThunk(
  "/auth/DeliveryMan",
  async ({ phoneNumber, selectedRestaurants }) => {
    const loadingMessage = toast.loading(
      "Please wait! Creating DeliveryMan..."
    );
    console.log(phoneNumber);
    console.log(selectedRestaurants);

    try {
      const res = await axiosInstance.post("/deliveryman/create", {
        phoneNumber: phoneNumber,
        restaurants: selectedRestaurants,
      });
      toast.success(res?.data?.message || res?.data?.error, {
        id: loadingMessage,
      });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const createCustomer = createAsyncThunk("/auth/customer", async () => {
  const loadingMessage = toast.loading("Please wait! Creating Customer...");
  try {
    const res = await axiosInstance.post("/customer/create");
    toast.success(res?.data?.message || res?.data?.error, {
      id: loadingMessage,
    });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error, { id: loadingMessage });
    throw error;
  }
});

export const login = createAsyncThunk("/auth/login", async (data) => {
  const loadingMessage = toast.loading(
    "Please wait! authntication in Progress..."
  );
  try {
    const res = await axiosInstance.post("/auth/login", data);
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error, {
      id: loadingMessage,
    });
    throw error;
  }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  const loadingMessage = toast.loading("Please wait! logout in Progress...");
  try {
    const res = await axiosInstance.post("/auth/logout");
    toast.success(res?.data?.message, { id: loadingMessage });
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error, { id: loadingMessage });
    throw error;
  }
});

export const forgetPassword = createAsyncThunk(
  "/auth/forget-password",
  async (email) => {
    const loadingMessage = toast.loading("Please wait! sending an email...");
    try {
      const res = await axiosInstance.post("/auth/forgotpassword", { email });
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "/auth/reset-password",
  async (data) => {
    const loadingMessage = toast.loading("reseting Password ...");
    try {
      const res = await axiosInstance.put(
        `/auth/password/reset/${data.token}`,
        {
          password: data.password,
          confirmPassword: data.confirmPassword,
        }
      );
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const changePassword = createAsyncThunk(
  "/auth/change-password",
  async (data) => {
    const loadingMessage = toast.loading("changing Password ...");
    try {
      const res = await axiosInstance.put("/auth/password/update", {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

export const getProfile = createAsyncThunk("/auth/user/profile", async () => {
  try {
    const res = await axiosInstance.get("/auth/user");
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
    throw error;
  }
});

export const updateProfile = createAsyncThunk(
  "/auth/update/profile",
  async (data) => {
    const loadingMessage = toast.loading(
      "Please wait! updating your profile..."
    );
    try {
      const res = await axiosInstance.put("/auth/user/update", data);
      toast.success(res?.data?.message, { id: loadingMessage });
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.error, { id: loadingMessage });
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserAccount.fulfilled, (state, action) => {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        state.isLoggedIn = true;
        state.role = action?.payload?.user?.role;
        state.data = action?.payload?.user;
      })
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.data?.role);
        localStorage.setItem("data", JSON.stringify(action?.payload?.data));
        state.isLoggedIn = true;
        state.role = action?.payload?.data?.role;
        state.data = action?.payload?.data;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.role = "";
        state.data = {};
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.data?.role);
        localStorage.setItem("data", JSON.stringify(action?.payload?.data));
        state.isLoggedIn = true;
        state.role = action?.payload?.data?.role;
        state.data = action?.payload?.data;
      })
      .addCase(createDeliveryMan.fulfilled, (state, action) => {
        localStorage.setItem("role", "DeliveryMan");
        state.role = "DeliveryMan";
      });
  },
});

// export const {} = authSlice.actions;

export default authSlice.reducer;
