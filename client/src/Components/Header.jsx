import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { logout } from "../Redux/Slices/AuthSlice.js";

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

  async function handleLogout() {
    await dispatch(logout());
  }
  return (
    <div className="z-5 sticky top-0 shadow-gray-300 shadow-lg px-44 w-full h-24 text-xl flex justify-between items-center bg-red-500 text-white font-Poppins xl:text-lg xl:px-24 lg:text-base lg:px-11 md:px-6 sm:px-1">
      <BrandLogo />

      <ul className="flex w-1/3 justify-between xl:w-1/2 lg:w-2/3">
        <li>
          <Link className="text-red-200 hover:text-white" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="text-red-200 hover:text-white" to="/about">
            About Project
          </Link>
        </li>
        <li>
          <Link className="flex" to="/cart">
            <FaShoppingCart />
            <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-base text-red-200 relative top-[-8] right-1">
              {/* {cartItems?.length}|| 10 */}10
            </span>
          </Link>
        </li>
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
