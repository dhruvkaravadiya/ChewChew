import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "./Redux/Slices/authSlice.js";
import HomePage from "./Pages/HomePage";
import NotFoundPage from "./Pages/NotFoundPage";
import SignUp from "./Pages/User/SignUp";
import Login from "./Pages/User/Login";
import ForgotPassword from "./Pages/Password/ForgotPassword";
import ResetPassword from "./Pages/Password/ResetPassword";
import ChangePassword from "./Pages/Password/ChangePassword";
import Profile from "./Pages/User/Profile";
import RestaurantList from "./Pages/Restaurant/RestaurantList";
import RequireAuth from "./Components/Auth/RequireAuth";
import CreateRestaurant from "./Pages/Restaurant/CreateRestaurant";
import Cart from "./Pages/User/Cart";
import AboutUs from "./Pages/AboutUs";
import PaymentSuccess from "./Pages/Payment/PaymentSuccess";
import PaymentFail from "./Pages/Payment/PaymentFail";
import MyOrder from "./Pages/User/MyOrder";
import { io } from "socket.io-client";
import SelectRestarant from "./Pages/Restaurant/SelectRestarant";
import RestaurantDeliveryMan from "./Pages/Restaurant/RestaurantDeliveryMan";
import OrderTrackingPage from "./Components/Order/OrderDetailsCard";
import OrderMapPage from "./Components/Order/OrderMapPage";
import EditRestaurantDetails from "./Pages/Restaurant/EditRestaurantDetails";
import RestaurantDetails from "./Pages/Restaurant/RestaurantDetails";

export const socket = io("http://localhost:8000");

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, data } = useSelector((state) => state.auth);

  // Validate and sync user session on app mount
  useEffect(() => {
    const hasStoredAuth =
      localStorage.getItem("isLoggedIn") === "true" ||
      !!localStorage.getItem("__session") ||
      !!sessionStorage.getItem("__session");

    if (hasStoredAuth) {
      dispatch(getProfile());
    }
  }, [dispatch]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      // Join the user's personal room as soon as socket connects
      if (isLoggedIn && data?._id) {
        socket.emit("joinRoom", data._id);
        console.log("Joined room:", data._id);
      }
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  // Re-join room if user logs in after socket already connected
  useEffect(() => {
    if (isLoggedIn && data?._id) {
      socket.emit("joinRoom", data._id);
      console.log("Joined room:", data._id);
    }
  }, [isLoggedIn, data?._id]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/order-details/:orderId" element={<OrderTrackingPage />} />
        <Route path="/order-map/:orderId" element={<OrderMapPage />} />
        <Route path="/restaurant" element={<RestaurantList />} />
        <Route path="/restaurant-details/:resId" element={<RestaurantDetails />} />
        <Route path="/restaurant/details" element={<EditRestaurantDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<RequireAuth allowedRoles={["Customer"]} />}>
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["Restaurant", "DeliveryMan", "Customer"]} />}>
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myorder" element={<MyOrder />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["Restaurant"]} />}>
          <Route path="/create/Restaurant" element={<CreateRestaurant />} />
          <Route path="/restaurant/deliverymen" element={<RestaurantDeliveryMan />} />
        </Route>
        <Route path="/select/Restaurants" element={<SelectRestarant />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;