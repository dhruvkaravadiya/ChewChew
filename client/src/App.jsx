import React, { useEffect, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
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
import RestaurantDetails from "./Pages/Restaurant/RestaurantDetails";
import Cart from "./Pages/User/Cart";
import AboutUs from "./Pages/AboutUs";
import PaymentSuccess from "./Pages/Payment/PaymentSuccess";
import PaymentFail from "./Pages/Payment/PaymentFail";
import MyOrder from "./Pages/User/MyOrder";

import { io } from "socket.io-client";
import SelectRestarant from "./Pages/Restaurant/SelectRestarant";
export const socket = io("http://localhost:8080/");

const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id, "connected");
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route path="/restaurant" element={<RestaurantList />} />
        <Route path="/restaurant/details" element={<RestaurantDetails />} />
        <Route path="/cart" element={<Cart />} />

        <Route element={<RequireAuth allowedRoles={["Customer"]} />}>
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
        </Route>

        <Route
          element={
            <RequireAuth
              allowedRoles={["Restaurant", "DeliveryMan", "Customer"]}
            />
          }
        >
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myorder" element={<MyOrder />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Restaurant"]} />}>
          <Route path="/create/Restaurant" element={<CreateRestaurant />} />
        </Route>

        {/* <Route element={<RequireAuth allowedRoles={[""]} />}> */}
        <Route path="/select/Restaurants" element={<SelectRestarant />} />
        {/* </Route> */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
