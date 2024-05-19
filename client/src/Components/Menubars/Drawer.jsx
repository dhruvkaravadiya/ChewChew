import { SheetTrigger, SheetContent, Sheet } from "../ui/sheet.jsx";
import { HiMenuAlt2 } from "react-icons/hi";
import { Button } from "../ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHome } from "react-icons/ai";
import { HiShoppingBag } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa";
import MenuBarTab from "./MenuBarTab.jsx";

const CustomerTabs = [
    { itemname: "Home", link: "/", icon: <AiFillHome /> },
    { itemname: "Profile", link: "/profile", icon: <FaRegUser /> },
    { itemname: "My Orders", link: "/myorders", icon: <HiShoppingBag /> },
];

export default function Drawer() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, role, data } = useSelector((state) => state.auth);
    const { restaurantData } = useSelector((state) => state.restaurant);

    async function handleLogout() {
        await dispatch(logout());
    }

    function RestaurantExist(userId) {
        return restaurantData?.some((res) => res?.user_id === userId);
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className="lg:hidden border-none"
                    size="icon"
                    variant="outline"
                >
                    <HiMenuAlt2 className="h-6 w-6 fill-custom-red-2" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="p-2">
                    <div
                        to="/"
                        className="flex items-start justify-start gap-2"
                    >
                        <img
                            src="https://res.cloudinary.com/ddxq9mouk/image/upload/v1715963080/Portfolio/Food%20Ordering%20App/z47evx2lisarubrteuxm.jpg"
                            width="34"
                            height="34"
                            alt="sitelogo"
                        />
                        <span className="text-lg font-semibold">Chew Chew</span>
                    </div>
                    <div className="">
                        {isLoggedIn && role === "Customer" && (
                            <div className="flex flex-col h-[120px] justify-between mt-6">
                                <div className="flex flex-col gap-4 my-4">
                                    {CustomerTabs.map((tab, index) => {
                                        return (
                                            <MenuBarTab key={index} {...tab} />
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline "
                                    onClick={handleLogout}
                                    className="hover:text-custom-red-2 text-custom-red-1 mt-6 font-semibold border"
                                >
                                    Sign out
                                </Button>
                            </div>
                        )}
                    </div>
                    {/* {isLoggedIn && (
                        <>
                            <Link to="/profile">Profile</Link>
                            {role === "Restaurant" &&
                                !RestaurantExist(data?._id) && (
                                    <Link to="/create/Restaurant">
                                        Add Restaurant
                                    </Link>
                                )}
                            <Link to="/myorder">My Order</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    )} */}
                    {!isLoggedIn && (
                        <div className="flex flex-col md:gap-4 mt-14  gap-2 sm:gap-2">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/login")}
                                className=" hover:text-custom-red-2 text-custom-red-1 rounded-xl font-semibold"
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
            </SheetContent>
        </Sheet>
    );
}
