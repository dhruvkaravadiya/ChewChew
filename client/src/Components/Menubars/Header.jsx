import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Slices/authSlice.js";
import { Button } from "../ui/button.jsx";
import CartButton from "./Cart.jsx";
import Drawer from "./Drawer.jsx";
import { DropDownMenu } from "./DropDownMenu.jsx";

const Header = () => {
    const navigate = useNavigate();
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
        <div
            className="flex items-center justify-between
          py-2 lg:px-4 md:py-3 bg-white shadow-md"
        >
            <div className="flex items-center gap-3">
                {/* Side Bar */}
                <Drawer />
                <div className="">
                    {" "}
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2"
                    >
                        <SiteIcon className="" />
                        <span className="text-lg font-semibold">Chew Chew</span>
                    </Link>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="gap-4 rounded-full p-2 lg:mr-6 md:mr-1 sm:mr-0">
                    {role !== "Restaurant" && role !== "DeliveryMan" && (
                        <CartButton cartItems={cartItems} />
                    )}
                </div>

                <div className="flex items-center">
                    {isLoggedIn ? (
                        <DropDownMenu
                            data={data}
                            role={role}
                            handleLogout={handleLogout}
                            RestaurantExist={RestaurantExist}
                        />
                    ) : (
                        <div className="hidden sm:hidden md:flex lg:flex md:gap-4 lg:gap-4 gap-2 sm:gap-2">
                            <Button
                                onClick={() => navigate("/login")}
                                variant="link"
                                className=" hover:text-custom-red-2 text-custom-red-1 font-semibold "
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => navigate("/signup")}
                                className="bg-custom-red-1 hover:bg-custom-red-2 text-white rounded-xl font-semibold"
                            >
                                Sign Up
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Header;

// eslint-disable-next-line react/prop-types
export const SiteIcon = () => {
    // eslint-disable-next-line react/jsx-no-undef
    return (
        <div className=" sm:hidden lg:flex md:flex hidden">
            <img
                src="https://res.cloudinary.com/ddxq9mouk/image/upload/v1715963080/Portfolio/Food%20Ordering%20App/z47evx2lisarubrteuxm.jpg"
                width="34"
                height="34"
                alt="sitelogo"
            />
        </div>
    );
};
