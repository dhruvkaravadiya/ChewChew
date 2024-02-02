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

  const { cartItems, totalBill } = useSelector((state) => state.cart);

  async function handleLogout() {
    await dispatch(logout());
  }

  function RestaurantExist(userId) {
    console.log(userId);
    console.log(restaurantData.some((res) => res.user_id === userId));
    return restaurantData.some((res) => res.user_id === userId);
  }

  return (
    <div className="navbar bg-base-100 px-32 py-5">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          {role || "Kouzina"}
        </Link>
      </div>

      <div className="flex-none gap-10">
        {/* <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div> */}
        <div className="dropdown dropdown-end">
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

          {/* <div
            tabIndex={0}
            className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">
                {cartItems?.length} Items
              </span>
              <span className="text-info">Total Amount: ₹ {totalBill} </span>
              <div className="card-actions">
                <Link className="btn btn-primary btn-block" to="/cart">
                  View cart
                </Link>
              </div>
            </div>
          </div> */}
        </div>

        {isLoggedIn ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
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
    // <div className="z-5 font-custom sticky shadow-lg px-44 w-full h-24 text-xl flex justify-between items-center bg-red-500 text-white font-Poppins xl:text-lg xl:px-24 lg:text-base lg:px-11 md:px-6 sm:px-1">
    //   <BrandLogo role={role} />

    //   <ul className="flex w-1/3 justify-between xl:w-1/2 lg:w-2/3">
    //     <li>
    //       <Link className="text-red-200 hover:text-white" to="/">
    //         Home
    //       </Link>
    //     </li>
    //     <li>
    //       <Link className="text-red-200 hover:text-white" to="/about">
    //         About Us
    //       </Link>
    //     </li>
    //     {isLoggedIn && role === "Customer" && (
    //       <li className="relative">
    //         <Link
    //           to="/cart"
    //           className="text-red-200 hover:text-white flex items-center"
    //         >
    //           <FaShoppingCart className="mr-2" />
    //           <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs text-red-200 absolute top-0 right-0 -mt-1 -mr-1">
    //             {cartItems?.length}
    //           </span>
    //         </Link>
    //       </li>
    //     )}

    //     {isLoggedIn && role === "Restaurant" && !RestaurantExist(data._id) && (
    //       <>
    //         <li>
    //           <div className="flex gap-5">
    //             <Link
    //               className="text-red-200 hover:text-white"
    //               to="/create/Restaurant"
    //             >
    //               Add Restaurant
    //             </Link>
    //           </div>
    //         </li>
    //       </>
    //     )}
    //     {!isLoggedIn ? (
    //       <li>
    //         <div className="flex gap-5">
    //           <Link className="text-red-200 hover:text-white" to="/login">
    //             Login
    //           </Link>
    //           <Link className="text-red-200 hover:text-white" to="/signup">
    //             Sign Up
    //           </Link>
    //         </div>
    //       </li>
    //     ) : (
    //       <>
    //         <Link to="/myorder" className="text-red-200 hover:text-white">
    //           ORDERS
    //         </Link>
    //         <div className="flex gap-5">
    //           <button
    //             className="text-red-200 hover:text-white"
    //             onClick={handleLogout}
    //           >
    //             logout
    //           </button>
    //           <Link className="text-red-200 hover:text-white" to="/profile">
    //             profile
    //           </Link>
    //         </div>
    //       </>
    //     )}
    //   </ul>
    // </div>
  );
};

export default Header;
