import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// RequireAuth Component: Handles authentication and authorization for protected routes
const RequireAuth = ({ allowedRoles }) => {
  // Extract isLoggedIn and role from the Redux store's auth slice
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  // Conditional rendering based on authentication status and role
  return isLoggedIn && allowedRoles.includes(role) ? (
    // Render the nested content of the protected route
    <Outlet />
  ) : isLoggedIn ? (
    // Redirect to the denied page if the user's role is not allowed
    <Navigate to="/denied" />
  ) : (
    // Redirect to the login page if the user is not logged in
    <Navigate to="/login" />
  );
};

export default RequireAuth;
