import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import NotFoundPage from "./Pages/NotFoundPage";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/Password/ForgotPassword";
import ResetPassword from "./Pages/Password/ResetPassword";
import ChangePassword from "./Pages/Password/ChangePassword";
import Profile from "./Pages/User/Profile";
import RestaurantList from "./Pages/Restaurant/RestaurantList";
import RequireAuth from "./Components/Auth/RequireAuth";
import CreateRestaurant from "./Pages/Restaurant/CreateRestaurant";
import RestaurantDetails from "./Pages/Restaurant/RestaurantDetails";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route path="/restaurant" element={<RestaurantList />} />
        <Route path="/restaurant/details" element={<RestaurantDetails />} />

        <Route
          element={
            <RequireAuth
              allowedRoles={["Restaurant", "DeliveryMan", "Customer"]}
            />
          }
        >
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["Restaurant"]} />}>
          <Route path="/create/Restaurant" element={<CreateRestaurant />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
