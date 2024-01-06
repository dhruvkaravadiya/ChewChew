import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { logout } from "../Redux/Slices/authSlice.js";
import { useState } from "react";

export const BrandLogo = () => {
  return (
    <Link to="/">
      <h1 className="bg-white rounded-full font-bold text-black p-2">
        TastyBites
      </h1>
    </Link>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  const { cartItems } = useSelector((state) => state.cart);

  async function handleLogout() {
    await dispatch(logout());
  }
  return (
    <div className="z-5 font-custom sticky shadow-lg px-44 w-full h-24 text-xl flex justify-between items-center bg-red-500 text-white font-Poppins xl:text-lg xl:px-24 lg:text-base lg:px-11 md:px-6 sm:px-1">
      <BrandLogo />

      <ul className="flex w-1/3 justify-between xl:w-1/2 lg:w-2/3">
        <li>
          <Link className="text-red-200 hover:text-white" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="text-red-200 hover:text-white" to="/about">
            About Us
          </Link>
        </li>
        <li className="relative">
          <Link
            to="/cart"
            className="text-red-200 hover:text-white flex items-center"
          >
            <FaShoppingCart className="mr-2" />
            <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs text-red-200 absolute top-0 right-0 -mt-1 -mr-1">
              {cartItems?.length}
            </span>
          </Link>
        </li>
        {isLoggedIn && role === "Restaurant" && (
          <>
            <li>
              <div className="flex gap-5">
                <Link
                  className="text-red-200 hover:text-white"
                  to="/create/Restaurant"
                >
                  Add Restaurant
                </Link>
              </div>
            </li>
            <li>
              <div className="flex gap-5">
                <Link
                  className="text-red-200 hover:text-white"
                  to="/create/Restaurant"
                >
                  DashBoard
                </Link>
              </div>
            </li>
          </>
        )}
        {!isLoggedIn ? (
          <li>
            <div className="flex gap-5">
              <Link className="text-red-200 hover:text-white" to="/login">
                Login
              </Link>
              <Link className="text-red-200 hover:text-white" to="/signup">
                Sign Up
              </Link>
            </div>
          </li>
        ) : (
          <div className="flex gap-5">
            <button
              className="text-red-200 hover:text-white"
              onClick={handleLogout}
            >
              logout
            </button>
            <Link className="text-red-200 hover:text-white" to="/profile">
              profile
            </Link>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Header;
