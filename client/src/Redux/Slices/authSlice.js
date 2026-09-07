import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const getInitialAuthState = () => {
    try {
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const storedRole = localStorage.getItem("role") || "";
        const storedData = localStorage.getItem("data");
        let parsedData = {};
        if (storedData && storedData !== "undefined" && storedData !== "null") {
            parsedData = JSON.parse(storedData);
        }
        return {
            isLoggedIn: storedIsLoggedIn,
            role: storedRole,
            data: parsedData,
        };
    } catch {
        return {
            isLoggedIn: false,
            role: "",
            data: {},
        };
    }
};

const initialState = getInitialAuthState();

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
        const loadingMessage = toast.loading(
            "Please wait! sending an email..."
        );
        try {
            const res = await axiosInstance.post("/auth/forgotpassword", {
                email,
            });
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

export const getProfile = createAsyncThunk(
    "/auth/user/profile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/auth/user");
            return res?.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || error?.message);
        }
    }
);

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
    reducers: {
        clearAuth: (state) => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("role");
            localStorage.removeItem("data");
            localStorage.removeItem("__session");
            sessionStorage.removeItem("__session");
            state.isLoggedIn = false;
            state.role = "";
            state.data = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createUserAccount.fulfilled, (state, action) => {
                const user = action?.payload?.user;
                const token = action?.payload?.token;
                if (token) {
                    localStorage.setItem("__session", token);
                }
                if (user) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("role", user?.role || "Customer");
                    localStorage.setItem("data", JSON.stringify(user));
                    state.isLoggedIn = true;
                    state.role = user?.role || "Customer";
                    state.data = user;
                }
            })
            .addCase(login.fulfilled, (state, action) => {
                const user = action?.payload?.data;
                const token = action?.payload?.token;
                if (token) {
                    localStorage.setItem("__session", token);
                }
                if (user) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("role", user?.role || "Customer");
                    localStorage.setItem("data", JSON.stringify(user));
                    state.isLoggedIn = true;
                    state.role = user?.role || "Customer";
                    state.data = user;
                }
            })
            .addCase(logout.fulfilled, (state) => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("role");
                localStorage.removeItem("data");
                localStorage.removeItem("__session");
                sessionStorage.removeItem("__session");
                state.isLoggedIn = false;
                state.role = "";
                state.data = {};
            })
            .addCase(logout.rejected, (state) => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("role");
                localStorage.removeItem("data");
                localStorage.removeItem("__session");
                sessionStorage.removeItem("__session");
                state.isLoggedIn = false;
                state.role = "";
                state.data = {};
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                const user = action?.payload?.data;
                if (user) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("role", user?.role || "");
                    localStorage.setItem("data", JSON.stringify(user));
                    state.isLoggedIn = true;
                    state.role = user?.role || "";
                    state.data = user;
                }
            })
            .addCase(getProfile.rejected, (state) => {
                // Session expired or invalid on server - clear stale auth
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("role");
                localStorage.removeItem("data");
                localStorage.removeItem("__session");
                sessionStorage.removeItem("__session");
                state.isLoggedIn = false;
                state.role = "";
                state.data = {};
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                const user = action?.payload?.data;
                if (user) {
                    localStorage.setItem("data", JSON.stringify(user));
                    state.data = user;
                }
            })
            .addCase(createDeliveryMan.fulfilled, (state) => {
                localStorage.setItem("role", "DeliveryMan");
                state.role = "DeliveryMan";
                if (state.data) {
                    state.data.role = "DeliveryMan";
                    localStorage.setItem("data", JSON.stringify(state.data));
                }
            });
    },
});

export const { clearAuth } = authSlice.actions;

export default authSlice.reducer;
