import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { logout } from "../Redux/Slices/authSlice.js";
import { useState } from "react";

export const BrandLogo = ({ role }) => {
  return (
    <Link to="/">
      <h1 className="bg-white rounded-full font-bold text-black p-2">{role}</h1>
    </Link>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, role, data } = useSelector((state) => state.auth);

  const { restaurantData } = useSelector((state) => state.restaurant);

  const { cartItems } = useSelector((state) => state.cart);

  async function handleLogout() {
    await dispatch(logout());
  }

  function RestaurantExist(userId) {
    return restaurantData?.some((res) => res?.user_id === userId);
  }

  return (
    <div className="navbar bg-[#FFFFFF] shadow-lg sm:px-4 lg:px-32 lg:py-5">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          {role || "Kouzina"}
        </Link>
      </div>

      <div className="flex-none gap-10">
        <div className="dropdown dropdown-end">
          <div>
            {role !== "Restaurant" && role !== "DeliveryMan" && (
              <Link
                to="/cart"
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">
                    {cartItems?.length}
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div>
          {isLoggedIn ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-12 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={data?.photo?.photoUrl}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link className="justify-between" to="/profile">
                    Profile
                  </Link>
                </li>
                {role === "Restaurant" && !RestaurantExist(data?._id) && (
                  <li>
                    <Link to="/create/Restaurant">Add Restaurant</Link>
                  </li>
                )}
                <li>
                  <Link to="/myorder">My Order</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg ml-4"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg ml-4"
              >
                sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
